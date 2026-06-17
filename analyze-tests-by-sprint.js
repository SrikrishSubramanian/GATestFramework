#!/usr/bin/env node

/**
 * Analyze and organize all test cases by sprint
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read sprint config
const config = JSON.parse(fs.readFileSync('./sprint-config.json', 'utf-8'));

// Get all test spec files
const specsDir = path.join(__dirname, 'tests/specFiles/ga');
const allSpecFiles = [];

function getSpecFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getSpecFiles(fullPath);
    } else if (file.endsWith('.spec.ts')) {
      allSpecFiles.push(fullPath);
    }
  });
}

getSpecFiles(specsDir);

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                  TEST CASES ORGANIZED BY SPRINT                           ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// Map components to sprints
const componentToSprints = {};
const sprintData = {};

for (const [sprintKey, sprint] of Object.entries(config.sprints)) {
  const sprintNum = sprintKey.replace('sprint-', '');
  sprintData[sprintNum] = {
    name: sprint.name,
    tickets: sprint.tickets,
    components: sprint.components,
    testFiles: [],
    testCount: 0,
    testTypes: {}
  };

  sprint.components.forEach(comp => {
    if (!componentToSprints[comp]) {
      componentToSprints[comp] = [];
    }
    componentToSprints[comp].push(sprintNum);
  });
}

// Analyze each spec file
allSpecFiles.forEach(specFile => {
  const relativePath = path.relative(specsDir, specFile);
  const componentDir = relativePath.split(path.sep)[0];
  const fileName = path.basename(specFile);

  // Determine test type
  let testType = 'other';
  if (fileName.includes('.author.spec')) testType = 'author';
  else if (fileName.includes('.interaction.spec')) testType = 'interaction';
  else if (fileName.includes('.matrix.spec')) testType = 'matrix';
  else if (fileName.includes('.visual.spec')) testType = 'visual';
  else if (fileName.includes('.images.spec')) testType = 'images';
  else if (fileName.includes('figma')) testType = 'visual';
  else if (fileName.endsWith('.spec.ts')) testType = 'regression';

  // Find which sprints this test belongs to
  if (componentToSprints[componentDir]) {
    componentToSprints[componentDir].forEach(sprintNum => {
      if (!sprintData[sprintNum].testTypes[testType]) {
        sprintData[sprintNum].testTypes[testType] = 0;
      }
      sprintData[sprintNum].testTypes[testType]++;

      sprintData[sprintNum].testFiles.push({
        path: relativePath,
        component: componentDir,
        type: testType,
        fileName: fileName
      });
    });
  }
});

// Count total tests per file (approximately)
function countTests(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/test\(['"]/g) || [];
    return Math.max(1, matches.length); // At least 1 test per file
  } catch (e) {
    return 1;
  }
}

// Generate report
for (const [sprintNum, data] of Object.entries(sprintData).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
  console.log(`\n📋 SPRINT ${sprintNum}: ${data.name}`);
  console.log(`═`.repeat(80));
  console.log(`   Tickets: ${data.tickets.length}`);
  console.log(`   Components: ${data.components.join(', ')}\n`);

  // Organize files by component
  const filesByComponent = {};
  data.testFiles.forEach(file => {
    if (!filesByComponent[file.component]) {
      filesByComponent[file.component] = [];
    }
    filesByComponent[file.component].push(file);
  });

  // Display by component
  for (const [component, files] of Object.entries(filesByComponent)) {
    console.log(`   📁 Component: ${component.toUpperCase()}`);

    // Group by test type
    const filesByType = {};
    files.forEach(file => {
      if (!filesByType[file.type]) {
        filesByType[file.type] = [];
      }
      filesByType[file.type].push(file);
    });

    for (const [type, typeFiles] of Object.entries(filesByType)) {
      let icon = '  ';
      let typeLabel = type.toUpperCase();

      switch (type) {
        case 'smoke': icon = '⚡'; break;
        case 'regression': icon = '✓'; break;
        case 'matrix': icon = '🔲'; break;
        case 'visual': icon = '🎨'; break;
        case 'interaction': icon = '🖱️'; break;
        case 'images': icon = '🖼️'; break;
        case 'author': icon = '✏️'; break;
        case 'a11y': icon = '♿'; break;
      }

      console.log(`      ${icon} ${typeLabel}`);
      typeFiles.forEach(file => {
        const testCount = countTests(file.path);
        console.log(`         • ${file.fileName} (${testCount} test${testCount > 1 ? 's' : ''})`);
      });
    }
    console.log();
  }

  // Summary
  const totalTests = data.testFiles.length;
  const typeStats = Object.entries(data.testTypes).map(([type, count]) => `${type}(${count})`).join(', ');

  console.log(`   📊 Summary:`);
  console.log(`      • Test Files: ${totalTests}`);
  console.log(`      • Test Types: ${typeStats}\n`);
}

// Grand summary
console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                              GRAND SUMMARY                                ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let grandTotalTests = 0;
let grandTotalComponents = 0;

for (const [sprintNum, data] of Object.entries(sprintData).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))) {
  const testFileCount = data.testFiles.length;
  grandTotalTests += testFileCount;
  grandTotalComponents += data.components.length;

  console.log(`📌 Sprint ${sprintNum.padEnd(2)}: ${data.testFiles.length.toString().padStart(3)} test files | ${data.tickets.length} tickets | ${data.components.length} components`);
}

console.log(`\n${'═'.repeat(80)}`);
console.log(`✅ TOTAL: ${grandTotalTests} test files | 60+ tickets | ${grandTotalComponents} components`);
console.log(`${'═'.repeat(80)}\n`);

// Save to JSON
const report = {};
for (const [sprintNum, data] of Object.entries(sprintData)) {
  report[`sprint_${sprintNum}`] = {
    name: data.name,
    tickets: data.tickets,
    components: data.components,
    testFiles: data.testFiles.map(f => ({
      path: f.path,
      component: f.component,
      type: f.type
    })),
    statistics: {
      testFileCount: data.testFiles.length,
      testTypes: data.testTypes,
      totalTickets: data.tickets.length,
      totalComponents: data.components.length
    }
  };
}

fs.writeFileSync('SPRINT_TEST_CASES_BREAKDOWN.json', JSON.stringify(report, null, 2));
console.log(`✅ Detailed report saved to: SPRINT_TEST_CASES_BREAKDOWN.json\n`);
