export function initStarfield() {
  const canvas = document.getElementById("stars");
  const toggle = document.getElementById("stars-toggle");
  if (!canvas) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (toggle) {
      toggle.setAttribute("aria-pressed", "false");
      toggle.textContent = "Play stars";
    }
    return;
  }
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w = 0;
  let h = 0;
  let running = true;
  let raf = 0;

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    stars = Array.from({ length: Math.min(220, Math.floor((w * h) / 9000)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      s: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.6 + 0.25
    }));
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const st of stars) {
      st.y += st.s;
      if (st.y > h) st.y = 0;
      ctx.globalAlpha = st.o;
      ctx.fillStyle = "#dbeafe";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }

  function setRunning(next) {
    running = next;
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(next));
      toggle.textContent = next ? "Pause stars" : "Play stars";
    }
    if (next) {
      cancelAnimationFrame(raf);
      tick();
    } else {
      cancelAnimationFrame(raf);
    }
  }

  if (toggle) {
    toggle.addEventListener("click", () => setRunning(!running));
  }

  resize();
  addEventListener("resize", resize);
  tick();
}
