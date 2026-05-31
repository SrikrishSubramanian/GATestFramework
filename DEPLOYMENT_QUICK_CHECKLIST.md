# AEM Package Manager Deployment — Quick Checklist

**Keep this open while deploying. Check off each step as you complete it.**

---

## Phase 1: Access & Setup

- [ ] **Step 1a:** Open browser → `http://localhost:4502/crx/packmgr/`
- [ ] **Step 1b:** Login with `admin` / `admin`
- [ ] **Step 1c:** Verify Package Manager UI loads successfully

---

## Phase 2: Create Package

- [ ] **Step 2a:** Click "Create Package" button
- [ ] **Step 2b:** Set Package Name: `ga-content-fixtures`
- [ ] **Step 2c:** Set Group Name: `GA Test Fixtures`
- [ ] **Step 2d:** Set Version: `1.0.0`
- [ ] **Step 2e:** Click "Create"
- [ ] **Step 2f:** Verify package appears in the list

---

## Phase 3: Add Fixture Files

- [ ] **Step 3a:** Click on package `ga-content-fixtures` to select it
- [ ] **Step 3b:** Click "Edit" button
- [ ] **Step 3c:** Click "Add Files"

**Add these 14 files** (one at a time or all at once):

| # | Fixture File | Target Path | ✓ |
|---|---|---|---|
| 1 | accordion-fixtures.xml | `/content/global-atlantic/style-guide/accordion/` | [ ] |
| 2 | accordion-tabs-feature-fixtures.xml | `/content/global-atlantic/style-guide/accordion-tabs-feature/` | [ ] |
| 3 | button-fixtures.xml | `/content/global-atlantic/style-guide/button/` | [ ] |
| 4 | content-trail-fixtures.xml | `/content/global-atlantic/style-guide/content-trail/` | [ ] |
| 5 | feature-banner-fixtures.xml | `/content/global-atlantic/style-guide/feature-banner/` | [ ] |
| 6 | form-options-fixtures.xml | `/content/global-atlantic/style-guide/form-options/` | [ ] |
| 7 | form-text-fixtures.xml | `/content/global-atlantic/style-guide/form-text/` | [ ] |
| 8 | headline-block-fixtures.xml | `/content/global-atlantic/style-guide/headline-block/` | [ ] |
| 9 | hero-fifty-fifty-fixtures.xml | `/content/global-atlantic/style-guide/hero-fifty-fifty/` | [ ] |
| 10 | navigation-fixtures.xml | `/content/global-atlantic/style-guide/navigation/` | [ ] |
| 11 | rate-table-fixtures.xml | `/content/global-atlantic/style-guide/rate-table/` | [ ] |
| 12 | spacer-fixtures.xml | `/content/global-atlantic/style-guide/spacer/` | [ ] |
| 13 | statistic-fixtures.xml | `/content/global-atlantic/style-guide/statistic/` | [ ] |
| 14 | text-fixtures.xml | `/content/global-atlantic/style-guide/text/` | [ ] |

- [ ] **Step 3d:** All 14 files added to package
- [ ] **Step 3e:** Click "Save"

---

## Phase 4: Build Package

- [ ] **Step 4a:** Click "Build" button
- [ ] **Step 4b:** Wait for build to complete
- [ ] **Step 4c:** Verify status shows "Package built successfully"
- [ ] **Step 4d:** Verify package size > 0 KB

---

## Phase 5: Install Package

- [ ] **Step 5a:** Click on package `ga-content-fixtures` in list
- [ ] **Step 5b:** Click "Install" button
- [ ] **Step 5c:** Confirm installation (if dialog appears)
- [ ] **Step 5d:** Wait for installation to complete (1-2 minutes)
- [ ] **Step 5e:** Verify status shows "Package installed successfully"
- [ ] **Step 5f:** Check log for errors (should be none)

---

## Phase 6: Verify Installation

### Option A: Package Manager Status ✓
- [ ] **Check 6a:** Package shows "Installed" status
- [ ] **Check 6b:** Last modified date is recent (just now)

### Option B: CRX/DE Verification ✓
- [ ] **Check 6c:** Open `http://localhost:4502/crx/de/index.jsp`
- [ ] **Check 6d:** Navigate to `/content/global-atlantic/style-guide/`
- [ ] **Check 6e:** Verify you see folders: accordion, button, text, spacer, etc.
- [ ] **Check 6f:** Expand 1-2 folders and verify `jcr:content` exists
- [ ] **Check 6g:** Look for component nodes (should contain `cmp-accordion`, `cmp-button`, etc.)

### Option C: Visual Verification in Editor ✓
- [ ] **Check 6h:** Open `http://localhost:4502/editor.html/content/global-atlantic/style-guide/accordion.html`
- [ ] **Check 6i:** Page should load with accordion component visible
- [ ] **Check 6j:** Should see multiple accordion items (4+)
- [ ] **Check 6k:** Should see light & dark background variations

### Option D: REST API Check ✓
```bash
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json
```
- [ ] **Check 6l:** Should return JSON (not HTML error page)
- [ ] **Check 6m:** Should contain component node references

---

## Phase 7: Ready for Testing

- [ ] **Step 7a:** All verifications passed ✓
- [ ] **Step 7b:** Take screenshot of successful CRX/DE view (for documentation)
- [ ] **Step 7c:** Note the time of deployment completion

---

## Next: Re-run Tests

Once all checks pass, run:

```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
```

**Expected Results:**
- ✓ Tests should navigate to pages without "element(s) not found" errors
- ✓ Pass rate should increase significantly (from 0% to 70-90%)
- ✓ Test execution should be smooth with proper assertions

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Build failed | Check AEM logs: `GA_AEM_CODE/aem-sdk-*/crx-quickstart/logs/error.log` |
| Install failed | Verify fixture XML is valid; try rebuilding package |
| Content not visible | Refresh browser (Ctrl+F5); check CRX/DE for node creation |
| Parent path doesn't exist | Create `/content/global-atlantic/style-guide` folder in CRX/DE first |
| AEM not responding | Verify `localhost:4502` is reachable; check if Java process is running |

---

## Success = ✅ This Checklist Complete

Once all phases and verifications are complete:
- ✅ Content fixtures deployed to AEM
- ✅ Style guide pages populated with components
- ✅ Framework ready for full test validation
- ✅ Ready to proceed with test execution

**Estimated time:** 15-20 minutes  
**Next step:** Run test suite and validate results
