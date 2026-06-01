# Playwright Sprint-Wise Testing Integration

## 🎯 Overview

Complete Playwright TypeScript implementation of sprint-wise testing system.

**Files Created:**

| File | Purpose |
|------|---------|
| `tests/utils/infra/sprint-manager.ts` | Core sprint management logic |
| `tests/utils/infra/sprint-fixtures.ts` | Playwright test fixtures |
| `tests/utils/infra/sprint-report-generator.ts` | Per-sprint report generation |
| `tests/utils/infra/sprint-test-runner.ts` | CLI test runner utility |
| `tests/specFiles/SPRINT_EXAMPLE.spec.ts` | Example test file |

---

## ✨ Features

✅ **Sprint Manager**
- Map Jira tickets to sprints
- Get sprint information
- Build grep patterns
- Find sprints by ticket
- Calculate sprint statistics

✅ **Playwright Fixtures**
- `sprintManager` - Access to sprint config
- `sprintInfo` - Current sprint information
- `testTypeInfo` - Test type information
- `grepPattern` - Auto-generated grep pattern

✅ **Report Generation**
- Individual sprint reports
- Combined sprint summary
- JSON export
- HTML output

✅ **CLI Test Runner**
- Command-line interface
- Environment variable support
- Configuration export
- Help documentation

---

## 🚀 How to Use

### **Method 1: Environment Variables (Simplest)**

```bash
# Run Sprint 16 regression tests
SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test tests/specFiles/ga/

# Run all sprints smoke tests
SPRINT=all TEST_TYPE=smoke ENV=local npx playwright test tests/specFiles/ga/
```

### **Method 2: TypeScript CLI Tool**

```bash
# Run Sprint 16 regression tests on dev
npx ts-node tests/utils/infra/sprint-test-runner.ts \
  --sprint 16 \
  --type regression \
  --env dev

# Run all sprints with default settings
npx ts-node tests/utils/infra/sprint-test-runner.ts --list-sprints
```

### **Method 3: Use PowerShell Script**

```bash
# Still works! Uses the same underlying system
./run-tests.bat
```

---

## 📋 Using Fixtures in Tests

### **Basic Usage**

```typescript
import { test, expect } from '../utils/infra/sprint-fixtures';

test('[GAAM-1098] My test', async ({ sprintInfo, testTypeInfo }) => {
  console.log(`Sprint: ${sprintInfo.name}`);
  console.log(`Type: ${testTypeInfo.type}`);
});
```

### **Access Sprint Manager**

```typescript
test('[GAAM-1098] My test', async ({ sprintManager }) => {
  // Get all sprints
  const sprints = sprintManager.listAllSprints();

  // Get sprint by number
  const sprint16 = sprintManager.getSprintByNumber(16);

  // Get tickets for sprint
  const tickets = sprintManager.getSprintTickets('sprint-16');

  // Find sprint by ticket
  const result = sprintManager.findSprintByTicket('GAAM-1098');
});
```

### **Get Grep Pattern**

```typescript
test('[GAAM-1098] My test', async ({ grepPattern }) => {
  // Already includes sprint + test type filtering
  console.log(`Grep Pattern: ${grepPattern}`);
  // Example: "(GAAM-1098|GAAM-1091|...) AND @regression"
});
```

---

## 💻 Command-Line Examples

### **Example 1: Sprint-Specific Regression**

```bash
# Run only Sprint 16 with regression tests
SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test tests/specFiles/ga/
```

**What happens:**
- Filters tests by: `GAAM-1098|GAAM-1091|GAAM-1080|GAAM-1068|GAAM-1024|GAAM-993`
- Only runs tests with `@regression` tag
- Runs on dev environment
- Generates sprint-16 report

### **Example 2: All Sprints Smoke Test**

```bash
# Quick sanity check across all sprints
SPRINT=all TEST_TYPE=smoke ENV=local npx playwright test tests/specFiles/ga/
```

**What happens:**
- Filters by all 50 GAAM tickets
- Only runs tests with `@smoke` tag
- Runs on local environment
- Generates combined sprint summary

### **Example 3: Using CLI Tool**

```bash
# Get help
npx ts-node tests/utils/infra/sprint-test-runner.ts --help

# List all sprints
npx ts-node tests/utils/infra/sprint-test-runner.ts --list-sprints

# List all test types
npx ts-node tests/utils/infra/sprint-test-runner.ts --list-types

# Run specific sprint
npx ts-node tests/utils/infra/sprint-test-runner.ts \
  --sprint 16 \
  --type regression \
  --env dev \
  --workers 4
```

---

## 📊 Test Organization

### **Test Naming Convention**

```typescript
// ✅ GOOD - Includes Jira ticket
test('[GAAM-1098] Button should render with text', async ({ page }) => {
  // This test will be auto-grouped under Sprint 16
});

test('[GAAM-1098-001] Primary button color @regression', async ({ page }) => {
  // Multiple tests for same ticket
});

// ❌ BAD - No Jira ticket
test('Button should render', async ({ page }) => {
  // Won't be included in sprint reports
});
```

### **Tag Usage**

```typescript
// Tests are filtered by tags
test('[GAAM-1098] Button basic @smoke', async () => {
  // Runs with: TEST_TYPE=smoke
});

test('[GAAM-1098] Button interaction @regression', async () => {
  // Runs with: TEST_TYPE=regression
});

test('[GAAM-1098] Button accessibility @a11y', async () => {
  // Can add custom tags
});
```

---

## 🔧 SprintManager API

### **Constructor**

```typescript
const manager = new SprintManager(); // Uses sprint-config.json
const manager = new SprintManager('/path/to/config.json');
```

### **Get Methods**

```typescript
// Get all sprints
const sprints = manager.getSprints();

// Get specific sprint
const sprint = manager.getSprint('sprint-16');

// Get sprint by number
const sprint = manager.getSprintByNumber(16);

// Get tickets in sprint
const tickets = manager.getSprintTickets('sprint-16');

// Get all tickets
const allTickets = manager.getAllTickets();

// Get sprint information
const info = manager.getSprintInfo('sprint-16');
// Returns: { name: 'Sprint 16', tickets: [...], ticketCount: 6 }
```

### **Pattern Methods**

```typescript
// Get grep pattern for specific sprint
const pattern = manager.getSprintGrepPattern('sprint-16');
// Returns: "(GAAM-1098|GAAM-1091|...)"

// Get grep pattern for all sprints
const pattern = manager.getAllSprintsGrepPattern();
// Returns: "(GAAM-48|GAAM-69|...all 50 tickets...)"

// Build complete grep pattern with test type
const pattern = manager.buildGrepPattern('sprint-16', 'regression');
// Returns: "(GAAM-1098|GAAM-1091|...) AND @regression"
```

### **Search Methods**

```typescript
// Find sprint by ticket
const result = manager.findSprintByTicket('GAAM-1098');
// Returns: { key: 'sprint-16', sprint: Sprint }

// Get tickets for multiple sprints
const tickets = manager.getTicketsForSprints(['sprint-15', 'sprint-16']);
// Returns: array of all tickets from both sprints
```

### **Statistics**

```typescript
// Get sprint stats
const stats = manager.getSprintStats('sprint-16');
// Returns: { name, ticketCount, percentage }

// List all sprints with stats
const sprints = manager.listAllSprints();
// Returns: array of { key, name, ticketCount }
```

### **Validation**

```typescript
// Validate sprint exists
if (manager.validateSprint('sprint-16')) {
  // Valid sprint
}

// Validate test type exists
if (manager.validateTestType('regression')) {
  // Valid test type
}
```

---

## 📈 Report Generation

### **Automatic Reports**

After tests complete, the following are generated:

```
test-results/
├─ sprint-report-sprint-16.html    ← Individual sprint report
├─ sprint-report-sprint-15.html
├─ sprint-summary-report.html      ← Combined summary
├─ sprint-summary.json             ← JSON export
└─ hierarchical-report.html        ← Existing report (still works)
```

### **Report Contents**

**Individual Sprint Report:**
```
📊 Sprint 16 Test Report

Summary:
├─ Total Tests: 20
├─ ✅ Passed: 18
├─ ❌ Failed: 2
└─ Pass Rate: 90%

Status: FAILED (red header)

Test Details:
├─ [GAAM-1098-001] Button renders - PASSED
├─ [GAAM-1098-002] Button color - FAILED
│  └─ Error: Color mismatch
└─ ...more tests...
```

**Combined Summary Report:**
```
📊 All Sprints Summary

Totals:
├─ Total Tests: 150
├─ ✅ Passed: 145
├─ ❌ Failed: 5
└─ Pass Rate: 96.7%

Sprints:
├─ Sprint 1 - 2 tests passed (100%)
├─ Sprint 2 - 3 tests passed (100%)
├─ ...
└─ Sprint 16 - 18/20 passed (90%)
```

---

## 🎯 Common Workflows

### **Workflow 1: Daily Development**

```bash
# Morning: Quick sanity check
SPRINT=sprint-16 TEST_TYPE=smoke ENV=local npx playwright test tests/specFiles/ga/

# Afternoon: After making changes
SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test tests/specFiles/ga/

# Evening: Before commit
SPRINT=sprint-16 TEST_TYPE=all ENV=dev npx playwright test tests/specFiles/ga/
```

### **Workflow 2: Pre-Release**

```bash
# Complete regression across all sprints
SPRINT=all TEST_TYPE=regression ENV=qa npx playwright test tests/specFiles/ga/

# Full test coverage
SPRINT=all TEST_TYPE=all ENV=qa npx playwright test tests/specFiles/ga/
```

### **Workflow 3: Bug Fix Verification**

```bash
# Run specific sprint where bug was fixed
SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test tests/specFiles/ga/

# Verify no regression in other sprints
SPRINT=all TEST_TYPE=smoke ENV=local npx playwright test tests/specFiles/ga/
```

---

## 🔌 Integration with Playwright Config

### **Using Environment Variables**

The fixtures automatically use environment variables:

```typescript
// playwright.config.ts
export default defineConfig({
  // Your config...
  // Fixtures will use:
  // - process.env.SPRINT
  // - process.env.TEST_TYPE
  // - process.env.ENV
});
```

### **Programmatic Usage**

```typescript
// Use SprintManager in setup/teardown
import { getSprintManager } from './sprint-manager';

const manager = getSprintManager();
const tickets = manager.getSprintTickets('sprint-16');
console.log(`Running tests for: ${tickets.join(', ')}`);
```

---

## 📚 Example Tests

See `tests/specFiles/SPRINT_EXAMPLE.spec.ts` for complete examples:

```typescript
// Example 1: Simple test with sprint info
test('[GAAM-1098] Button should render', async ({ sprintInfo }) => {
  console.log(`Sprint: ${sprintInfo.name}`);
});

// Example 2: Using sprint manager
test('[GAAM-1091] Feature banner', async ({ sprintManager }) => {
  const stats = sprintManager.getSprintStats('sprint-16');
  console.log(`${stats.name}: ${stats.ticketCount} tickets`);
});

// Example 3: Find sprint by ticket
test('[GAAM-1080] Dropdown', async ({ sprintManager }) => {
  const result = sprintManager.findSprintByTicket('GAAM-1080');
  console.log(`Found in: ${result.sprint.name}`);
});
```

---

## 🛠️ Advanced Usage

### **Custom Grep Patterns**

```typescript
// Build custom pattern
const manager = getSprintManager();

// Only Sprint 16 and 15
const tickets = manager.getTicketsForSprints(['sprint-15', 'sprint-16']);
const pattern = `(${tickets.join('|')})`;

// Run with custom pattern
npx playwright test --grep "${pattern}"
```

### **Script Integration**

```bash
#!/bin/bash

# Get all tickets for Sprint 16
SPRINT_16_TICKETS=$(npx ts-node -e "
  const { getSprintManager } = require('./tests/utils/infra/sprint-manager');
  const manager = getSprintManager();
  console.log(manager.getSprintTickets('sprint-16').join('|'));
")

# Run with extracted tickets
npx playwright test --grep "($SPRINT_16_TICKETS)"
```

---

## 📖 Documentation

Complete reference available in:
- `SPRINT_AUTOMATION_GUIDE.md` - PowerShell script guide
- `SPRINT_TESTING_README.md` - Quick overview
- This file - Playwright integration

---

## ✅ Checklist

- ✅ SprintManager - Manage sprints & tickets
- ✅ Playwright Fixtures - Easy test access
- ✅ Report Generator - Per-sprint reports
- ✅ CLI Tool - Command-line interface
- ✅ Example Tests - Reference implementation
- ✅ Environment Variables - Configuration
- ✅ All Working Together - Integrated system

---

## 🚀 Quick Start

### **Option 1: Use PowerShell (Easiest)**

```bash
# Still works and integrates with Playwright code
run-tests.bat
```

### **Option 2: Use Environment Variables**

```bash
SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test tests/specFiles/ga/
```

### **Option 3: Use CLI Tool**

```bash
npx ts-node tests/utils/infra/sprint-test-runner.ts --sprint 16 --type regression --env dev
```

### **Option 4: Direct in Tests**

```typescript
import { test } from '../utils/infra/sprint-fixtures';

test('[GAAM-1098] My test', async ({ sprintInfo, sprintManager }) => {
  // Full access to sprint system
});
```

---

## 🎉 You Now Have

✅ Playwright sprint-wise testing fully integrated
✅ TypeScript utilities for sprint management
✅ Automatic report generation per sprint
✅ CLI tool for command-line execution
✅ Fixtures for easy test access
✅ Multiple execution approaches
✅ Complete documentation

**Everything ready to use!** 🚀
