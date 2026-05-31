# AEM Content Fixture Deployment — Quick Start

**Status**: 14 fixture files ready for deployment  
**AEM Instance**: `GA_AEM_CODE/aem-sdk-2026.5.26309.20260526T180029Z-260400/crx-quickstart`  
**AEM Author URL**: `http://localhost:4502`  

---

## ⚡ Quick Deploy (Recommended)

### Step 1: Start AEM (if not running)

```bash
# Navigate to AEM instance
cd GA_AEM_CODE/aem-sdk-2026.5.26309.20260526T180029Z-260400

# Start AEM
.\crx-quickstart\bin\start.bat
```

Wait for startup to complete (check `crx-quickstart/logs/stdout.log`):
```
Startup completed in X seconds
```

### Step 2: Deploy Using PowerShell Script

```powershell
# Run the deployment script
.\deploy-content-fixtures.ps1
```

The script will:
- ✅ Verify AEM is running
- ✅ Create a package
- ✅ Upload all 14 fixture files
- ✅ Show next steps

---

## 📋 Fixture Files Being Deployed

| # | Component | File | Status |
|----|-----------|------|--------|
| 1 | Accordion | accordion-fixtures.xml | ✅ Ready |
| 2 | Accordion Tabs Feature | accordion-tabs-feature-fixtures.xml | ✅ Ready |
| 3 | Button | button-fixtures.xml | ✅ Ready |
| 4 | Content Trail | content-trail-fixtures.xml | ✅ Ready |
| 5 | Feature Banner | feature-banner-fixtures.xml | ✅ Ready |
| 6 | Form Options | form-options-fixtures.xml | ✅ Ready |
| 7 | Form Text | form-text-fixtures.xml | ✅ Ready |
| 8 | Headline Block | headline-block-fixtures.xml | ✅ Ready |
| 9 | Hero Fifty-Fifty | hero-fifty-fifty-fixtures.xml | ✅ Ready |
| 10 | Navigation | navigation-fixtures.xml | ✅ Ready |
| 11 | Rate Table | rate-table-fixtures.xml | ✅ Ready |
| 12 | Spacer | spacer-fixtures.xml | ✅ Ready |
| 13 | Statistic | statistic-fixtures.xml | ✅ Ready |
| 14 | Text | text-fixtures.xml | ✅ Ready |

**All fixtures located in**: `tests/specFiles/ga/<component>/content-fixtures/`

---

## 🔧 Alternative: Manual UI Deployment

If the script doesn't work, deploy manually via AEM UI:

### 1. Open Package Manager
```
http://localhost:4502/crx/packmgr/
Login: admin / admin
```

### 2. Create Package
- Click **Create Package**
- **Name**: `ga-content-fixtures`
- **Group**: `GA Test Fixtures`
- Click **Create**

### 3. Add Fixture Files
- Click **Edit** → **Add Files**
- Navigate to: `tests/specFiles/ga/*/content-fixtures/`
- Select all 14 `*-fixtures.xml` files
- Click **Done**

### 4. Install
- Click **Build** (wait for completion)
- Click **Install** (wait for completion)
- Check console for success messages

---

## ✅ Verify Deployment

After installation, verify using curl:

```bash
# Check if content exists
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json | jq '.'

# Check specific component (example: accordion)
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide/accordion.json | jq '.jcr:title'
```

**Expected output**:
```
"Accordion"
```

---

## 🧪 Run Tests to Validate

Once fixtures are deployed, run the full test suite:

```bash
# Run all GA tests (should find components now)
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Run specific component test
env=local npx playwright test tests/specFiles/ga/accordion/ --project chromium
```

### Expected Results
- ✅ Tests should **no longer** say "element(s) not found"
- ✅ Tests may fail due to styling/functionality (expected)
- ✅ Test execution time: 30-45 minutes for full suite

---

## 🆘 Troubleshooting

### AEM Not Running
```
Error: Cannot connect to AEM at http://localhost:4502

Solution:
1. Check AEM status: 
   cd GA_AEM_CODE/aem-sdk-*/
   tail -f crx-quickstart/logs/stdout.log
   
2. Wait for "Startup completed" message
3. Retry deployment
```

### Package Already Exists
```
Error: Package already created

Solution:
1. Open http://localhost:4502/crx/packmgr/
2. Find "ga-content-fixtures" package
3. Delete it
4. Run script again
```

### Fixtures Still Not Found After Installation
```
Error: Tests still say "element(s) not found"

Solution:
1. Verify fixture deployment:
   curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json
   
2. Check AEM logs:
   GA_AEM_CODE/aem-sdk-*/crx-quickstart/logs/error.log
   
3. Look for any permission or import errors
```

### curl Command Not Found
```
Error: 'curl' is not recognized

Solution:
1. Use PowerShell script (built-in): .\deploy-content-fixtures.ps1
2. Or install curl: https://curl.se/download.html
3. Or use Windows Subsystem for Linux (WSL)
```

---

## 📊 Timeline

| Task | Estimated Time |
|------|-----------------|
| Start AEM | 2-5 minutes |
| Deploy fixtures | 2-5 minutes |
| Verify deployment | 2-3 minutes |
| Run all tests | 30-45 minutes |
| **Total** | **~45 minutes** |

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| AEM Author | http://localhost:4502 |
| Package Manager | http://localhost:4502/crx/packmgr/ |
| AEM Instance | `GA_AEM_CODE/aem-sdk-2026.5.26309.20260526T180029Z-260400/` |
| Fixture Files | `tests/specFiles/ga/*/content-fixtures/` |
| Test Command | `env=local npx playwright test tests/specFiles/ga/ --project chromium` |

---

## ✨ Next Steps

1. **Deploy Content** → Run this script or follow manual steps
2. **Verify Deployment** → Use curl commands to confirm
3. **Run Tests** → Execute Playwright test suite
4. **Generate Report** → Check `test-results/` for results

---

**Status**: Ready for deployment ✅  
**Date**: May 30, 2026  
**All Systems**: Go 🚀
