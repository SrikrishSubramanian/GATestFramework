# AEM Package Manager UI Deployment — Step-by-Step Guide

**Method:** Manual AEM UI (Recommended for first-time deployment)  
**Estimated Time:** 15-20 minutes  
**Difficulty:** Easy  

---

## Prerequisites

✅ AEM Author instance running (localhost:4502)  
✅ Admin credentials: admin / admin  
✅ 14 fixture XML files ready in `tests/specFiles/ga/*/content-fixtures/`  

---

## Step 1: Open AEM Package Manager

1. **Open browser** → Navigate to: `http://localhost:4502/crx/packmgr/`

2. **Login** (if prompted)
   - Username: `admin`
   - Password: `admin`

3. **Verify** you see the **Package Manager** interface with a list of existing packages

---

## Step 2: Create a New Package

1. **Click "Create Package"** button (usually on the left sidebar or top)

2. **Fill in Package Details:**
   - **Package Name:** `ga-content-fixtures`
   - **Group Name:** `GA Test Fixtures`
   - **Version:** `1.0.0`
   - **Description:** `Content fixtures for GA component style guide pages`

3. **Click "Create"**

4. **You should see your new package** in the list: `ga-content-fixtures`

---

## Step 3: Edit Package & Add Files

1. **Click on the package** `ga-content-fixtures` to select it

2. **Click "Edit"** button (you may see this as a pencil icon or edit link)

3. **In the Edit Package view:**
   - You'll see sections for package content
   - Look for "Add Files" or similar button

4. **Click "Add Files"** or the upload area

5. **Navigate to your fixture files:**
   - Path: `tests/specFiles/ga/*/content-fixtures/`
   - Select **all 14 fixture files**:
     - accordion-fixtures.xml
     - accordion-tabs-feature-fixtures.xml
     - button-fixtures.xml
     - content-trail-fixtures.xml
     - feature-banner-fixtures.xml
     - form-options-fixtures.xml
     - form-text-fixtures.xml
     - headline-block-fixtures.xml
     - hero-fifty-fifty-fixtures.xml
     - navigation-fixtures.xml
     - rate-table-fixtures.xml
     - spacer-fixtures.xml
     - statistic-fixtures.xml
     - text-fixtures.xml

6. **For each file, set the Target Path in AEM:**
   - Component: Extract component name from path
   - **Target path format:**
     ```
     /content/global-atlantic/style-guide/<component>/
     ```
   - Examples:
     - accordion-fixtures.xml → `/content/global-atlantic/style-guide/accordion/`
     - button-fixtures.xml → `/content/global-atlantic/style-guide/button/`
     - text-fixtures.xml → `/content/global-atlantic/style-guide/text/`

7. **Continue adding all 14 files**

---

## Step 4: Build Package

1. **Click "Save"** (if prompted to save changes)

2. **Click "Build"** button

3. **Wait** for the build to complete
   - You'll see status: "Building..."
   - Then: "Package built successfully"

4. **Verify** the package shows size > 0 (indicates files were added)

---

## Step 5: Install Package

1. **Click the package** `ga-content-fixtures` in the list

2. **Click "Install"** button

3. **Confirm the installation** (may show a dialog asking to proceed)

4. **Wait** for installation to complete
   - You'll see status messages:
     - "Installing..."
     - "Package installed successfully"
   - This may take 1-2 minutes

5. **Check the log** for any errors (should show no errors)

---

## Step 6: Verify Installation

### Option A: Check via Package Manager

1. **In Package Manager**, look for your package
2. **Status should show:** ✅ "Installed" or similar

### Option B: Verify via AEM Content Browser

1. **Open:** `http://localhost:4502/crx/de/index.jsp` (CRX/DE Lite)

2. **Navigate to:** `/content/global-atlantic/style-guide/`

3. **Verify** you see new folders:
   - accordion
   - button
   - text
   - spacer
   - (all 14 components)

4. **Expand each folder** and verify:
   - Each has a `jcr:content` node
   - Contains component instances (look for `cmp-accordion`, `cmp-button`, etc.)

### Option C: Verify via REST API (Command Line)

```bash
# Check if content was deployed
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json | grep -i "accordion"

# Should return JSON with component nodes
```

### Option D: Visual Verification (Easiest)

1. **Open:** `http://localhost:4502/editor.html/content/global-atlantic/style-guide/accordion.html`

2. **In AEM page editor**, you should see:
   - Accordion component instances
   - Multiple variations (light background, dark background, etc.)
   - Component properties visible

---

## Step 7: Troubleshooting

### Issue: "Build failed" or "Install failed"

**Solution:**
1. Check AEM error logs: `GA_AEM_CODE/aem-sdk-*/crx-quickstart/logs/error.log`
2. Verify fixture XML format is valid (should be well-formed XML)
3. Ensure target paths are correct (should match component names)
4. Try rebuilding the package

### Issue: Package installed but content not visible

**Solution:**
1. Refresh the browser (Ctrl+F5 or Cmd+Shift+R)
2. Check CRX/DE to verify nodes were created
3. Verify installation completed without errors
4. Try re-installing the package

### Issue: Parent path doesn't exist

**Solution:**
1. Create parent path first via CRX/DE:
   - Navigate to: `/content/global-atlantic/`
   - Right-click → Create Node
   - Name: `style-guide`
   - Type: `cq:Folder` or `nt:folder`
2. Then install package

### Issue: Cannot access CRX/DE or Package Manager

**Solution:**
1. Verify AEM is running: `ps aux | grep java`
2. Check port 4502 is listening: `netstat -an | grep 4502`
3. Try localhost vs IP address
4. Wait for AEM startup to complete (check logs for "Startup completed")

---

## Expected Results After Deployment

### ✅ What You Should See

**In AEM Editor:**
```
http://localhost:4502/editor.html/content/global-atlantic/style-guide/accordion.html
↓
Page loads with:
- Accordion component visible ✓
- Multiple items (4+) showing ✓
- Light & dark background variations ✓
- Expand/collapse controls visible ✓
```

**In CRX/DE:**
```
/content/global-atlantic/style-guide/
├── accordion/
│   └── jcr:content
│       ├── root (nt:unstructured)
│       │   └── main-par (accordion component instances)
│       │       ├── accordion_white
│       │       ├── accordion_dark
│       │       └── ...
├── button/
│   └── (same structure)
├── text/
│   └── (same structure)
└── (11 more components)
```

**In Tests:**
```bash
env=local npx playwright test tests/specFiles/ga/accordion/ --project chromium
↓
Tests should now:
- Navigate to /accordion/ page ✓
- Find .cmp-accordion elements ✓
- Validate component properties ✓
- Run without "element(s) not found" errors ✓
```

---

## Next Steps After Successful Deployment

### 1. Re-run Tests (30-45 minutes)

```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
```

**Expected:** Tests should mostly pass (70-90% pass rate)

### 2. Analyze Results

Check `test-results/` directory for:
- Pass/fail breakdown by component
- Screenshots of failures (if any)
- Videos of test execution

### 3. Document Results

Create final report showing:
- Total tests passed vs failed
- Pass rate by component
- Any issues requiring component fixes

---

## Deployment Success Checklist

- ✅ Package created: `ga-content-fixtures`
- ✅ 14 fixture files added to package
- ✅ Package built successfully
- ✅ Package installed successfully (no errors)
- ✅ Content visible in CRX/DE Lite
- ✅ Content visible in AEM Editor
- ✅ Content accessible via REST API
- ✅ Tests can now navigate to pages and find components
- ✅ Tests run without "element(s) not found" errors

---

## Support & Questions

**For AEM UI help:**
- Check AEM error logs
- Verify all fixture files are valid XML
- Try installing package from CRX/DE alternative UI if Package Manager fails

**For test issues after deployment:**
- See TEST_EXECUTION_ANALYSIS.md
- Check test-results directory for artifacts
- Run individual component tests to isolate issues

---

## Summary

**Time estimate:** 15-20 minutes  
**Complexity:** Easy (point-and-click UI)  
**Risk:** Low (no code changes, only content)  
**Rollback:** Easy (uninstall package via Package Manager)  

Once completed, you'll have:
✅ All 14 content fixtures deployed to AEM  
✅ Style guide pages populated with component instances  
✅ Tests ready to validate all 44 GA components  
✅ Framework fully operational for continuous testing  

🎉 **After this deployment, run the full test suite to validate!**
