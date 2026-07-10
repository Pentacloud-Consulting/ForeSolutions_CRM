const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/#0F1C2E/g, 'var(--ink)');
  content = content.replace(/#C9A84C/g, 'var(--brand-cyan)');
  content = content.replace(/#E2E8F0/g, 'var(--border)');
  content = content.replace(/#F4F6F9/g, 'var(--paper)');
  content = content.replace(/bg-white/g, 'bg-surface');
  content = content.replace(/btn-gold/g, 'btn-primary');
  content = content.replace(/, fontFamily: "'Playfair Display', serif"/g, '');
  content = content.replace(/ fontFamily: "'Playfair Display', serif"/g, '');
  content = content.replace(/PENTAHOUSE/g, 'FORE SOLUTIONS');
  content = content.replace(/Pentahouse Constructions/g, 'Fore Solutions');
  content = content.replace(/#1A2332/g, 'var(--surface)');
  content = content.replace(/#D4B966/g, 'var(--brand-cyan)');
  content = content.replace(/#0A1420/g, 'var(--surface)');
  content = content.replace(/rgba\(15, 28, 46, 0.95\)/g, 'rgba(250, 250, 248, 0.95)'); // paper with opacity
  content = content.replace(/rgba\(201,168,76,0.3\)/g, 'rgba(0,169,224,0.3)'); // cyan with opacity
  content = content.replace(/rgba\(201, 168, 76, 0.1\)/g, 'rgba(0,169,224,0.1)'); // cyan with opacity
  content = content.replace(/rgba\(201, 168, 76, 0.3\)/g, 'rgba(0,169,224,0.3)'); // cyan with opacity
  content = content.replace(/rgba\(201,168,76,0.4\)/g, 'rgba(0,169,224,0.4)'); // cyan with opacity
  content = content.replace(/rgba\(201, 168, 76, 0.15\)/g, 'rgba(0,169,224,0.15)'); // cyan with opacity
  content = content.replace(/rgba\(201,168,76,0.15\)/g, 'rgba(0,169,224,0.15)'); // cyan with opacity
  content = content.replace(/text-white/g, 'text-[var(--ink)]');
  content = content.replace(/text-gray-300/g, 'text-gray-600');
  content = content.replace(/hover:text-white/g, 'hover:text-[var(--ink)]');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

replaceInFile('src/app/page.tsx');
