const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

/**
 * Extract failed test cases from Playwright JSON report and generate Excel file
 * Usage: node scripts/extract-failed-tests.js [reportPath]
 */

async function extractFailedTests() {
  try {
    // Find the latest Playwright report
    const reportDir = path.join(__dirname, '../playwright-report');

    if (!fs.existsSync(reportDir)) {
      console.error('❌ No playwright-report directory found. Run tests first with Playwright.');
      process.exit(1);
    }

    // Look for index.json in the report
    const indexPath = path.join(reportDir, 'index.json');

    if (!fs.existsSync(indexPath)) {
      console.error('❌ No index.json found in playwright-report. Report may be corrupted.');
      process.exit(1);
    }

    // Read the report
    const reportData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    // Extract failed suites/tests
    const failedTests = [];

    if (reportData.suites && Array.isArray(reportData.suites)) {
      reportData.suites.forEach(suite => {
        extractFailedFromSuite(suite, failedTests, '');
      });
    }

    if (failedTests.length === 0) {
      console.log('✓ No failed tests found!');
      process.exit(0);
    }

    console.log(`Found ${failedTests.length} failed test case(s)`);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Failed Tests');

    // Add headers
    worksheet.columns = [
      { header: 'Test ID', key: 'testId', width: 12 },
      { header: 'Test Name', key: 'testName', width: 35 },
      { header: 'Component', key: 'component', width: 18 },
      { header: 'Test Path', key: 'testPath', width: 40 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Primary Error', key: 'error', width: 45 },
      { header: 'Assertion Failed', key: 'assertionFailed', width: 40 },
      { header: 'Expected Value', key: 'expectedValue', width: 30 },
      { header: 'Actual Value', key: 'actualValue', width: 30 },
      { header: 'Failure Location', key: 'failureLocation', width: 50 },
      { header: 'Error Stack Trace', key: 'errorDetails', width: 70 },
      { header: 'Remediation Steps', key: 'remediationSteps', width: 50 },
      { header: 'Duration (ms)', key: 'duration', width: 12 },
      { header: 'Browser', key: 'project', width: 12 },
      { header: 'Retries', key: 'retries', width: 8 },
      { header: 'Screenshot', key: 'hasScreenshot', width: 12 },
      { header: 'Report Link', key: 'reportLink', width: 25 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center', wrapText: true };

    // Add data rows
    failedTests.forEach((test, index) => {
      const row = worksheet.addRow({
        testId: `FT-${String(index + 1).padStart(4, '0')}`,
        testName: test.title,
        component: test.component,
        testPath: test.testPath,
        status: test.status,
        error: test.errorMessage,
        assertionFailed: test.assertionFailed,
        expectedValue: test.expectedValue,
        actualValue: test.actualValue,
        failureLocation: test.failureLocation,
        errorDetails: test.errorDetails,
        remediationSteps: test.remediationSteps,
        duration: test.duration,
        project: test.project,
        retries: test.retries,
        hasScreenshot: test.hasScreenshot,
        reportLink: test.reportLink
      });

      // Style data rows - alternate colors
      if (index % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      }

      // Make status cell red for failed
      if (test.status === 'failed') {
        row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF0000' } };
        row.getCell('status').font = { color: { argb: 'FFFFFFFF' }, bold: true };
      } else if (test.status === 'timedOut') {
        row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF9900' } };
        row.getCell('status').font = { color: { argb: 'FFFFFFFF' }, bold: true };
      }

      // Highlight critical error cells in yellow
      if (test.errorMessage) {
        row.getCell('error').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF00' } };
      }

      // Add hyperlink to report
      if (test.reportLink) {
        const cell = row.getCell('reportLink');
        cell.value = { text: 'View', hyperlink: test.reportLink };
        cell.font = { color: { argb: 'FF0563C1' }, underline: 'single' };
        cell.alignment = { horizontal: 'center' };
      }

      // Wrap text in all error/detail cells
      const wrapCells = ['error', 'assertionFailed', 'expectedValue', 'actualValue', 'failureLocation', 'errorDetails', 'remediationSteps', 'testPath'];
      wrapCells.forEach(cell => {
        const cellRef = row.getCell(cell);
        cellRef.alignment = { wrapText: true, vertical: 'top' };
      });

      // Set row height for better readability
      row.height = 30;
    });

    // Freeze header row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    // Add summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Count', key: 'count', width: 15 }
    ];

    // Group by status
    const byStatus = {};
    const byComponent = {};
    const byProject = {};

    failedTests.forEach(test => {
      byStatus[test.status] = (byStatus[test.status] || 0) + 1;
      byComponent[test.component] = (byComponent[test.component] || 0) + 1;
      byProject[test.project] = (byProject[test.project] || 0) + 1;
    });

    // Add summary data
    let rowNum = 1;
    summarySheet.getRow(rowNum).values = ['Metric', 'Count'];
    summarySheet.getRow(rowNum).font = { bold: true };
    summarySheet.getRow(rowNum).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    summarySheet.getRow(rowNum).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    rowNum++;
    summarySheet.getRow(rowNum).values = ['Total Failed Tests', failedTests.length];
    rowNum++;

    // Status breakdown
    summarySheet.getRow(rowNum).values = ['-- By Status --', ''];
    summarySheet.getRow(rowNum).font = { bold: true, italic: true };
    rowNum++;

    Object.entries(byStatus).forEach(([status, count]) => {
      summarySheet.getRow(rowNum).values = [`  ${status}`, count];
      rowNum++;
    });

    rowNum++;
    summarySheet.getRow(rowNum).values = ['-- By Component --', ''];
    summarySheet.getRow(rowNum).font = { bold: true, italic: true };
    rowNum++;

    Object.entries(byComponent).sort((a, b) => b[1] - a[1]).forEach(([component, count]) => {
      summarySheet.getRow(rowNum).values = [`  ${component}`, count];
      rowNum++;
    });

    rowNum++;
    summarySheet.getRow(rowNum).values = ['-- By Browser Project --', ''];
    summarySheet.getRow(rowNum).font = { bold: true, italic: true };
    rowNum++;

    Object.entries(byProject).forEach(([project, count]) => {
      summarySheet.getRow(rowNum).values = [`  ${project}`, count];
      rowNum++;
    });

    // Save Excel file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const excelPath = path.join(__dirname, `../reports/failed-tests-${timestamp}.xlsx`);

    // Create reports directory if it doesn't exist
    const reportsDir = path.dirname(excelPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    await workbook.xlsx.writeFile(excelPath);

    console.log(`\n✓ Excel report generated successfully!`);
    console.log(`📊 File: ${excelPath}`);
    console.log(`\n📈 Summary:`);
    console.log(`   Total Failed Tests: ${failedTests.length}`);
    console.log(`   By Status:`, byStatus);
    console.log(`   By Component:`, Object.keys(byComponent).length, 'components affected');
    console.log(`   By Project:`, byProject);

    console.log(`\n📋 Both reports available:`);
    console.log(`   1. Playwright HTML Report: ${reportDir}/index.html`);
    console.log(`   2. Excel Report: ${excelPath}`);

  } catch (error) {
    console.error('❌ Error extracting failed tests:', error.message);
    process.exit(1);
  }
}

function extractFailedFromSuite(suite, failedTests, parentPath) {
  const currentPath = parentPath ? `${parentPath} > ${suite.title}` : suite.title;

  // Process nested suites
  if (suite.suites && Array.isArray(suite.suites)) {
    suite.suites.forEach(nestedSuite => {
      extractFailedFromSuite(nestedSuite, failedTests, currentPath);
    });
  }

  // Process tests in this suite
  if (suite.tests && Array.isArray(suite.tests)) {
    suite.tests.forEach(test => {
      if (test.status === 'failed' || test.status === 'timedOut') {
        // Extract comprehensive error details
        let errorMessage = '';
        let errorDetails = '';
        let assertionFailed = '';
        let expectedValue = '';
        let actualValue = '';
        let failureLocation = '';
        let remediationSteps = '';
        let hasScreenshot = 'No';

        if (test.results && test.results.length > 0) {
          const result = test.results[test.results.length - 1];

          if (result.error) {
            errorMessage = result.error.message || 'Unknown error';
            errorDetails = result.error.stack ? result.error.stack.substring(0, 800) : '';

            // Parse error message for more details
            const parsed = parseErrorMessage(errorMessage, errorDetails);
            assertionFailed = parsed.assertionFailed;
            expectedValue = parsed.expectedValue;
            actualValue = parsed.actualValue;
            failureLocation = parsed.failureLocation;
            remediationSteps = parsed.remediationSteps;
          }

          // Check for attachments (screenshots, traces)
          if (result.attachments && result.attachments.length > 0) {
            const screenshot = result.attachments.find(a => a.name === 'screenshot');
            if (screenshot) {
              hasScreenshot = 'Yes';
            }
          }

          // Check for status message
          if (result.statusDetails) {
            if (result.statusDetails.duration) {
              failureLocation = `${failureLocation} (Timeout: ${result.statusDetails.duration}ms)`;
            }
          }
        }

        // Extract component name from path
        const component = extractComponent(currentPath);
        const filePath = test.location ? test.location.file : '';

        failedTests.push({
          title: test.title,
          testPath: currentPath,
          fullPath: filePath,
          component: component,
          status: test.status,
          errorMessage: errorMessage,
          assertionFailed: assertionFailed,
          expectedValue: expectedValue,
          actualValue: actualValue,
          failureLocation: failureLocation,
          errorDetails: errorDetails,
          remediationSteps: remediationSteps,
          duration: test.results && test.results[0] ? test.results[0].duration : 0,
          project: test.projectName || 'unknown',
          retries: test.results ? test.results.length - 1 : 0,
          hasScreenshot: hasScreenshot,
          reportLink: `index.html?testId=${encodeURIComponent(test.id)}`
        });
      }
    });
  }
}

function extractComponent(path) {
  // Try to extract component name from path like "button > button.author > should render"
  const parts = path.split('>').map(p => p.trim());
  if (parts.length > 1) {
    return parts[0]; // Return the first part as component
  }
  return 'unknown';
}

function parseErrorMessage(errorMessage, errorStack) {
  const result = {
    assertionFailed: '',
    expectedValue: '',
    actualValue: '',
    failureLocation: '',
    remediationSteps: ''
  };

  if (!errorMessage) {
    return result;
  }

  // Parse different types of errors
  const lower = errorMessage.toLowerCase();

  // 1. Timeout errors
  if (lower.includes('timeout') || lower.includes('timed out')) {
    result.assertionFailed = 'Timeout - Element or action did not complete in time';
    result.remediationSteps = '1. Check network speed\n2. Increase timeout value\n3. Verify element exists on page\n4. Check for JavaScript errors in console';
  }

  // 2. Element not found errors
  if (lower.includes('unable to find') || lower.includes('no element') || lower.includes('not found')) {
    result.assertionFailed = 'Element Not Found';
    result.remediationSteps = '1. Verify locator strategy is correct\n2. Check if element is in DOM\n3. Wait for dynamic content to load\n4. Check for visibility issues (hidden/off-screen)';
  }

  // 3. Visibility errors
  if (lower.includes('not visible') || lower.includes('hidden') || lower.includes('obscured')) {
    result.assertionFailed = 'Element Not Visible';
    result.remediationSteps = '1. Check CSS display/visibility\n2. Scroll element into view\n3. Wait for overlay to disappear\n4. Check z-index and positioning';
  }

  // 4. Assertion comparison errors
  if (lower.includes('expected') && lower.includes('to equal')) {
    result.assertionFailed = 'Value Assertion Failed';

    // Try to extract expected vs actual from message
    const expectedMatch = errorMessage.match(/expected[:\s]+([^,\n]+)/i);
    const actualMatch = errorMessage.match(/(?:but got|actual[:\s]+)([^,\n]+)/i);

    if (expectedMatch) result.expectedValue = expectedMatch[1].trim();
    if (actualMatch) result.actualValue = actualMatch[1].trim();

    result.remediationSteps = '1. Verify data in UI is correct\n2. Check response/API data\n3. Validate test expectations\n4. Look for data formatting issues';
  }

  // 5. Click/interaction errors
  if (lower.includes('click') || lower.includes('pointer events')) {
    result.assertionFailed = 'Interaction Failed - Cannot Click';
    result.remediationSteps = '1. Verify element is enabled\n2. Check for overlays blocking click\n3. Wait for page to fully load\n4. Scroll element into view\n5. Check pointer-events CSS';
  }

  // 6. Navigation/URL errors
  if (lower.includes('navigation') || lower.includes('url')) {
    result.assertionFailed = 'Navigation Failed';
    result.remediationSteps = '1. Verify target URL is correct\n2. Check network connectivity\n3. Verify redirect chains\n4. Check authentication status';
  }

  // 7. Text/Content errors
  if (lower.includes('text') && (lower.includes('found') || lower.includes('match'))) {
    result.assertionFailed = 'Text Content Assertion Failed';
    result.remediationSteps = '1. Verify text content in page\n2. Check for typos/case sensitivity\n3. Verify text is not truncated\n4. Check for special characters/encoding';
  }

  // Extract file location from stack trace
  if (errorStack) {
    const locationMatch = errorStack.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (locationMatch) {
      result.failureLocation = `${locationMatch[2]}:${locationMatch[3]} - ${locationMatch[1]}`;
    } else {
      // Try alternate format
      const altMatch = errorStack.match(/\((.+?):(\d+):(\d+)\)/);
      if (altMatch) {
        result.failureLocation = `${altMatch[1]}:${altMatch[2]}`;
      }
    }
  }

  // If we didn't match a specific error, use the full message
  if (!result.assertionFailed) {
    result.assertionFailed = errorMessage.substring(0, 200);
    result.remediationSteps = '1. Check error details and stack trace\n2. Review test and element locators\n3. Verify page state and content\n4. Check browser console for errors\n5. Run test in debug mode for more info';
  }

  return result;
}

// Run the extraction
extractFailedTests();
