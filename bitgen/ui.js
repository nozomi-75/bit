// ui.js -- UI interaction logic

const editorCard = document.getElementById('editorCard');
const editorBody = document.getElementById('editorBody');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleEditorBtn = document.getElementById('toggleEditorBtn');
const toggleIcon = document.getElementById('toggleIcon');
const previewArea = document.getElementById('previewArea');
const htmlPreview = document.getElementById('htmlPreview');
const yamlInput = document.getElementById('yamlInput');

// Toggle editor card (collapse/expand)
toggleEditorBtn.onclick = function(e) {
  e.stopPropagation();
  editorCard.classList.toggle('collapsed');
  toggleIcon.innerHTML = editorCard.classList.contains('collapsed') ? '&uarr;' : '&darr;';
};

// Also allow clicking on header to toggle (for mobile)
editorCard.querySelector('.card-header').onclick = function(e) {
  if (e.target !== toggleEditorBtn && e.target !== toggleIcon) {
    editorCard.classList.toggle('collapsed');
    toggleIcon.innerHTML = editorCard.classList.contains('collapsed') ? '&uarr;' : '&darr;';
  }
};

// Preview button logic
previewBtn.onclick = function() {
  try {
    const yamlObj = parseBitYAML(yamlInput.value);
    const html = generateHTMLPartial(yamlObj);
    htmlPreview.innerHTML = html;
    previewArea.classList.add('show');
    window.scrollTo({top: 0, behavior: 'smooth'});
  } catch (e) {
    alert("YAML Error: " + e.message);
  }
};

// Download HTML partial
downloadBtn.onclick = function() {
  try {
    const yamlObj = parseBitYAML(yamlInput.value);
    const html = generateHTMLPartial(yamlObj);
    const blob = new Blob([html], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'slide.partial.html';
    a.click();
  } catch (e) {
    alert("YAML Error: " + e.message);
  }
};