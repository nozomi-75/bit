// bitgen-core.js
function parseBitYAML(yamlStr) {
  return jsyaml.load(yamlStr);
}

function generateHTMLPartial(yamlObj) {
  const slide = yamlObj.slide || {};
  let html = `<div class="container py-4">`;
  if (slide.title) html += `<h2 class="mb-4">${slide.title}</h2>`;
  (slide.sections || []).forEach(section => {
    if (section.type === "heading") {
      const sz = section.size || "h3";
      html += `<${sz} class="mb-2">${section.content}</${sz}>`;
    } else if (section.type === "text") {
      html += `<p>${section.content}</p>`;
    } else if (section.type === "button") {
      html += `<button class="btn btn-${section.style||'primary'} me-2" onclick="alert('Button clicked!')">${section.label}</button>`;
    } else if (section.type === "embed" && section.service === "mermaid") {
      html += `<pre class="bg-light rounded p-3"><code>${section.code}</code></pre>`;
    } else if (section.type === "card-group" && section.cards) {
      html += `<div class="row row-cols-1 row-cols-md-2 g-4 mb-3">`;
      section.cards.forEach(card => {
        html += `
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${card.title||""}</h5>
                <p class="card-text">${card.body||""}</p>
              </div>
              ${card.footer ? `<div class="card-footer text-end">${card.footer}</div>` : ""}
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }
  });
  html += `</div>`;
  return html;
}