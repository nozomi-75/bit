// This handles loading slide fragments, rendering Mermaid diagrams, and updating progress.
// It accepts an optional onChange callback which is called after each successful navigation.

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

export class SlideRouter {
  /**
   * @param {string[]} slides - array of slide URLs
   * @param {HTMLElement} container - where to inject slide HTML
   * @param {HTMLElement} progressBar - element whose width shows progress
   * @param {object} options - { onChange: fn(index, total) }
   */
  constructor(slides, container, progressBar, options = {}) {
    this.slides = Array.isArray(slides) ? slides : [];
    this.container = container;
    this.progressBar = progressBar;
    this.index = 0;
    this.onChange = typeof options.onChange === "function" ? options.onChange : () => {};

    // configure mermaid once
    mermaid.initialize({
      theme: "default",
      securityLevel: "loose",
      flowchart: { defaultRenderer: "elk", curve: "basis" }
    });
  }

  get total() {
    return this.slides.length;
  }

  get currentIndex() {
    return this.index;
  }

  async goTo(n) {
    if (n < 0 || n >= this.total) return;
    this.index = n;
    await this._load(this.slides[this.index]);
    this._updateProgress();
    // notify caller (update UI buttons, etc.)
    this.onChange(this.index, this.total);
  }

  next() {
    this.goTo(this.index + 1);
  }

  prev() {
    this.goTo(this.index - 1);
  }

  async _load(url) {
    if (!this.container) return;
    this.container.classList.add("fade-out");
    // short delay for fade
    await new Promise((r) => setTimeout(r, 250));

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url} (status ${res.status})`);
      const html = await res.text();

      this.container.classList.remove("fade-out");
      this.container.innerHTML = html;
      this.container.classList.add("fade-in");

      // render mermaid diagrams if present
      await mermaid.run({ querySelector: ".mermaid" });
    } catch (err) {
      console.error("Slide load error:", err);
      this.container.innerHTML = `<p class="text-danger text-center mt-5">Failed to load content.</p>`;
    }
  }

  _updateProgress() {
    if (!this.progressBar) return;
    const pct = this.total ? ((this.index + 1) / this.total) * 100 : 0;
    this.progressBar.style.width = `${pct}%`;
  }
}
