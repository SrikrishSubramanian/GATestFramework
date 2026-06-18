#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern) {
  const result = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      result.push(...findFiles(fullPath, pattern));
    } else if (file.match(pattern)) {
      result.push(fullPath);
    }
  }

  return result;
}

const POM_DIR = path.join(__dirname, '../tests/pages/ga/components');
const pomFiles = findFiles(POM_DIR, /^[a-zA-Z]+Page\.ts$/);

console.log(`🔧 Updating ${pomFiles.length} POM files\n`);

let updated = 0;

pomFiles.forEach(pomFile => {
  try {
    let content = fs.readFileSync(pomFile, 'utf-8');
    const original = content;

    // Update the path from ./fileName.locators.json to ../../locators/fileName.locators.json
    const fileName = path.basename(pomFile, '.ts');

    // Replace: const registry = loadLocators(path.join(__dirname, 'fileName.locators.json'));
    // With:    const registry = loadLocators(path.join(__dirname, '../../locators/fileName.locators.json'));

    const oldPattern = `path.join(__dirname, '${fileName}.locators.json')`;
    const newPattern = `path.join(__dirname, '../../locators/${fileName}.locators.json')`;

    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPattern);
      fs.writeFileSync(pomFile, content, 'utf-8');
      console.log(`✓ ${path.basename(pomFile)}`);
      updated++;
    }
  } catch (error) {
    console.error(`✗ Error: ${path.basename(pomFile)}: ${error.message}`);
  }
});

console.log(`\n✅ Updated ${updated}/${pomFiles.length} POM files`);
