/* ============================================================
   SYBERMAD — Animated-logo controls (logo-animation.html)
   Play / Pause / Restart for the isolated homepage logo animation.
   Motion itself lives in CSS (identical to the homepage mark); this
   only toggles animation-play-state and re-clones to restart.
   ============================================================ */
(function () {
  const stage = document.getElementById("animStage");
  if (!stage) return;

  const btnPlay    = document.getElementById("animPlay");
  const btnPause   = document.getElementById("animPause");
  const btnRestart = document.getElementById("animRestart");

  const setPlaying = (playing) => {
    stage.classList.toggle("is-paused", !playing);
    if (btnPlay)  btnPlay.setAttribute("aria-pressed", String(playing));
    if (btnPause) btnPause.setAttribute("aria-pressed", String(!playing));
  };

  btnPlay  && btnPlay.addEventListener("click", () => setPlaying(true));
  btnPause && btnPause.addEventListener("click", () => setPlaying(false));

  // Restart: cloning the SVG restarts every CSS animation from t=0.
  btnRestart && btnRestart.addEventListener("click", () => {
    const svg = stage.querySelector("svg");
    if (!svg) return;
    const fresh = svg.cloneNode(true);
    svg.replaceWith(fresh);
    setPlaying(true);
  });

  setPlaying(true);
})();
