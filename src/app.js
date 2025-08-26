import { config } from "../config.js";
import { SlideRouter } from "./router.js";
import { initTheme } from "./theme.js";
import { applyAppName } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Apply app name everywhere (title, about modal, placeholders)
  applyAppName(config.appName);

  // DOM references
  const slideContainer = document.getElementById("slide-container");
  const progressBar = document.getElementById("progress-bar");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

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
});
