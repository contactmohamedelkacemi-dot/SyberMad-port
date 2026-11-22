/* ============================================================
   SYBERMAD — Email sending configuration (EmailJS)
   ------------------------------------------------------------
   HOW TO ACTIVATE (5 minutes):
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (e.g. Gmail) → copy its SERVICE_ID
   3. Create an Email Template → copy its TEMPLATE_ID
      Use these variables in the template body:
        {{origin}}     — which form was used (Contact / Incident)
        {{subject}}    — selected subject / category
        {{full_name}}  — sender full name
        {{company}}    — company / organization
        {{email}}      — sender email (use as Reply-To)
        {{phone}}      — sender phone
        {{message}}    — the message
        {{details}}    — extra fields (incident form)
        {{to_email}}   — destination inbox
      Keep the template "To Email" field set to:
        {{to_email}}
   4. Account → General → copy your PUBLIC_KEY
   5. Paste the three values below. Nothing else to change.

   While the placeholders below are left as-is, the site
   automatically falls back to FormSubmit (no configuration
   needed) so the form keeps working either way.
   ============================================================ */

window.EMAILJS_CONFIG = {
  PUBLIC_KEY:  "J5dpt1v4wb-_cRTzo",
  SERVICE_ID:  "service_to6cbir",
  TEMPLATE_ID: "template_cvncram",
  TO_EMAIL:    "contact@sybermad.com"
};
