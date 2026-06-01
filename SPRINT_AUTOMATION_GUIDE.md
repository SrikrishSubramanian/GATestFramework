# Sprint-Wise Automation Testing Guide

## 🎯 Overview

This system allows you to:
- ✅ Run tests for **specific sprints** (1-16)
- ✅ Run tests for **all sprints** at once
- ✅ Choose test types: **smoke**, **regression**, **sanity**, or **all**
- ✅ Run on different environments: **local**, **dev**, **qa**, **uat**, **prod**
- ✅ Get detailed reports for each execution

---

## 🚀 Quick Start

### **Easiest Method: Double-Click**

1. **Open File Explorer**
2. **Navigate to:** `C:\Users\PuneethAM\GATestFramework-main`
3. **Double-click:** `run-tests.bat`
4. **Follow the interactive menu**
5. **Tests run automatically**
6. **Report opens in browser**

---

## 📋 What You'll Be Asked

### **Step 1: Select Sprint**
```
1. Sprint 1 - 2 tickets
2. Sprint 2 - 3 tickets
3. Sprint 3 - 1 ticket
...
16. Sprint 16 - 6 tickets
17. All Sprints (1-16) - Comprehensive Testing
```

Choose `17` to run ALL sprints at once.

### **Step 2: Select Test Type**
```
1. SMOKE - Quick sanity check (5-10 min)
   - Verify basic functionality
   
2. REGRESSION - Comprehensive check (20-30 min)
   - Ensure no existing functionality broke
   
3. SANITY - Build sanity check (10-15 min)
   - Verify build stability
   
4. ALL - Complete test coverage (30-45 min)
   - Run everything
```

### **Step 3: Select Environment**
```
1. LOCAL - Local development (localhost:4503)
2. DEV - Dev server
3. QA - QA server
4. UAT - UAT server
5. PROD - Production server
```

### **Step 4: Confirmation**
Review your choices and confirm to start testing.

---

## 📊 What Happens When Tests Run

### **Console Output**
```
⏳ Starting test execution...
   Sprint: Sprint 16
   Type: REGRESSION
   Environment: DEV
   Tickets: 6

⏳ This will take 10-30 minutes depending on test type...

✓ tests/specFiles/ga/button/button.author.spec.ts (8)
✓ tests/specFiles/ga/feature-banner/banner.author.spec.ts (5)
...

✅ Hierarchical report generated: test-results/hierarchical-report.html
```

### **Report Opens Automatically**

Once tests complete:
1. Browser opens with hierarchical report
2. Shows summary stats (passed/failed)
3. Lists components/tickets
4. Failed components auto-expanded (red headers)
5. Details show what each test checks

---

## 🎯 Different Testing Approaches

### **Approach 1: Sprint-Wise Testing**

**Use for:** Testing changes made in a specific sprint

```
1. Select specific sprint (e.g., Sprint 16)
2. Choose test type (regression, smoke, etc.)
3. Run tests
4. Review report for that sprint
5. Fix failures in that sprint
6. Re-run to verify
```

**Benefits:**
- ✅ Fast (fewer tests)
- ✅ Focused on specific changes
- ✅ Easy to prioritize fixes
- ✅ Good for daily development

**Example:** Testing Sprint 16 before release
```
Sprint: 16
Test Type: Regression
Environment: Dev
Tickets: 6
Duration: ~15 minutes
```

---

### **Approach 2: All-Sprints Comprehensive Testing**

**Use for:** Pre-release testing, before shipping to production

```
1. Select "All Sprints (1-16)"
2. Choose test type (regression recommended)
3. Run full suite
4. Review complete report
5. Fix any failures
6. Re-run full suite
```

**Benefits:**
- ✅ Complete coverage (all functionality)
- ✅ Catches integration issues
- ✅ Identifies cross-sprint problems
- ✅ Good for release validation

**Example:** Pre-release regression testing
```
Sprint: All Sprints (1-16)
Test Type: Regression
Environment: QA
Tickets: 50 total
Duration: ~45 minutes
```

---

### **Approach 3: Smoke Testing (Fast)**

**Use for:** Quick sanity checks between builds

```
1. Select sprint or all
2. Choose test type: SMOKE
3. Run (5-10 minutes)
4. Verify basic functionality
```

**Benefits:**
- ✅ Very fast (5-10 min)
- ✅ Catches obvious breakage
- ✅ Good for CI/CD pipelines
- ✅ Quick feedback

**Example:** Quick sanity after build
```
Sprint: All Sprints
Test Type: Smoke
Environment: Local
Duration: ~7 minutes
```

---

## 📈 Common Workflows

### **Workflow 1: Daily Development**

```
Morning:
├─ Run Sprint-Specific Smoke Tests
└─ Fix any overnight failures

Afternoon:
├─ Make code changes
├─ Run Sprint-Specific Regression
└─ Verify changes work

End of Day:
├─ Run Sprint-Specific All Tests
└─ Commit code
```

**Commands:**
```
Sprint: 16 (or your current sprint)
Test Type: Smoke (morning), Regression (afternoon), All (end of day)
Environment: Local
```

---

### **Workflow 2: Pre-Release Testing**

```
Day 1:
├─ Run All Sprints Smoke Tests
└─ Fix critical issues

Day 2:
├─ Run All Sprints Regression Tests
└─ Fix regressions

Day 3:
├─ Run All Sprints All Tests
├─ Final verification
└─ Ready to ship
```

**Commands:**
```
Sprint: All Sprints
Test Type: Smoke → Regression → All (escalating)
Environment: Local → Dev → QA (escalating)
```

---

### **Workflow 3: Bug Fix Verification**

```
1. Get failing test details from report
2. Fix the bug in code
3. Re-run tests for that sprint
4. Verify failure is fixed
5. Run all-sprints smoke to ensure no regression
```

**Commands:**
```
Sprint: [Affected Sprint] (e.g., 16)
Test Type: Regression
Environment: Dev
(After fix) Re-run to verify
```

---

## 🔍 Understanding the Report

### **Report Sections**

**1. Summary Stats (Top)**
```
Total Tests: 150
✅ Passed: 145
❌ Failed: 5
⏱️ Duration: 467s
```

**2. Components/Sprints**
```
[GAAM-1098] Component Name
├─ 8/8 tests passed
├─ ✅ 8 | ❌ 0 | ⏱️ 45.2s
└─ Status: PASSED (green header)

[GAAM-1091] Component Name
├─ 7/8 tests passed
├─ ✅ 7 | ❌ 1 | ⏱️ 52.1s
└─ Status: FAILED (red header - auto-expanded)
   └─ Failed Test: "should render"
      Error: "Element not found"
```

**3. Test Details (Click to expand)**
```
✅ PASSED [GAAM-1098-001] Button renders
   🎯 What it tests: Button component rendering
   ✓ Condition: Should be visible in DOM
   ⏱️ Duration: 523ms

❌ FAILED [GAAM-1091-005] Banner closes on click
   🎯 What it tests: Close button functionality
   ✓ Condition: Banner should disappear
   ⏱️ Duration: 1245ms
   Error: Handler not triggered
```

---

## 🛠️ Configuration

### **sprint-config.json Structure**

The `sprint-config.json` file maps:
- Jira tickets → Sprints
- Test types → Tags and descriptions
- Environments → Servers

**Example:**
```json
{
  "sprints": {
    "sprint-16": {
      "name": "Sprint 16",
      "startDate": "2026-07-30",
      "endDate": "2026-08-12",
      "tickets": [
        "GAAM-1098",
        "GAAM-1091",
        "GAAM-1080",
        ...
      ]
    }
  },
  "testTypes": {
    "smoke": {
      "tag": "@smoke",
      "description": "Quick sanity check (5-10 min)"
    },
    ...
  }
}
```

### **To Add a New Sprint**

1. Edit `sprint-config.json`
2. Add new sprint entry:

```json
"sprint-17": {
  "name": "Sprint 17",
  "startDate": "2026-08-13",
  "endDate": "2026-08-26",
  "tickets": [
    "GAAM-1200",
    "GAAM-1201",
    ...
  ]
}
```

3. Save file
4. Run script - new sprint appears in menu

---

## 🎓 Best Practices

### **1. Testing Strategy**

```
Development Phase:
└─ Run sprint-specific smoke tests frequently

Before Commit:
└─ Run sprint-specific regression tests

Before Release:
└─ Run all-sprints regression tests

Final Verification:
└─ Run all-sprints all tests
```

### **2. Environment Selection**

```
Local:  Development, testing new features
Dev:    Testing after deployment to dev
QA:     Pre-release validation
UAT:    User acceptance testing
Prod:   Production verification (rare)
```

### **3. Test Type Selection**

```
@smoke:      Use for quick checks (CI/CD pipelines)
@regression: Use for comprehensive testing
@sanity:     Use for build stability checks
all:         Use for complete coverage
```

### **4. Report Analysis**

```
1. Check pass rate first
   └─ If 100% passed → Done ✅
   
2. If failures exist:
   └─ Failures auto-expand (red headers)
   └─ Read error message
   └─ Identify root cause
   └─ Fix code
   └─ Re-run to verify
```

---

## 📁 Files Created

```
C:\Users\PuneethAM\GATestFramework-main\
├─ run-tests.bat                    ← Easy launcher (double-click)
├─ run-sprint-automation.ps1        ← Interactive script
├─ sprint-config.json               ← Sprint/ticket configuration
├─ test-results/
│  ├─ hierarchical-report.html      ← Generated report
│  └─ test-run-metadata.txt         ← Execution metadata
└─ SPRINT_AUTOMATION_GUIDE.md       ← This file
```

---

## 🚀 Usage Examples

### **Example 1: Test Sprint 16 Regression**

```
Menu:
Sprint: 16 (Sprint 16)
Test Type: 2 (Regression)
Environment: 2 (Dev)
Confirm: Y

Result:
- Runs 6 GAAM tickets from Sprint 16
- Takes ~20 minutes
- Report opens in browser
- Shows what failed (if any)
```

### **Example 2: Quick Smoke Test All Sprints**

```
Menu:
Sprint: 17 (All Sprints)
Test Type: 1 (Smoke)
Environment: 1 (Local)
Confirm: Y

Result:
- Runs smoke tests for all 50 tickets
- Takes ~7 minutes
- Quick sanity check
- Good for CI/CD pipelines
```

### **Example 3: Complete Pre-Release Testing**

```
Menu:
Sprint: 17 (All Sprints)
Test Type: 4 (All)
Environment: 3 (QA)
Confirm: Y

Result:
- Runs ALL tests for all sprints
- Takes ~45 minutes
- Complete coverage
- Ready for release
```

---

## ❓ FAQ

**Q: How do I know which sprint to test?**
A: Usually the one you're working on. For release, select "All Sprints (17)".

**Q: Which test type should I use?**
A: 
- Development: Smoke (fast feedback)
- Before commit: Regression (comprehensive)
- Before release: All (complete coverage)

**Q: Tests are failing, what do I do?**
A: 
1. Open the report (auto-opens)
2. Click red headers to see failures
3. Read error message
4. Fix the code
5. Run again

**Q: Can I run custom combinations?**
A: Yes, via the interactive menu. Choose any sprint + test type + environment.

**Q: How do I add new tickets/sprints?**
A: Edit `sprint-config.json` and add new entries. Run script - changes appear in menu.

**Q: Where are test results saved?**
A: `test-results/hierarchical-report.html` (generated after each run)

---

## 🎯 Summary

**You now have:**

✅ Sprint-wise testing (1-16)
✅ All-sprints testing
✅ Multiple test types (smoke, regression, sanity, all)
✅ Multiple environments (local, dev, qa, uat, prod)
✅ Beautiful hierarchical reports
✅ Easy interactive script

**Just double-click `run-tests.bat` and follow the menu!** 🚀

---

**Happy Testing!** 🎉
