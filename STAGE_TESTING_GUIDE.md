# Stage Environment Testing Guide

**Date**: May 5, 2026  
**Status**: ✅ Ready for Testing  
**Environment**: Stage (AEM Cloud with Microsoft Azure AD + MFA)

---

## Current Test Coverage

| Metric | Value | Status |
|--------|-------|--------|
| **Test Spec Files** | 138 | ✅ Complete |
| **Total Test Cases** | 1,847 | ✅ Ready |
| **Components** | 30 | ✅ Automated |
| **Test Categories** | 5 types | ✅ Full coverage |

---

## Stage Environment Configuration

```
BASE_URL:           https://publish-p101514-e947796.adobeaemcloud.com
AUTHOR_URL:         https://author-p101514-e947796.adobeaemcloud.com
Authentication:     Microsoft Azure AD + MFA
Username:           am.puneeth@bounteous.com
Config File:        tests/environments/.env.stage
```

---

## Testing Workflow

### Phase 1: Login & Authentication (REQUIRED FIRST)

**This must be done manually on a desktop/laptop with display access.**

```bash
# Run login tests with --headed to complete MFA manually
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed
```

**What happens**:
1. Browser opens automatically
2. Navigate to AEM Cloud login
3. Enter credentials (am.puneeth@bounteous.com / Arjun@008$)
4. Complete Microsoft MFA (check email for code or use authenticator app)
5. Playwright records authentication cookies to `.auth-state.json`
6. All subsequent tests use cached authentication (no more MFA required)

**Success criteria**:
- ✅ Browser launches
- ✅ Login page loads
- ✅ MFA challenge appears
- ✅ Tests begin executing after authentication
- ✅ `.auth-state.json` file created

**Time estimate**: 5-10 minutes (waiting for MFA)

---

### Phase 2: Quick Smoke Tests

Once `.auth-state.json` exists, run smoke tests without `--headed`:

```bash
# Run @smoke tagged tests only (quick validation)
env=stage npx playwright test tests/specFiles/ga/ --grep "@smoke" --project chromium
```

**What to expect**:
- Tests run automatically without browser display
- ~10 quick validation tests
- Executes in 2-3 minutes

**Success criteria**:
- ✅ All @smoke tests pass
- ✅ No authentication prompts
- ✅ Report generated

---

### Phase 3: Component Testing (By Component)

Test individual components in order of complexity:

```bash
# Test specific component
env=stage npx playwright test tests/specFiles/ga/<component>/ --project chromium

# Example: Test button component
env=stage npx playwright test tests/specFiles/ga/button/ --project chromium

# Example: Test login component
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium
```

**Recommended order**:
1. `button` - Simplest
2. `link` - Navigation elements
3. `login` - Authentication flow
4. `hero` - Complex layout
5. `promo-banner`, `text`, `image` - Content components
6. `tabs`, `grid`, `accordion` - Interactive components

---

### Phase 4: Full Regression Suite

Once components pass individually, run full suite:

```bash
# Run all GA component tests
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# With specific workers for parallel execution
env=stage npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# With timeout for long-running tests
env=stage npx playwright test tests/specFiles/ga/ --project chromium --timeout 30000
```

**Expected duration**: 30-45 minutes for all 1,847 tests

**Success criteria**:
- ✅ >95% tests pass
- ✅ No authentication errors
- ✅ No timeouts
- ✅ All reports generated

---

### Phase 5: Continuous Testing

After initial verification, set up continuous testing:

```bash
# Run tests daily
# Add to cron job or CI/CD pipeline:
0 2 * * * cd /path/to/GATestFramework && env=stage npx playwright test tests/specFiles/ga/ --project chromium

# Or run with watch mode for development
env=stage npx playwright test tests/specFiles/ga/ --project chromium --watch
```

---

## Viewing Test Reports

After any test run, view detailed reports:

```bash
# Show HTML report
npx playwright show-report

# View latest report directly
# Open file: playwright-report/index.html
```

---

## Troubleshooting

### Issue 1: "Permission denied" or "403 Forbidden"

**Solution**:
```bash
# Delete auth cache and re-authenticate
rm .auth-state.json
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed
```

---

### Issue 2: "MFA not appearing" or "Stuck at login"

**Solutions**:
- Check if Microsoft AD account has correct permissions
- Verify credentials in `.env.stage` are correct
- Try clearing browser cache: `rm -rf .auth-state.json`
- Run with `--headed` to see what's happening

---

### Issue 3: "Tests timeout on stage"

**Solutions**:
- Stage environment may be slower than local
- Increase timeout: `--timeout 45000` (45 seconds)
- Run fewer parallel workers: `--workers 2`
- Check AEM Cloud instance status at https://developer.adobe.com

---

### Issue 4: "Cannot connect to publish URL"

**Verify**:
```bash
# Check if publish URL is accessible
curl -I https://publish-p101514-e947796.adobeaemcloud.com/
# Should return 200 or 302 redirect
```

---

## Commands Quick Reference

```bash
# Login & MFA (first time only)
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed

# Smoke tests (quick validation)
env=stage npx playwright test tests/specFiles/ga/ --grep "@smoke" --project chromium

# Single component
env=stage npx playwright test tests/specFiles/ga/button/ --project chromium

# Full regression
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# With parallel workers
env=stage npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# View report
npx playwright show-report

# Check auth status
ls -la .auth-state.json
```

---

## Expected Results

### Successful Authentication
```
✓ Login form displays
✓ Email input accepts value
✓ Password input accepts value
✓ Submit button triggers login
✓ MFA challenge appears
✓ [MANUAL] Complete MFA in browser
✓ Redirect to dashboard
✓ .auth-state.json created
```

### Successful Test Run
```
✓ All components load
✓ No 403/401 errors
✓ No timeouts
✓ >95% tests pass
✓ HTML report generated
✓ No console errors in tests
```

---

## Next Steps After Testing

1. **All tests pass**: ✅ Stage environment validated
   - Report results to team
   - Merge PR #1 to main
   - Begin Phase 2 implementation

2. **Some tests fail**: ⚠️ Investigate failures
   - Check test logs in playwright-report/
   - Review failed test videos
   - Update tests if AEM behavior differs
   - Re-run after fixes

3. **Timeouts or connection issues**: ⏳ Environment troubleshooting
   - Verify AEM Cloud instance is running
   - Check network connectivity
   - Review Adobe Cloud status
   - Increase timeouts for slow environment

---

## CI/CD Integration (Phase 4)

Once stage testing passes, add to pipeline:

```yaml
# bitbucket-pipelines.yml
stage-tests:
  - step:
      name: Stage Environment Tests
      script:
        - npm install
        - env=stage npx playwright test tests/specFiles/ga/ --project chromium
        - npm run send-report
```

---

## Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Login & MFA | 5-10 min | ⏳ TODO |
| 2 | Smoke tests | 2-3 min | ⏳ TODO |
| 3 | Component tests | 15-20 min | ⏳ TODO |
| 4 | Full regression | 30-45 min | ⏳ TODO |
| 5 | Report results | 5 min | ⏳ TODO |

**Total time estimate**: 1-2 hours

---

## Success Criteria for Stage Validation

- [x] PR #1 created and open
- [x] All documentation in place
- [x] Stage environment configured
- [ ] Login & MFA completed
- [ ] Smoke tests pass
- [ ] Component tests pass
- [ ] Full regression passes (>95%)
- [ ] PR reviewed and approved
- [ ] PR merged to main

---

**Status**: ✅ **READY FOR STAGE TESTING**

**Next action**: Run Phase 1 on a desktop/laptop with display:
```bash
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed
```

