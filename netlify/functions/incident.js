const MAX_INCIDENT_FILES = 5;
const MAX_TOTAL_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const MAX_SINGLE_ATTACHMENT_SIZE = 4 * 1024 * 1024;
const ALLOWED_ATTACHMENT_EXTENSIONS = new Set([
  "xlsx", "xls", "ods", "docx", "docm", "doc", "csv", "pdf", "txt",
  "gif", "jpg", "jpeg", "png", "tif", "tiff", "rtf", "bmp", "cgm",
  "css", "shtml", "html", "htm", "zip", "xml", "ppt", "pptx", "tar",
  "ez", "ics", "mobi", "msg", "pub", "eps", "odt", "mp3", "m4a",
  "m4v", "wma", "ogg", "flac", "wav", "aif", "aifc", "aiff", "mp4",
  "mov", "avi", "mkv", "mpeg", "mpg", "wmv", "pkpass", "xlsm"
]);

const RECIPIENT_EMAIL = "contact@sybermad.com";
const COPY_EMAILS = [];

exports.handler = async (event) => {
  console.error("Incident function started");

  if (event.httpMethod !== "POST") {
    console.error("Incident function rejected method:", event.httpMethod);
    return jsonResponse(405, { ok: false, error: "method_not_allowed" });
  }

  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("Incident function missing BREVO_API_KEY");
      return jsonResponse(500, { ok: false, error: "missing_configuration" });
    }

    const parsed = parseMultipartEvent(event);
    console.error("Multipart parsing completed");
    console.error("Files received:", parsed.files.length);

    validateIncident(parsed);
    console.error("Incident validation completed");

    const attachments = parsed.files.map((file) => ({
      name: file.safeName,
      content: file.content.toString("base64")
    }));

    console.error("Brevo request started");
    const brevoResponse = await postBrevoEmail(buildBrevoPayload(parsed.fields, attachments));

    if (!brevoResponse.ok) {
      console.error("Brevo request failed with status:", brevoResponse.status);
      if (brevoResponse.error) console.error("Brevo request error:", brevoResponse.error);
      return jsonResponse(502, { ok: false, error: "email_failed" });
    }

    console.error("Brevo request completed");
    return jsonResponse(200, { ok: true });
  } catch (error) {
    const status = error.statusCode || 400;
    console.error("Incident function failed:", error.publicCode || error.message || "invalid_request");
    return jsonResponse(status, { ok: false, error: error.publicCode || "invalid_request" });
  }
};

async function postBrevoEmail(payload) {
  if (typeof fetch === "function") {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      return {
        ok: response.ok,
        status: response.status,
        error: response.ok ? "" : await safeReadBrevoError(response)
      };
    } catch (error) {
      console.error("Brevo request failed before response:", error.message || "network_error");
      throw publicError(502, "email_failed");
    }
  }

  return postJsonWithHttps("https://api.brevo.com/v3/smtp/email", payload, {
    "accept": "application/json",
    "api-key": process.env.BREVO_API_KEY,
    "content-type": "application/json"
  });
}

function postJsonWithHttps(url, payload, headers) {
  const https = require("https");
  const target = new URL(url);
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const req = https.request({
      method: "POST",
      hostname: target.hostname,
      path: target.pathname + target.search,
      headers: {
        ...headers,
        "content-length": Buffer.byteLength(body)
      }
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        resolve({
          ok,
          status: res.statusCode,
          error: ok ? "" : sanitizeBrevoError(Buffer.concat(chunks).toString("utf8"))
        });
      });
    });

    req.on("error", (error) => {
      console.error("Brevo request failed before response:", error.message || "network_error");
      reject(publicError(502, "email_failed"));
    });

    req.write(body);
    req.end();
  });
}

async function safeReadBrevoError(response) {
  try {
    return sanitizeBrevoError(await response.text());
  } catch (_error) {
    return "";
  }
}

function sanitizeBrevoError(body) {
  if (!body) return "";

  try {
    const parsed = JSON.parse(body);
    const code = parsed.code ? String(parsed.code) : "unknown";
    const message = parsed.message ? String(parsed.message) : "";
    return `${code}: ${message}`.slice(0, 300);
  } catch (_error) {
    return body.replace(/\s+/g, " ").slice(0, 300);
  }
}

function parseMultipartEvent(event) {
  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw publicError(400, "invalid_request");

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const body = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "binary");
  const parts = splitBuffer(body, boundary);
  const fields = {};
  const files = [];

  parts.forEach((part) => {
    let clean = part;
    if (clean.slice(0, 2).equals(Buffer.from("\r\n"))) clean = clean.slice(2);
    if (clean.slice(-2).equals(Buffer.from("\r\n"))) clean = clean.slice(0, -2);
    if (clean.length === 0 || clean.equals(Buffer.from("--"))) return;
    if (clean.slice(-2).equals(Buffer.from("--"))) clean = clean.slice(0, -2);

    const separatorIndex = clean.indexOf(Buffer.from("\r\n\r\n"));
    if (separatorIndex === -1) return;

    const rawHeaders = clean.slice(0, separatorIndex).toString("latin1");
    const content = clean.slice(separatorIndex + 4);
    const disposition = rawHeaders.match(/content-disposition:\s*form-data;([^\r\n]+)/i);
    if (!disposition) return;

    const name = getDispositionValue(disposition[1], "name");
    const filename = getDispositionValue(disposition[1], "filename");
    if (!name) return;

    if (filename) {
      if (content.length === 0) return;
      files.push({
        fieldName: name,
        originalName: filename,
        safeName: sanitizeFilename(filename),
        content
      });
    } else {
      fields[name] = content.toString("utf8").trim();
    }
  });

  return { fields, files };
}

function validateIncident(parsed) {
  const requiredFields = ["company", "name", "email", "phone", "description", "consent"];
  requiredFields.forEach((field) => {
    if (!parsed.fields[field]) throw publicError(400, "missing_required_fields");
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.fields.email)) {
    throw publicError(400, "invalid_email");
  }

  if (parsed.files.length > MAX_INCIDENT_FILES) {
    throw publicError(413, "too_many_files");
  }

  const totalSize = parsed.files.reduce((sum, file) => sum + file.content.length, 0);
  if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
    throw publicError(413, "attachments_too_large");
  }

  parsed.files.forEach((file) => {
    if (file.content.length > MAX_SINGLE_ATTACHMENT_SIZE) {
      throw publicError(413, "attachment_too_large");
    }

    const extension = getExtension(file.safeName);
    if (!extension || !ALLOWED_ATTACHMENT_EXTENSIONS.has(extension)) {
      throw publicError(415, "invalid_file_type");
    }
  });

  parsed.fields.attachment_names = parsed.files.length
    ? parsed.files.map((file) => file.safeName).join(", ")
    : "Aucune";
}

function buildBrevoPayload(fields, attachments) {
  const subject = fields._subject || "SyberMad - Declaration d'incident";
  const textContent = [
    "SECURITY INCIDENT DECLARATION",
    "",
    "CONTACT INFORMATION",
    `Company: ${fields.company || ""}`,
    `Full name: ${fields.name || ""}`,
    `Email: ${fields.email || ""}`,
    `Phone: ${fields.phone || ""}`,
    "",
    "AFFECTED ORGANIZATION",
    `Organization / affected entity: ${fields.organization || ""}`,
    "",
    "INCIDENT INFORMATION",
    `Incident type: ${fields.incident_type_label || fields.incident_type || ""}`,
    `Criticality: ${fields.criticality_label || fields.criticality || ""}`,
    `Date and time of detection: ${fields.detected_at || ""}`,
    "",
    "Incident description:",
    fields.description || "",
    "",
    "Systems / services affected:",
    fields.systems_affected || "",
    "",
    "Business impact:",
    fields.business_impact || "",
    "",
    "EMERGENCY",
    `Immediate callback requested: ${fields.immediate_callback_status || (fields.immediate_callback ? "Oui" : "Non")}`,
    "",
    "ATTACHMENTS",
    fields.attachment_names || "Aucune"
  ].join("\n");

  const htmlContent = textContent
    .split("\n")
    .map((line) => escapeHtml(line))
    .join("<br>");

  const payload = {
    sender: { email: RECIPIENT_EMAIL, name: "SyberMad" },
    to: [{ email: RECIPIENT_EMAIL }],
    cc: COPY_EMAILS.map((email) => ({ email })),
    replyTo: { email: fields.email, name: fields.name || fields.email },
    subject,
    textContent,
    htmlContent
  };

  if (attachments.length) payload.attachment = attachments;
  return payload;
}

function splitBuffer(buffer, delimiter) {
  const chunks = [];
  let start = 0;
  let index = buffer.indexOf(delimiter);

  while (index !== -1) {
    if (index > start) chunks.push(buffer.slice(start, index));
    start = index + delimiter.length;
    index = buffer.indexOf(delimiter, start);
  }

  if (start < buffer.length) chunks.push(buffer.slice(start));
  return chunks;
}

function getDispositionValue(disposition, key) {
  const match = disposition.match(new RegExp(`${key}="([^"]*)"`, "i"));
  return match ? match[1] : "";
}

function sanitizeFilename(filename) {
  const base = filename.split(/[\\/]/).pop() || "attachment";
  const sanitized = base.normalize("NFKD").replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "");
  return sanitized.slice(0, 120) || "attachment";
}

function getExtension(filename) {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot + 1).toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function publicError(statusCode, publicCode) {
  const error = new Error(publicCode);
  error.statusCode = statusCode;
  error.publicCode = publicCode;
  return error;
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store"
    },
    body: JSON.stringify(body)
  };
}
