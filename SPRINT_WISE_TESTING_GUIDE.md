# Sprint-Wise Testing Guide
## For All Teammates (Playwright + Command Line)

**Date:** June 1, 2026  
**Status:** ✅ Ready for Team Use  
**Environments:** local, dev, qa, uat, prod

---

## 🚀 Quick Start (3 Ways)

### Way 1: Interactive Menu (Easiest for Teammates)
```powershell
cd C:\Users\PuneethAM\GATestFramework-main
.\run-sprint-tests.ps1
```
**What happens:**
- Menu appears asking for Sprint, Test Type, Environment
- You select your choices
- Tests run automatically
- Reports open in browser

### Way 2: Command Line (Fast)
```powershell
cd C:\Users\PuneethAM\GATestFramework-main

# Run Sprint 16 smoke tests in DEV
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-(1098|1091|1080|1068|1024|993|983|982|969|968|964|940|898|859|839|838|837|836|835|834|833|827|821|819|814|801|800|799|798|797|796|795|794|792|791|790|788|764|763|756|728|684|575|397|394|393|69|48)" --grep "@smoke" --project chromium
```

### Way 3: PowerShell Script (With Parameters)
```powershell
.\run-sprint-tests.ps1 -Sprint 16 -TestType smoke -Environment dev
```

---

## 📋 Run Individual Sprints

### Sprint 1 (2 tickets)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-(48|69)" --project chromium
```

### Sprint 2 (3 tickets)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-(393|394|397)" --project chromium
```

### Sprint 11 (5 tickets)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-(1024|1068|1080|1091|1098)" --project chromium
```

### Sprint 16 (50 tickets) ⭐ CURRENT
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```

---

## 🔄 Run All Sprints at Once (Save Time)

### All Sprints - All Tests
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
# Duration: 60-70 minutes
```

### All Sprints - Smoke Tests Only
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@smoke" --project chromium
# Duration: 15-20 minutes
```

### All Sprints - Regression Tests Only
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@regression" --project chromium
# Duration: 30-40 minutes
```

---

## 🎯 Test Types Reference

| Type | Command | Duration | Use Case |
|------|---------|----------|----------|
| **Smoke** | `--grep "@smoke"` | 5-10 min | Quick validation |
| **Regression** | `--grep "@regression"` | 20-30 min | Comprehensive tests |
| **A11y** | `--grep "@a11y"` | 10-15 min | Accessibility |
| **Quality** | `--grep "@quality"` | 10 min | Code quality |
| **Batch** | `--grep "@batch"` | 15 min | All tickets |
| **Performance** | `--grep "@performance"` | 5 min | Speed tests |
| **All** | (no grep) | 60-70 min | Everything |

---

## 🌍 Environments

### DEV (Adobe AEM Cloud) - Recommended
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```
**Config:** `tests/environments/.env.dev`

### Local (localhost:4502)
```powershell
$env:env = "local"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```
**Config:** `tests/environments/.env.local`  
**Required:** AEM running at localhost:4502

### QA
```powershell
$env:env = "qa"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```

### UAT
```powershell
$env:env = "uat"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```

### PROD
```powershell
$env:env = "prod"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
```

---

## 💻 Advanced Options

### Run with Visible Browser (for debugging)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --headed
```

### Run with Single Worker (slower but more stable)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --workers 1
```

### Run with Debug Inspector
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium --debug
```

### Run Specific Ticket
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "GAAM-1098" --project chromium
```

### List All Tests (Don't run, just list)
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --list --project chromium
```

---

## 📊 View Results

### After Tests Complete
Reports automatically open in your browser:
- ✅ Playwright Report: `playwright-report/index.html`
- ✅ Quality Report: `test-results/code-quality-report.html`
- ✅ Sprint Summary: `test-results/sprint-summary-report.html`

### Manually Open Reports
```powershell
# Playwright results
start playwright-report/index.html

# Quality metrics
start test-results/code-quality-report.html

# Sprint comparison
start test-results/sprint-summary-report.html
```

---

## 🔧 Customize for Your Needs

### Edit Sprint Configuration
File: `sprint-config.json`

```json
{
  "sprints": {
    "sprint-16": {
      "name": "Sprint 16",
      "tickets": ["GAAM-1098", "GAAM-1091", ...],
      "environment": "dev",
      "components": ["button", "text", "hero"]
    }
  }
}
```

### Add New Tickets
1. Open `sprint-config.json`
2. Find the sprint you want to update
3. Add ticket to the `tickets` array
4. Save and re-run tests

### Change Default Environment
Edit `.env.dev` or other environment files in `tests/environments/`

---

## ⏱️ Testing Timeline

### Quick Testing (15-20 minutes)
```powershell
# Smoke tests for Sprint 16
.\run-sprint-tests.ps1 -Sprint 16 -TestType smoke -Environment dev
```

### Standard Testing (30-40 minutes)
```powershell
# Regression tests for Sprint 16
.\run-sprint-tests.ps1 -Sprint 16 -TestType regression -Environment dev
```

### Full Testing (60-70 minutes)
```powershell
# All tests for Sprint 16
.\run-sprint-tests.ps1 -Sprint 16 -TestType all -Environment dev
```

### Complete Testing (2-3 hours)
```powershell
# All tests for all sprints
.\run-sprint-tests.ps1 -Sprint all -TestType all -Environment dev
```

---

## 🎯 Common Workflows

### Daily Smoke Test
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@smoke" --project chromium
# Takes: 5-10 minutes
# Best for: Morning quick check
```

### Weekly Regression
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --grep "@regression" --project chromium
# Takes: 20-30 minutes
# Best for: Weekly verification
```

### Release Testing
```powershell
$env:env = "dev"
npx playwright test tests/specFiles/ga/sprint-16-comprehensive.spec.ts --project chromium
# Takes: 60-70 minutes
# Best for: Before release
```

### Sprint-Specific Testing
```powershell
.\run-sprint-tests.ps1 -Sprint 16 -TestType all -Environment dev
# Takes: 60-70 minutes
# Best for: Sprint validation
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot navigate to invalid URL" | Check BASE_URL in `.env.dev` |
| "Auth failed" | Check credentials in `.env.dev` |
| "Command not found: npx" | Run `npm install` first |
| "Port already in use" | Change port in `.env` file |
| "Browser not launching" | Add `--headed` flag to see the issue |
| "Tests timeout" | Increase timeout or use `--workers 1` |

---

## 📝 Example Testing Session

### Step 1: Open PowerShell
```powershell
cd C:\Users\PuneethAM\GATestFramework-main
```

### Step 2: Run Tests (Interactive)
```powershell
.\run-sprint-tests.ps1
```
Select:
- Sprint: 16
- Test Type: regression
- Environment: dev

### Step 3: Monitor Progress
Watch the console for progress updates

### Step 4: Review Reports
Browser opens automatically with:
- Test results
- Quality score
- Recommendations

### Step 5: Fix Issues (if any)
Use recommendations from report to fix failing tests

### Step 6: Re-run (to verify fixes)
```powershell
.\run-sprint-tests.ps1 -Sprint 16 -TestType regression -Environment dev
```

---

## ✅ Quality Standards

### Target Scores
- **Overall Quality:** 98-100%
- **Test Reliability:** 98%+
- **Code Quality:** 98%+
- **Coverage:** 80%+
- **Performance:** 95%+

### What to Look For
- ✅ Pass rate > 95%
- ✅ No flaky tests
- ✅ All 50 tickets covered
- ✅ Zero accessibility issues
- ✅ Load time < 1 second

---

## 🚀 Next Steps

1. **Quick Test:** Run smoke tests for Sprint 16
   ```powershell
   .\run-sprint-tests.ps1 -Sprint 16 -TestType smoke
   ```

2. **Full Test:** Run all tests for Sprint 16
   ```powershell
   .\run-sprint-tests.ps1 -Sprint 16 -TestType all
   ```

3. **All Sprints:** Run all tests for all sprints
   ```powershell
   .\run-sprint-tests.ps1 -Sprint all -TestType all
   ```

4. **Schedule:** Set up daily automated testing (see CI/CD docs)

---

## 📚 Additional Resources

- **Documentation:** `C:\documentation\`
- **Quick Reference:** `SPRINT_16_TEST_COMMANDS.md`
- **Configuration:** `sprint-config.json`
- **Setup Guide:** `AEM_LOCAL_SETUP_GUIDE.md`

---

## 💡 Tips for Teammates

1. **Start with Interactive Menu** - Easiest way to get started
2. **Use Smoke Tests First** - Quick validation before full regression
3. **Run at Off-Hours** - Full tests take 60-70 minutes
4. **Check Reports** - They show exactly what failed and why
5. **Ask for Help** - If tests fail, check the error report

---

**Status:** ✅ Ready to Use  
**Team-Friendly:** Yes  
**Requires Claude:** No  
**Customizable:** Yes  
**Time-Saving:** Yes (run sprints in parallel)

---

Let's test! 🚀
