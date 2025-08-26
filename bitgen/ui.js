// ui.js

const editorCard = document.getElementById('editorCard');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const hideEditorBtn = document.getElementById('hideEditorBtn');
const previewArea = document.getElementById('previewArea');
const editBtn = document.getElementById('editBtn');
const htmlPreview = document.getElementById('htmlPreview');
const yamlInput = document.getElementById('yamlInput');

// Hide editor card (slide down)
hideEditorBtn.onclick = function() {
  editorCard.classList.add('hide');
};

// Show editor card (slide up)
editBtn.onclick = function() {
  editorCard.classList.remove('hide');
  editBtn.style.display = 'none';
};

// Preview button logic
previewBtn.onclick = function() {
  try {
    const yamlObj = parseBitYAML(yamlInput.value);
    const html = generateHTMLPartial(yamlObj);
    htmlPreview.innerHTML = html;
    editorCard.classList.add('hide');
    previewArea.classList.add('show');
    editBtn.style.display = 'inline-block';
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