// Light / dark toggle. Keeps UI accessible and stores user choice.

export function initTheme(toggleBtn, icon) {
  if (!toggleBtn || !icon) return;

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      icon.classList.replace("bi-moon", "bi-sun");
      const span = toggleBtn.querySelector("span");
      if (span) span.textContent = "Light";
      toggleBtn.setAttribute("aria-pressed", "true");
    } else {
      icon.classList.replace("bi-sun", "bi-moon");
      const span = toggleBtn.querySelector("span");
      if (span) span.textContent = "Dark";
      toggleBtn.setAttribute("aria-pressed", "false");
    }
  }

  // initial: saved preference or system default
  const saved = localStorage.getItem("theme");
  if (saved) applyTheme(saved);
  else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  // toggling
  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}
