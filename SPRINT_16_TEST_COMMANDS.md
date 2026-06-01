# Sprint 16 Test Commands
## Quick Reference for Running Playwright Tests

---

## 🚀 Quick Start Commands

### Run All Sprint 16 Tests
```powershell
cd C:\Users\PuneethAM\GATestFramework-main
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```

### Run Only Smoke Tests (Quick - 5 min)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@smoke" --project chromium
```

### Run Only Regression Tests (20-30 min)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@regression" --project chromium
```

### Run Only Accessibility Tests (5 min)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@a11y" --project chromium
```

### Run Only Quality Checks (10 min)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@quality" --project chromium
```

### Run With Visible Browser (Headed Mode)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --headed
```

### Run With Detailed Output
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --reporter=line
```

### Run Specific Test
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1098" --project chromium
```

---

## 📊 Test Categories

### Smoke Tests (@smoke)
- Quick sanity checks (5 minutes)
- 5 core components
- Basic rendering only

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@smoke" --project chromium
```

### Regression Tests (@regression)
- Comprehensive validation (20-30 minutes)
- CSS classes, HTML structure
- 5 detailed component tests

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@regression" --project chromium
```

### Accessibility Tests (@a11y)
- Keyboard navigation
- ARIA labels
- Focus management

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@a11y" --project chromium
```

### Quality Checks (@quality)
- No inline styles
- No inline JavaScript
- No HTL comments in output

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@quality" --project chromium
```

### Batch Tests (@batch)
- All 50 GAAM tickets
- Existence check
- Basic rendering

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@batch" --project chromium
```

### Performance Tests (@performance)
- Load time < 1 second
- Render time < 500ms

**Run:**
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@performance" --project chromium
```

---

## 🎯 All 50 GAAM Tickets

```
GAAM-1098  GAAM-1091  GAAM-1080  GAAM-1068  GAAM-1024
GAAM-993   GAAM-983   GAAM-982   GAAM-969   GAAM-968
GAAM-964   GAAM-940   GAAM-898   GAAM-859   GAAM-839
GAAM-838   GAAM-837   GAAM-836   GAAM-835   GAAM-834
GAAM-833   GAAM-827   GAAM-821   GAAM-819   GAAM-814
GAAM-801   GAAM-800   GAAM-799   GAAM-798   GAAM-797
GAAM-796   GAAM-795   GAAM-794   GAAM-792   GAAM-791
GAAM-790   GAAM-788   GAAM-764   GAAM-763   GAAM-756
GAAM-728   GAAM-684   GAAM-575   GAAM-397   GAAM-394
GAAM-393   GAAM-69    GAAM-48
```

---

## 🔍 Running Specific Components

### Test Button (GAAM-1098)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1098" --project chromium
```

### Test Text (GAAM-1091)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1091" --project chromium
```

### Test Hero (GAAM-1080)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1080" --project chromium
```

### Test Navigation (GAAM-1068)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1068" --project chromium
```

### Test SiteHeader (GAAM-394)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-394" --project chromium
```

---

## ⏱️ Test Duration Guide

| Test Type | Duration | Command |
|-----------|----------|---------|
| **Smoke** | 5 min | `--grep "@smoke"` |
| **Regression** | 20-30 min | `--grep "@regression"` |
| **A11y** | 5 min | `--grep "@a11y"` |
| **Quality** | 10 min | `--grep "@quality"` |
| **Performance** | 5 min | `--grep "@performance"` |
| **All** | 45-60 min | (no grep filter) |

---

## 📊 View Results

### View HTML Report
```powershell
# Open Playwright report
start playwright-report/index.html

# Or quality report
start test-results/code-quality-report.html
```

### View Test Results JSON
```powershell
cat playwright-report/results.json | ConvertFrom-Json | Format-Table
```

### View Quality Metrics
```powershell
cat test-results/code-quality.json | ConvertFrom-Json | Format-Table
```

---

## 🚀 Recommended Testing Pattern

### Day 1: Smoke Test
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@smoke" --project chromium
# Takes 5 minutes
# Quick sanity check
```

### Day 2: Full Regression
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@regression" --project chromium
# Takes 20-30 minutes
# Comprehensive validation
```

### Day 3: Quality & A11y
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@quality|@a11y" --project chromium
# Takes 15 minutes
# Ensure quality standards
```

### Day 4: Full Suite
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
# Takes 45-60 minutes
# Complete validation
```

---

## 🔧 Advanced Options

### Run with Debugging
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --debug
```

### Run Single Worker (Slower but more stable)
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --workers 1
```

### Run with Screenshots on Failure
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
# Screenshots auto-saved in test-results/
```

### Run with Video Recording
```powershell
env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
# Videos auto-saved in test-results/
```

---

## 📝 Test File Location

```
C:\Users\PuneethAM\GATestFramework-main\tests\specFiles\ga\sprint-16-comprehensive.spec.ts
```

---

## ✅ Environment Configuration

Tests automatically use DEV environment from:
```
C:\Users\PuneethAM\GATestFramework-main\tests\environments\.env.dev
```

Configuration includes:
- Base URL: https://author-p101514-e1845752.adobeaemcloud.com
- Username: am.puneeth@bounteous.com
- Password: (configured in .env.dev)

---

## 🎯 Expected Results

- **Quality Score:** 98-100%
- **Pass Rate:** 95%+
- **Test Count:** 200+
- **Reports Generated:**
  - playwright-report/index.html
  - test-results/code-quality-report.html
  - test-results/reliability-db.json

---

## 📞 Quick Help

| Question | Command |
|----------|---------|
| Run all Sprint 16 tests? | `env=dev npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium` |
| Run only smoke tests? | Add `--grep "@smoke"` |
| Run with visible browser? | Add `--headed` |
| View results? | `start playwright-report/index.html` |
| Test specific ticket? | Add `--grep "GAAM-1098"` |
| See test list? | Add `--list` |

---

**Happy Testing!** 🚀

Generated: June 1, 2026
Status: ✅ Ready to Use