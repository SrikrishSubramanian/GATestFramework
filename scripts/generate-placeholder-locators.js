#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all POM files
const componentDir = path.join(__dirname, '../tests/pages/ga/components');
const locatorsDir = path.join(__dirname, '../tests/pages/ga/locators');

// Ensure locators directory exists
if (!fs.existsSync(locatorsDir)) {
  fs.mkdirSync(locatorsDir, { recursive: true });
}

const pomFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.ts'));

console.log(`\n${'='.repeat(80)}`);
console.log(`🔧 GENERATE PLACEHOLDER LOCATOR JSON FILES`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${pomFiles.length} POM files...\n`);

let created = 0;
let skipped = 0;

// Template for placeholder locators
const createPlaceholderLocators = (componentName) => {
  return {
    entries: {
      [`${componentName}Root`]: {
        strategies: [
          {
            type: "css",
            selector: `.cmp-${componentName.toLowerCase().replace(/page$/i, '')}`,
            confidence: 0.8
          },
          {
            type: "xpath",
            selector: `//div[@class='cmp-${componentName.toLowerCase().replace(/page$/i, '')}']`,
            confidence: 0.7
          }
        ],
        primary: "css"
      }
    }
  };
};

pomFiles.forEach(pomFile => {
  const componentName = pomFile.replace('.ts', '');
  const locatorFile = path.join(locatorsDir, `${componentName}.locators.json`);

  if (fs.existsSync(locatorFile)) {
    process.stdout.write('·');
    skipped++;
  } else {
    try {
      const placeholders = createPlaceholderLocators(componentName);
      fs.writeFileSync(
        locatorFile,
        JSON.stringify(placeholders, null, 2),
        'utf-8'
      );
      process.stdout.write('✓');
      created++;
    } catch (error) {
      process.stdout.write('✗');
      console.error(`\nError creating ${locatorFile}: ${error.message}`);
    }
  }
});

console.log(`\n\n${'='.repeat(80)}`);
console.log(`✅ RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`Placeholder locator files created: ${created}`);
console.log(`Already existing:                   ${skipped}`);
console.log(`Total:                              ${created + skipped}`);

console.log(`\n📁 Location: tests/pages/ga/locators/\n`);

console.log(`${'='.repeat(80)}`);
console.log(`⚠️  NEXT STEPS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`These are PLACEHOLDER locators with basic selectors.`);
console.log(`To update with REAL locators, use playwright-agent:\n`);

console.log(`  COMPONENT=button npx playwright test generate-components \\`);
console.log(`    --config playwright.generators.config.ts \\`);
console.log(`    --project chromium\n`);

console.log(`This will scan live AEM DOM and generate accurate locators.\n`);
