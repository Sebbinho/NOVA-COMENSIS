const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '..', '.next', 'static', 'css');
const targetDir = path.join(cssDir, 'app');
const shimPath = path.join(targetDir, 'layout.css');

function findHashedCss() {
  if (!fs.existsSync(cssDir)) return null;
  const entries = fs.readdirSync(cssDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith('.css')) {
      // Return a URL with POSIX separators so CSS @import works in browsers
      return `/_next/static/css/${e.name}`;
    }
  }
  return null;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeShim(importUrl) {
  ensureDir(targetDir);
  const content = `@import url('${importUrl}');\n`;
  fs.writeFileSync(shimPath, content, 'utf8');
  console.log('Created CSS shim:', shimPath);
}

const hashed = findHashedCss();
if (!hashed) {
  console.warn('No hashed CSS found in', cssDir, '- skipping shim creation (dev mode).');
} else {
  writeShim(hashed);
}
