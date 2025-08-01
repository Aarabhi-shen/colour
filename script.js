function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToHSL(H) {
  H = H.replace(/^#/, '');
  if (H.length === 3) H = H.split('').map(c => c + c).join('');
  const r = parseInt(H.substr(0, 2), 16) / 255;
  const g = parseInt(H.substr(2, 2), 16) / 255;
  const b = parseInt(H.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function getTextColor(h, s, l) {
  return l > 60 ? '#000' : '#fff';
}

function generatePalette(type = 'medium') {
  const paletteEl = document.getElementById('palette');
  paletteEl.innerHTML = '';

  const baseHue = Math.floor(Math.random() * 360);
  const saturation = 70;
  const lightness = type === 'light' ? 70 : type === 'dark' ? 30 : 50;

  const step = 15;
  for (let i = -2; i <= 2; i++) {
    let hue = (baseHue + i * step + 360) % 360;
    let hex = hslToHex(hue, saturation, lightness);
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = hex;
    box.style.color = getTextColor(hue, saturation, lightness);
    box.textContent = hex.toUpperCase();
    paletteEl.appendChild(box);
  }
}

function getHexFromColorName(name) {
  const temp = document.createElement('div');
  temp.style.color = name;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  const rgb = computed.match(/\d+/g);
  if (!rgb) return null;
  return `#${((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1)}`;
}

function generateFromColorName() {
  const input = document.getElementById('hexInput').value.trim().toLowerCase();
  const hex = getHexFromColorName(input);
  if (!hex) {
    alert('Invalid color name. Try standard CSS color names like "red", "skyblue", etc.');
    return;
  }
  const { h, s, l } = hexToHSL(hex);
  const paletteEl = document.getElementById('palette');
  paletteEl.innerHTML = '';

  const step = 15;
  for (let i = -2; i <= 2; i++) {
    let hue = (h + i * step + 360) % 360;
    let newHex = hslToHex(hue, s, l);
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = newHex;
    box.style.color = getTextColor(hue, s, l);
    box.textContent = newHex.toUpperCase();
    paletteEl.appendChild(box);
  }
}

function generateContrastPalette() {
  const input = document.getElementById('hexInput').value.trim().toLowerCase();
  const hex = getHexFromColorName(input);

  if (!hex) {
    alert('Invalid color name. Try standard CSS color names like "red", "skyblue", etc.');
    return;
  }

  const { h, s, l } = hexToHSL(hex);
  const paletteEl = document.getElementById('palette');
  paletteEl.innerHTML = '';

  const contrastHues = [
    (h + 180) % 360,
    (h + 150) % 360,
    (h + 210) % 360
  ];

  contrastHues.forEach(ch => {
    const contrastHex = hslToHex(ch, Math.min(100, s + 10), 100 - l);
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = contrastHex;
    box.style.color = getTextColor(ch, s, 100 - l);
    box.textContent = contrastHex.toUpperCase();
    paletteEl.appendChild(box);
  });
}

generatePalette(); // Generate initial palette on load

