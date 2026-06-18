const fs = require('fs');
const path = require('path');

const specDir = path.join(__dirname, 'tests', 'specFiles', 'ga');

function walkDir(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walkDir(specDir);
const components = {};

for (const file of allFiles) {
  const relPath = path.relative(specDir, file).replace(/\\/g, '/');
  const parts = relPath.split('/');

  let componentName, fileType;

  if (parts.length === 1) {
    componentName = path.basename(file, '.spec.ts');
    fileType = 'cross-component';
  } else {
    componentName = parts[0];
    const basename = path.basename(file, '.spec.ts');

    // Extract suffix (e.g., "author" from "button.author")
    const dotIndex = basename.lastIndexOf('.');
    if (dotIndex > 0) {
      fileType = basename.substring(dotIndex + 1);
    } else {
      fileType = basename.split('-').pop();
    }
  }

  if (!components[componentName]) {
    components[componentName] = {
      files: [],
      violations: []
    };
  }

  const content = fs.readFileSync(file, 'utf8');
  const hasConsoleCapture = /ConsoleCapture/.test(content);
  const hasAttachConsoleCapture = /attachConsoleCapture/.test(content);
  const hasReportEnhancer = /report-enhancer/.test(content);
  const hasAfterEach = /test\.afterEach/.test(content);

  components[componentName].files.push(fileType);

  // Check violations for non-.author files
  if (fileType !== 'author' && !hasConsoleCapture && !hasAttachConsoleCapture) {
    if (!components[componentName].violations.includes('missing_console_capture')) {
      components[componentName].violations.push('missing_console_capture');
    }
  }

  if (fileType !== 'author' && !hasReportEnhancer) {
    if (!components[componentName].violations.includes('missing_report_enhancer')) {
      components[componentName].violations.push('missing_report_enhancer');
    }
  }
}

const output = {
  totalSpecs: allFiles.length,
  components: []
};

for (const [name, data] of Object.entries(components).sort()) {
  const uniqueFiles = [...new Set(data.files)].sort();
  output.components.push({
    name,
    files: uniqueFiles,
    violations: data.violations
  });
}

console.log(JSON.stringify(output, null, 2));
