import chroma from '/src/chroma.js';

function hexToName(hex) {
  let bestName = null;
  let bestDist = Infinity;

  for (const [name, value] of Object.entries(chroma.colors)) {
    const d = chroma.deltaE(hex, value); // perceptual distance
    if (d < bestDist) {
      bestDist = d;
      bestName = name;
    }
  }

  const colorWords = [
    'alice', 'antique', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque',
    'black', 'blanched', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadet',
    'chartreuse', 'chocolate', 'coral', 'cornflower', 'cornsilk', 'crimson',
    'cyan', 'dark', 'deep', 'dim', 'dodger', 'firebrick', 'floral', 'forest',
    'fuchsia', 'gainsboro', 'ghost', 'gold', 'goldenrod', 'gray', 'green',
    'grey', 'honeydew', 'hot', 'indian', 'indigo', 'ivory', 'khaki', 'lavender',
    'lawn', 'lemon', 'light', 'lime', 'linen', 'magenta', 'maroon', 'medium',
    'midnight', 'mint', 'misty', 'moccasin', 'navajo', 'navy', 'old', 'olive',
    'orange', 'orchid', 'pale', 'papaya', 'peach', 'peru', 'pink', 'plum',
    'powder', 'purple', 'rebecca', 'red', 'rosy', 'royal', 'saddle', 'salmon',
    'sandy', 'sea', 'seashell', 'sienna', 'silver', 'sky', 'slate', 'snow',
    'spring', 'steel', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
    'violet', 'wheat', 'white', 'yellow'
  ].sort((a, b) => b.length - a.length);

  function splitName(value) {
    if (!value) return [];
    for (const word of colorWords) {
      if (value.startsWith(word)) {
        const rest = splitName(value.slice(word.length));
        if (rest) return [word, ...rest];
      }
    }
    return null;
  }

  const words = splitName(bestName.toLowerCase()) || [bestName];
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function findTextContrast(hex) {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const luminance = channels
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

console.log(hexToName('#ff6347')); // "tomato" (exact match)
console.log(hexToName('#0a0a90')); // "navy" (nearest)

expose("TASTEOFCOLORS_FETCHNAME", hexToName);

// Image import and palette controls are optional, so this module remains usable
// on pages that only need the color-name function.
if (typeof document !== 'undefined') {
  const importContainer = document.getElementById('TASTEOFCOLORS_IMPORTCONTAINER');
  const importedImage = document.getElementById('TASTEOFCOLORS_IMPORTEDIMAGE');
  const exportButton = document.getElementById('TASTEOFCOLORS_EXPORT');
  const removeButton = document.getElementById('TASTEOFCOLORS_IMPORTREMOVE');
  const seedControl = document.getElementById('TASTEOFCOLORS_RANSOMSEED');
  const countControl = document.getElementById('TASTEOFCOLORS_COLORPALLETES');
  const table = document.getElementById('TASTEOFCOLORS_TABLECOLORS');

  if (importContainer && importedImage && table) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
    fileInput.hidden = true;
    importContainer.appendChild(fileInput);

    let canvas = document.getElementById('TASTEOFCOLORS_CANVAS');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'TASTEOFCOLORS_CANVAS';
      canvas.hidden = true;
      (importedImage.parentElement || importContainer.parentElement || importContainer).appendChild(canvas);
    }
    let imageUrl = null;
    let palette = [];

    const showImage = shown => {
      importContainer.hidden = !shown;
      importedImage.hidden = !shown;
      importedImage.style.display = shown ? '' : 'none';
    };

    function renderTable() {
      table.replaceChildren();
      const fragment = document.createDocumentFragment();
      palette.slice(0, 200).forEach(hex => {
          const cell = document.createElement('div');
          cell.className = 'SWATCH';
          cell.style.backgroundColor = hex;
          cell.style.color = findTextContrast(hex);
          const title = document.createElement('p');
          title.className = 'SWATCH_TITLE';
          title.textContent = hexToName(hex);
          const hexCode = document.createElement('small');
          hexCode.className = 'SWATCH_HEXCODE';
          hexCode.textContent = hex;
          const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
          const k = 1 - Math.max(...rgb);
          const cmyk = k === 1 ? [0, 0, 0, 1] : [
            (1 - rgb[0] - k) / (1 - k), (1 - rgb[1] - k) / (1 - k),
            (1 - rgb[2] - k) / (1 - k), k
          ];
          const details = document.createElement('small');
          const br = document.createElement('br')
          details.className = 'SWATCH_CMYK';
          details.textContent = `CMYK: ${cmyk.map(value => `${Math.round(value * 100)}%`).join(', ')}`;
          cell.append(title, br, hexCode, br, details);
            fragment.appendChild(cell);
      });
          table.appendChild(fragment);
    }

    function generatePalette() {
      if (!importedImage.naturalWidth) return;
      const width = Math.min(importedImage.naturalWidth, 512);
      const height = Math.max(1, Math.round(importedImage.naturalHeight * width / importedImage.naturalWidth));
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(importedImage, 0, 0, width, height);
      let pixels;
      try {
        pixels = context.getImageData(0, 0, width, height).data;
      } catch (_) {
        return;
      }
      const countValue = Number.parseInt(countControl && countControl.value, 10);
      const count = Math.max(45, Math.min(200, Number.isFinite(countValue) ? countValue : 45));
      const seedValue = Number.parseInt(seedControl && seedControl.value, 10);
      const seed = Math.max(0, Math.min(64, Number.isFinite(seedValue) ? seedValue : Math.floor(Math.random() * 65)));
      let state = (seed + 1) >>> 0;
      const random = () => {
        state = (state + 0x6D2B79F5) >>> 0;
        let value = state;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
      };
      palette = [];
      for (let i = 0; i < count; i++) {
        const pixel = Math.floor(random() * width * height) * 4;
        palette.push(`#${[pixels[pixel], pixels[pixel + 1], pixels[pixel + 2]]
          .map(channel => channel.toString(16).padStart(2, '0')).join('')}`);
      }
      renderTable();
    }

    function removeImage() {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      imageUrl = null;
      importedImage.src = "";
      palette = [];
      renderTable();
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      showImage(false);
    }

    function loadFile(file) {
      if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) return;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      imageUrl = URL.createObjectURL(file);
      importedImage.onload = () => {
        showImage(true);
        generatePalette();
      };
      importedImage.onerror = removeImage;
      importedImage.src = imageUrl;
    }

    function exportAse() {
      if (!palette.length) return;
      const blocks = palette.map(hex => {
        const name = `${hexToName(hex)} ${hex}`;
        const nameLength = name.length + 1;
        const length = 2 + nameLength * 2 + 4 + 12 + 2;
        const block = new Uint8Array(6 + length);
        const view = new DataView(block.buffer);
        view.setUint16(0, 1);
        view.setUint32(2, length);
        view.setUint16(6, nameLength);
        for (let i = 0; i < name.length; i++) view.setUint16(8 + i * 2, name.charCodeAt(i));
        let offset = 8 + nameLength * 2;
        block.set([0x52, 0x47, 0x42, 0x20], offset); // RGB color model
        offset += 4;
        for (const i of [1, 3, 5]) {
          view.setFloat32(offset, parseInt(hex.slice(i, i + 2), 16) / 255);
          offset += 4;
        }
        view.setUint16(offset, 0); // global color
        return block;
      });
      const output = new Uint8Array(12 + blocks.reduce((sum, block) => sum + block.length, 0));
      const header = new DataView(output.buffer);
      output.set([0x41, 0x53, 0x45, 0x46]);
      header.setUint16(4, 1);
      header.setUint16(6, 0);
      header.setUint32(8, blocks.length);
      let offset = 12;
      blocks.forEach(block => { output.set(block, offset); offset += block.length; });
      const url = URL.createObjectURL(new Blob([output], { type: 'application/octet-stream' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'taste-of-colors.ase';
      link.click();
      URL.revokeObjectURL(url);
    }

    importContainer.addEventListener('click', event => {
      if (event.target !== fileInput) fileInput.click();
    });
    fileInput.addEventListener('change', () => loadFile(fileInput.files[0]));
    importContainer.addEventListener('dragover', event => event.preventDefault());
    importContainer.addEventListener('drop', event => {
      event.preventDefault();
      loadFile(event.dataTransfer.files[0]);
    });
    if (removeButton) removeButton.addEventListener('click', removeImage);
    if (exportButton) exportButton.addEventListener('click', exportAse);
    [seedControl, countControl].forEach(control => {
      if (control) control.addEventListener('change', generatePalette);
    });

    seedControl.addEventListener("input", (e) => {
        const text = document.getElementById('TASTEOFCOLORS_RANSOMSEED_TEXT');
        text.textContent = Number(e.target.value)
    })

    countControl.addEventListener("input", (e) => {
        const text = document.getElementById('TASTEOFCOLORS_COLORPALLETES_TEXT');
        text.textContent = Number(e.target.value)
    })

    showImage(false);
  }
}

