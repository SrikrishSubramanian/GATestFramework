# Deployment & Testing Master Guide

**Last Updated:** 2026-06-19  
**Consolidated From:** 20+ individual deployment/testing documents  
**Scope:** Complete guide for test execution and environment setup

---

## 🎯 Quick Navigation

- **First-time setup?** → Go to [Setup Instructions](#setup-instructions)
- **Ready to test?** → Go to [Running Tests](#running-tests)
- **Deploying to environment?** → Go to [Deployment](#deployment)
- **Troubleshooting?** → Go to [Common Issues](#common-issues)

---

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm 8+ installed
- Git installed
- AEM instance accessible (for local testing)

### Step 1: Install Dependencies
```bash
npm install
npx playwright install
```

### Step 2: Configure Environment
```bash
# Copy template
cp tests/environments/.env.local.example tests/environments/.env.local

# Edit with your credentials
# Required variables:
# - AEM_AUTHOR_URL=http://localhost:4502
# - AEM_AUTHOR_USERNAME=your-username
# - AEM_AUTHOR_PASSWORD=your-password
# - BASE_URL=http://localhost:4502
```

### Step 3: Verify Installation
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Verify AEM connectivity
curl http://localhost:4502/system/console

# List all tests
npx playwright test tests/specFiles/ga --dry-run
```

### Step 4: Run Sample Test
```bash
env=local npx playwright test tests/specFiles/ga/button/ --project chromium
```

---

## 🧪 Running Tests

### Basic Test Execution

**Run all tests (single browser):**
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium
```

**Run specific component:**
```bash
env=local npx playwright test tests/specFiles/ga/button/ --project chromium
env=local npx playwright test tests/specFiles/ga/text/ --project chromium
```

**Run with tag filter:**
```bash
# Smoke tests only
npx playwright test --grep @smoke

# Regression tests only
npx playwright test --grep @regression

# Accessibility tests only
npx playwright test --grep @a11y

# Mobile tests
npx playwright test --grep @mobile
```

### Advanced Test Execution

**Parallel execution (4 workers):**
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
```

**Run across multiple browsers:**
```bash
env=local npx playwright test tests/specFiles/ga/ \
  --project chromium \
  --project webkit \
  --project firefox
```

**Run with specific headed mode (see browser):**
```bash
env=local npx playwright test tests/specFiles/ga/button/ --headed
```

**Run with debugging:**
```bash
env=local npx playwright test tests/specFiles/ga/button/ --debug
```

**Generate HTML report:**
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium
npx playwright show-report
```

### Environment-Specific Testing

Each environment uses its own `.env.<env>` file:

```bash
# Local (development)
env=local npx playwright test tests/specFiles/ga/ --project chromium

# Development AEM
env=dev npx playwright test tests/specFiles/ga/ --project chromium

# QA environment
env=qa npx playwright test tests/specFiles/ga/ --project chromium

# UAT environment
env=uat npx playwright test tests/specFiles/ga/ --project chromium

# Production (read-only testing)
env=prod npx playwright test tests/specFiles/ga/ --project chromium
```

### Test Filtering

**By component:**
```bash
npx playwright test tests/specFiles/ga/button/
npx playwright test tests/specFiles/ga/text/
npx playwright test tests/specFiles/ga/navigation/
```

**By test type:**
```bash
# Author (happy path) tests
npx playwright test --grep "\.author\.spec"

# Interaction tests
npx playwright test --grep "\.interaction\.spec"

# Matrix (combinatorial) tests
npx playwright test --grep "\.matrix\.spec"

# Visual regression tests
npx playwright test --grep "\.visual\.spec"

# Image validation tests
npx playwright test --grep "\.images\.spec"
```

**By filename pattern:**
```bash
npx playwright test button.author.spec.ts
npx playwright test tests/specFiles/ga/button/
npx playwright test --grep "button|text"
```

### CI/CD Pipeline Execution

**Mobile tests (used in CI):**
```bash
npx playwright test --grep @mobile \
  --project "Mobile Chrome" \
  --project "Mobile WebKit" \
  --workers 4
```

**Desktop tests (used in CI):**
```bash
npx playwright test tests/specFiles/ga/ \
  --project chromium \
  --project firefox \
  --project webkit \
  --workers 4
```

---

## 🚀 Deployment

### Understanding Environments

| Environment | URL | Purpose | Data | Credentials |
|-------------|-----|---------|------|-------------|
| Local | localhost:4502 | Development | Full sandbox | Dev account |
| Dev | aem-dev.company.com | Development server | Test data | Dev account |
| QA | aem-qa.company.com | Quality assurance | QA data | QA account |
| UAT | aem-uat.company.com | User acceptance | Production-like | UAT account |
| Prod | aem.company.com | Production | Live data | Limited access |

### Pre-Deployment Checklist

**Before running tests on any environment:**
- [ ] Correct AEM URL in `.env.<env>` file
- [ ] Credentials have proper permissions
- [ ] AEM instance is accessible
- [ ] Network connectivity verified
- [ ] VPN connected (if required)
- [ ] Tests run successfully locally first

### Deployment via Environment Variables

**Option 1: Command-line prefix**
```bash
env=qa npx playwright test tests/specFiles/ga/ --project chromium
```

**Option 2: Environment variable**
```bash
export ENV=qa
npx playwright test tests/specFiles/ga/ --project chromium
```

**Option 3: .env.qa configuration**
Edit `tests/environments/.env.qa` with:
```
BASE_URL=https://aem-qa.company.com
AEM_AUTHOR_URL=https://aem-qa.company.com
AEM_AUTHOR_USERNAME=qa-user
AEM_AUTHOR_PASSWORD=qa-password
AEM_AUTHOR_MODE=author
```

### Deployment Commands by Environment

```bash
# Deploy to QA
env=qa npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Deploy to UAT
env=uat npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Deploy to Production (read-only validation)
env=prod npx playwright test tests/specFiles/ga/ --grep @smoke --project chromium
```

### Package Manager Deployment (AEM)

For deploying test content fixtures to AEM:

**Step 1: Build content package**
```bash
# Located in tests/data/content-fixtures/
# Use AEM Package Manager UI to import
```

**Step 2: Deploy via Package Manager**
```bash
# Go to: http://localhost:4502/crx/packmgr/
# Upload content fixtures package
# Install package
# Verify content in AEM author
```

**Step 3: Sync test fixtures**
```bash
node scripts/verify-content-fixtures.js
```

### Maven Deployment (Optional)

For CI/CD pipeline integration:

```bash
# Install Maven (if not installed)
# Windows
choco install maven
# macOS
brew install maven
# Linux
sudo apt-get install maven

# Deploy via Maven
mvn clean install -DskipTests
mvn deployment:deploy
```

---

## 📊 Test Execution Reports

### Local Execution Report

After running tests:
```bash
npx playwright show-report
```

This opens an HTML report showing:
- ✅ Passed/failed tests
- 🎥 Videos of each test
- 📸 Screenshots on failure
- 📊 Timing information
- 🗂️ Test grouping

### CI/CD Reporting

In Bitbucket Pipelines:
```bash
# Run tests
env=qa npx playwright test tests/specFiles/ga/ --workers 4

# Post results to Teams
node scripts/send-report.js

# Archive artifacts
artifacts:
  - "*-results.zip"
  - "playwright-report.html"
```

### Performance Analysis

**Generate test metrics:**
```bash
npx playwright test tests/specFiles/ga/ --reporter=json > test-results.json
```

**Analyze execution time:**
```bash
node scripts/analyze-execution-time.js test-results.json
```

---

## 🐛 Common Issues

### Issue: Tests Won't Start

**Symptom:** `Error: Failed to launch browser`

**Solution:**
```bash
# Reinstall Playwright browsers
npx playwright install

# Verify installation
npx playwright install --with-deps
```

### Issue: AEM Not Accessible

**Symptom:** `Connection refused on localhost:4502`

**Solution:**
```bash
# Check AEM is running
curl http://localhost:4502/system/console

# If not responding:
# 1. Start AEM server
# 2. Wait for startup (~5 minutes)
# 3. Check logs in AEM installation directory
```

### Issue: Authentication Failed

**Symptom:** `401 Unauthorized` or login loops

**Solution:**
```bash
# Verify credentials in .env file
cat tests/environments/.env.local

# Check credentials are correct
# Test with curl
curl -u username:password http://localhost:4502/system/console

# Clear stored auth
rm -f .auth-state.json
```

### Issue: Tests Timeout

**Symptom:** `Timeout of 30000ms exceeded`

**Solution:**
```bash
# Increase timeout in playwright.config.ts
timeout: 60 * 1000, // 60 seconds

# Or per-test
test('my test', async ({ page }) => {
  // test code
}, { timeout: 60 * 1000 });
```

### Issue: TypeScript Errors

**Symptom:** `TS2304: Cannot find name...`

**Solution:**
```bash
# Check compilation
npx tsc --noEmit

# Most errors are non-critical (browser APIs)
# Tests still run despite TypeScript errors

# To fix critical errors:
node scripts/final-fix-typescript.js
```

### Issue: Flaky Tests

**Symptom:** Test passes sometimes, fails others

**Solution:**
```bash
# Use explicit waits instead of timeouts
await page.locator('.selector').waitFor({ state: 'visible' });

# Use better selectors
// ❌ Bad: .cmp-container > div:nth-child(3)
// ✅ Good: .cmp-button--primary

# Check for race conditions
// ❌ Bad: immediate assertion after click
// ✅ Good: wait for expected state after action
```

### Issue: Memory/Performance

**Symptom:** Tests slow down, out of memory

**Solution:**
```bash
# Reduce parallel workers
npx playwright test --workers 2

# Run fewer tests per batch
npx playwright test tests/specFiles/ga/button/ --project chromium

# Monitor memory usage
# Windows: taskmgr.exe
# Linux: top
# macOS: Activity Monitor
```

---

## 🔍 Debugging Tests

### Interactive Debugging

```bash
# Open Playwright Inspector
env=local npx playwright test tests/specFiles/ga/button/ --debug

# In inspector:
# - Step through code
# - Inspect DOM
# - Execute commands
# - Check element state
```

### Headless Debugging

```bash
# Run with visible browser
env=local npx playwright test tests/specFiles/ga/button/ --headed

# Run single test
env=local npx playwright test tests/specFiles/ga/button/button.author.spec.ts:10 --headed
```

### Console Capture

Tests automatically capture:
- ❌ JavaScript errors
- ⚠️ Console warnings
- 🌐 Network failures
- 📊 Performance metrics

These are attached to HTML reports automatically.

### Video & Screenshot Collection

Automatic capture:
- 🎥 Videos: On failure (configurable)
- 📸 Screenshots: On failure
- 📝 Traces: On first retry

View in HTML report:
```bash
npx playwright show-report
```

---

## ✅ Verification Checklist

**Before declaring tests ready:**
- [ ] All tests pass locally
- [ ] No TypeScript compilation errors (or non-critical only)
- [ ] Tests pass on QA environment
- [ ] No console errors captured
- [ ] Performance acceptable (<5s per test)
- [ ] HTML report generated successfully
- [ ] Video/screenshots captured for failures
- [ ] CI/CD pipeline passes

---

## 📞 Support

### Quick Reference
```bash
# List all available tests
npx playwright test --list

# Show Playwright config
npx playwright show-trace

# Generate detailed report
npx playwright test --reporter=html

# Run with maximum verbosity
env=local npx playwright test --debug-on-failure
```

### Resources
- Playwright Docs: https://playwright.dev
- Test Troubleshooting: See `SPRINTS_MASTER_SUMMARY.md`
- Code Examples: See `repo-overview.md`

---

**Framework Status: ✅ READY FOR TESTING**

All environments configured. Tests ready to execute across all components.

See [SPRINTS_MASTER_SUMMARY.md](SPRINTS_MASTER_SUMMARY.md) for complete test coverage information.
