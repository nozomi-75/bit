// Small helpers. Keep them simple and well commented.

export function applyAppName(appName) {
  if (!appName) return;

  // page title
  document.title = appName;

  // About modal title
  const aboutLabel = document.getElementById("aboutModalLabel");
  if (aboutLabel) aboutLabel.textContent = `About ${appName}`;

  // replace any placeholders
  document.querySelectorAll("[data-insert-appname]").forEach((el) => {
    el.textContent = appName;
  });
}
