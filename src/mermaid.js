/**
 * mermaid.js
 * Encapsulates mermaid initialization and rendering so other modules don't import the CDN directly.
 * This module uses the ESM build from the CDN.
 */

import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

/**
 * Initialize mermaid once with sane defaults.
 * Call early in app startup.
 */
export function initMermaid() {
  try {
    mermaid.initialize({
      theme: "default",
      securityLevel: "loose",
      flowchart: { defaultRenderer: "elk", curve: "basis" }
    });
  } catch (err) {
    // keep failure contained; router will still function
    console.warn("Mermaid initialization failed:", err);
  }
}

/**
 * Run mermaid rendering for diagrams matching the provided selector.
 * @param {string} selector - query selector for mermaid containers (default: ".mermaid")
 */
export async function runMermaid(selector = ".mermaid") {
  try {
    await mermaid.run({ querySelector: selector });
  } catch (err) {
    console.warn("Mermaid render error:", err);
  }
}
