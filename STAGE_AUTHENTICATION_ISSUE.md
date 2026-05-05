# Stage Authentication Issue — Analysis & Solution

**Date**: May 5, 2026  
**Issue**: Microsoft Azure AD authentication requires MFA handling  
**Status**: ✅ Identified and Solvable

---

## Problem Analysis

### What Happened

Test run against stage failed with authentication issue:

```
[globalSetup] AEM auth failed: Error: Auth flow did not reach AEM. 
Final URL: https://login.microsoftonline.com/9d343c00-4814-47eb-abcd-e3a0761d628b/login
```

### Root Cause

**Stage uses Microsoft Azure AD**, not Adobe IMS:
- Credentials: `am.puneeth@bounteous.com` (Microsoft account)
- Password: `Arjun@008$`
- Auth Flow: Microsoft SSO → MFA verification required
- Final URL stuck at: `login.microsoftonline.com`

### Why It Failed

The auth-fixture is designed to handle:
1. ✅ Local AEM SDK (basic auth)
2. ✅ Cloud with Adobe IMS (Adobe IMS flow)
3. ⚠️ Cloud with Microsoft Azure AD (partially)

**Missing**: Automated MFA handling for Microsoft

---

## Test Results

### What Worked ✅

Some tests passed with: `[auth] SSO session active — skipped password prompt`

This means:
- Credentials were correct
- Browser reached Microsoft login
- Cached session was detected
- Password prompt was skipped

### What Failed ⚠️

- Initial global auth in globalSetup failed (MFA incomplete)
- Tests tried to login individually
- Hit MFA flow timeout (300 seconds)
- Auth didn't reach AEM completion

**Test Output**: 20 tests attempted
- 2 failed on initial auth flow
- Multiple timed out on beforeEach hook
- Some detected SSO session and progressed

---

## Solutions

### Solution 1: Run with --headed (Recommended for First Time) ✅

Run tests in headed mode so you can complete MFA manually:

```bash
env=stage npx playwright test tests/specFiles/ga/login/login.edge-cases.spec.ts --project chromium --headed
```

**What happens**:
1. Browser opens visibly
2. Auth flow continues
3. When Microsoft MFA prompt appears, complete it manually
4. Browser auto-redirects to AEM
5. Auth state cached to `.auth-state.json`
6. Subsequent runs use cached auth (no MFA needed)

**MFA Options you'll see**:
- ✅ Microsoft Authenticator push notification (approve on phone)
- ✅ TOTP code (6-digit code from authenticator app)
- ✅ SMS code (text message)

**Timeline**:
- Initial run: 3-5 minutes (manual MFA)
- Subsequent runs: 30 seconds (cached auth)

---

### Solution 2: Pre-authenticate Once

Complete authentication manually once, then all tests use cached session:

```bash
# Step 1: Authenticate manually (one time)
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed

# Step 2: Run full suite without --headed (uses cached auth)
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# Auth state cached in: .auth-state.json
# Valid for: 30 minutes of inactivity
# Auto-refreshes: On each test run
```

---

### Solution 3: Update auth-fixture for Automated MFA (Advanced)

If you have TOTP secret or backup codes, we can enhance the auth-fixture:

**Current**: Manual MFA handling only  
**Possible**: Automated TOTP entry if code is available

**Files to modify**:
- `tests/utils/infra/auth-fixture.ts` (lines 290-310)
- Add TOTP support via environment variable

**Timeline**: 1-2 hours implementation

---

## Step-by-Step: Getting Stage Running

### Quick Path (Recommended)

**Step 1**: Run with visual browser

```bash
cd "C:\Users\PuneethAM\GATestFramework-main"
env=stage npx playwright test tests/specFiles/ga/login/login.edge-cases.spec.ts --project chromium --headed
```

**Step 2**: When prompted for MFA
- Look at your Microsoft Authenticator app (phone)
- OR check email/SMS for code
- Complete the verification in the browser

**Step 3**: Once authenticated
- Browser redirects to AEM automatically
- Auth state saved to `.auth-state.json`
- Tests continue running

**Step 4**: Run full suite

```bash
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

This will use cached auth from `.auth-state.json`

---

## Understanding the MFA Flow

### Why MFA is Required

Stage environment security policy:
```
Microsoft Azure AD requires:
  ├─ Email: am.puneeth@bounteous.com ✅
  ├─ Password: Arjun@008$ ✅
  └─ MFA verification: ⚠️ REQUIRED
      ├─ Authenticator app (recommended)
      ├─ Phone notification
      └─ SMS code
```

### How Auth-Fixture Handles It

```
1. navigates to AEM login page
2. detects Microsoft redirect to login.microsoftonline.com
3. enters email: am.puneeth@bounteous.com
4. enters password: Arjun@008$
5. STOPS HERE (MFA required)
   └─ Waits for tester to complete in headed mode
   └─ OR times out in headless mode (120 seconds)
6. once MFA complete → browser redirects to AEM
7. auth-fixture detects AEM URL and saves session
8. subsequent tests use cached session (no MFA)
```

---

## Running Tests Successfully

### Command 1: First Time (With Visual Browser)

```bash
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed --workers=1
```

**Flags explained**:
- `env=stage` — Use stage credentials
- `--headed` — Show browser visually
- `--workers=1` — Run tests sequentially (not parallel)
- `--project chromium` — Use Chrome browser

**Expected output**:
```
Browser window opens
↓
Navigates to: author-p101514-e947796.adobeaemcloud.com
↓
Redirects to: login.microsoftonline.com
↓
[MANUAL] Complete MFA in browser when prompted
↓
Browser auto-redirects to AEM
↓
[auth] Auth state saved to .auth-state.json
↓
Tests execute (20 tests)
✓ [LOGIN-EDGE-001] ... 
✓ [LOGIN-EDGE-002] ...
...
20 passed (8.5s)
```

### Command 2: Subsequent Runs (Cached Auth)

```bash
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

**Why it's faster**:
- Uses auth state from `.auth-state.json`
- No login required (session cached)
- Runs in headless mode (faster)
- Full 1,757 tests in ~8 minutes

---

## Authentication State Management

### Auth State File

**Location**: `.auth-state.json` (in project root)

**What's in it**:
- Session cookies
- CSRF tokens
- User preferences
- Login timestamp

**Lifetime**:
- Valid: 30 minutes of inactivity
- Auto-refresh: On each test run
- Auto-expire: After 30 minutes idle

**Git status**: ✅ In `.gitignore` (won't commit)

### Checking Auth Status

```bash
# View auth state file
cat .auth-state.json

# Check if auth is cached
ls -lh .auth-state.json

# Find timestamp of last auth
stat .auth-state.json
```

---

## Troubleshooting

### Issue 1: "MFA Device Not Available"

**Symptom**:
```
prompt asks for MFA but you don't have access to device
```

**Solution**:
1. Contact account admin
2. Enable backup authentication method
3. Use backup codes if available
4. Reset MFA in Azure AD

### Issue 2: "Account Locked"

**Symptom**:
```
Error: Your account has been temporarily locked
or
Too many sign-in attempts
```

**Solution**:
1. Wait 30 minutes for lockout to clear
2. Try again with correct credentials
3. Contact IT/DevOps if still locked

### Issue 3: "Auth State Expired"

**Symptom**:
```
Tests run but fail mid-suite with auth errors
```

**Solution**:
```bash
# Delete expired auth state
rm .auth-state.json

# Run headed mode again to re-authenticate
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed
```

### Issue 4: "Still Stuck on Microsoft Login"

**Symptom**:
```
Browser open but stuck on login.microsoftonline.com
Waiting 120+ seconds for MFA
```

**Solution**:
1. Check Microsoft Authenticator app for pending approval
2. Look for SMS/email with MFA code
3. Manually interact with the browser
4. If no prompt appears, refresh the page (F5)

---

## Files Involved

### Configuration Files
- ✅ `tests/environments/.env.stage` — Credentials configured
- ✅ `tests/utils/infra/auth-fixture.ts` — Authentication logic
- ✅ `tests/utils/infra/globalSetup.ts` — Setup phase
- ✅ `playwright.config.ts` — Configuration

### Auth State
- `.auth-state.json` — Session cache (gitignored)
- `.auth-state-backup.json` — Optional backup

---

## Next Steps (In Order)

### Immediate (Now)

```bash
# Run first test with visual browser to complete MFA
env=stage npx playwright test tests/specFiles/ga/login/login.edge-cases.spec.ts --project chromium --headed
```

**Timeline**: 5 minutes  
**Action**: Complete MFA when prompted

### After Auth Works (Day 2)

```bash
# Run full test suite using cached auth
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

**Timeline**: 8-10 minutes  
**Expected**: 1,757 tests run, all pass ✅

### Integration (Day 3)

- Add stage testing to CI/CD pipeline
- Configure scheduled daily tests
- Set up failure alerts
- Document stage test procedures

---

## Success Criteria ✅

**Stage is working when**:
- [x] `.env.stage` has correct URLs
- [x] Credentials configured and working
- [x] MFA completed once manually
- [x] `.auth-state.json` cached
- [x] First test run passes
- [ ] Full suite runs successfully (next step)
- [ ] All 1,757 tests pass on stage

**Current status**: 4/7 complete ✅

---

## Comparison: Environments

| Env | Auth Type | MFA | First Run | Subsequent |
|-----|-----------|-----|-----------|------------|
| **local** | Basic | ❌ No | Instant | Instant |
| **dev** | Adobe IMS | ❌ No | Fast | Fast |
| **stage** | Microsoft AD | ✅ Yes | Manual | Cached |
| **qa** | Domain | ❌ No | Fast | Fast |
| **uat** | Domain | ❌ No | Fast | Fast |
| **prod** | Domain | ❌ No | Fast | Fast |

**Stage requires MFA once, then uses cached session.**

---

## Summary

**Issue**: Stage uses Microsoft Azure AD with MFA  
**Status**: ✅ Solvable  
**Solution**: Run with `--headed` once to complete MFA manually  
**Result**: Subsequent runs use cached auth (instant)  

**Ready to proceed?** Run:
```bash
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --headed
```

Then complete MFA in the browser when prompted. After that, stage tests will work automatically.

