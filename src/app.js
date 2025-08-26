import { config } from "../config.js";
import { SlideRouter } from "./router.js";
import { initTheme } from "./theme.js";
import { applyAppName } from "./utils.js";

/**
 * App bootstrapper.
 * - Applies app name
 * - Initializes theme handling
 * - Creates router and wires controls
 * - Lazily loads the About modal partial when requested
 */
document.addEventListener("DOMContentLoaded", () => {
  // Apply app name everywhere (title, placeholders)
  applyAppName(config.appName);

  // DOM references
  const slideContainer = document.getElementById("slide-container");
  const progressBar = document.getElementById("progress-bar");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const aboutBtn = document.getElementById("about-btn");
  const modalRoot = document.getElementById("modal-root");

  // init theme handling
  initTheme(themeBtn, themeIcon);

  // create the router and provide onChange callback to update buttons
  const router = new SlideRouter(config.slides, slideContainer, progressBar, {
    onChange: (index, total) => {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === total - 1;
    }
  });

  // button wiring
  prevBtn.addEventListener("click", () => router.prev());
  nextBtn.addEventListener("click", () => router.next());

  // keyboard left/right navigation
  document.addEventListener("keydown", (ev) => {
    // skip if user is typing in input/textarea
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (ev.key === "ArrowLeft") router.prev();
    if (ev.key === "ArrowRight") router.next();
  });

  // initial load (if no slides configured, show friendly message)
  if (!config.slides || config.slides.length === 0) {
    slideContainer.innerHTML = `<div class="text-center mt-5">
      <p class="lead">No slides configured. Edit <code>config.js</code> to add slide fragments under <code>/slides/</code>.</p>
    </div>`;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  } else {
    // load first slide; onChange will set button state
    router.goTo(0);
  }

  // About modal: lazy fetch + show when clicked.
  // The partial `partials/about.html` will contain the modal markup
  // and placeholders for the app name (data-insert-appname).
  aboutBtn.addEventListener("click", async () => {
    try {
      // Avoid re-fetching if already present
      if (!modalRoot.querySelector("#aboutModal")) {
        const res = await fetch("partials/about.html");
        if (!res.ok) throw new Error("Failed to fetch about partial");
        const html = await res.text();
        modalRoot.innerHTML = html;
        // insert app name placeholders
        applyAppName(config.appName);
      }

      // Show using Bootstrap's modal API
      const aboutEl = document.getElementById("aboutModal");
      if (aboutEl) {
        // eslint-disable-next-line no-undef
        const bsModal = new bootstrap.Modal(aboutEl);
        bsModal.show();
      }
    } catch (err) {
      console.error("Failed to load About modal:", err);
      // friendly fallback
      alert(`About: ${config.appName}`);
    }
  });
});
