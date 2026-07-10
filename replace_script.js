const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/#0F1C2E/g, 'var(--ink)');
  content = content.replace(/#C9A84C/g, 'var(--brand-cyan)');
  content = content.replace(/#E2E8F0/g, 'var(--border)');
  content = content.replace(/#F4F6F9/g, 'var(--paper)');
  content = content.replace(/bg-white/g, 'bg-surface');
  content = content.replace(/btn-gold/g, 'btn-primary');
  content = content.replace(/, fontFamily: "'Playfair Display', serif"/g, '');
  content = content.replace(/, fontFamily: '"Playfair Display", serif'/g, '');
  content = content.replace(/ shadow-sm/g, '');
  content = content.replace(/ shadow-md/g, '');
  content = content.replace(/ shadow-lg/g, '');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

walkDir('src/app/crm', replaceInFile);
walkDir('src/components/crm', replaceInFile);
