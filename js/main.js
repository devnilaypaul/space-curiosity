export function initChrome() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Close" : "Menu";
    });
    links.addEventListener("click", (e) => {
      if (e.target.closest("a") && links.classList.contains("open")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "Menu";
        btn.focus();
      }
    });
  }

  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
  });
}
