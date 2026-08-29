# Stage Environment Updated ✅

**Date**: May 5, 2026  
**Status**: ✅ URLS CONFIGURED - AWAITING CREDENTIALS

---

## Current Stage Configuration

### Updated .env.stage

```env
BASE_URL=https://publish-p101514-e947796.adobeaemcloud.com
AEM_AUTHOR_URL=https://author-p101514-e947796.adobeaemcloud.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

### Configuration Details

| Variable | Value | Type |
|----------|-------|------|
| **AEM_AUTHOR_URL** | `https://author-p101514-e947796.adobeaemcloud.com` | ✅ Configured |
| **BASE_URL** | `https://publish-p101514-e947796.adobeaemcloud.com` | ✅ Configured |
| **AEM_AUTHOR_USERNAME** | `[empty]` | ⏳ Awaiting credentials |
| **AEM_AUTHOR_PASSWORD** | `[empty]` | ⏳ Awaiting credentials |
| **GA_AUTH_REQUIRED** | `true` | ✅ Cloud authentication enabled |

---

## What's Configured

✅ **Stage Author URL**: `https://author-p101514-e947796.adobeaemcloud.com`
- Used for component testing in author mode
- Tests will run against this instance
- Components need to be published here

✅ **Stage Publish URL**: `https://publish-p101514-e947796.adobeaemcloud.com`
- Used for viewing rendered pages
- Publish workflow validation
- Frontend component testing

✅ **Cloud Authentication**: Enabled (GA_AUTH_REQUIRED=true)
- Adobe IMS SSO required
- Will use loginToAEMAuthor fixture
- Session state will be cached

---

## What's Still Needed

⏳ **Stage Credentials**:
- Email/Username for Adobe IMS login
- Password for stage authentication account
- Sufficient permissions on stage author

---

## Comparison: Stage vs Other Environments

| Env | Platform | Status | URL |
|-----|----------|--------|-----|
| **local** | Local SDK | ✅ | `http://localhost:4502` |
| **dev** | AEM Cloud | ✅ | `author-p101514-e1845752.adobeaemcloud.com` |
| **stage** | AEM Cloud | ✅ URLs Set | `author-p101514-e947796.adobeaemcloud.com` |
| **qa** | Standard | ✅ | `qa-author.globalatlantic.com` |
| **uat** | Standard | ✅ | `uat-author.globalatlantic.com` |
| **prod** | Standard | ✅ | `prod-author.globalatlantic.com` |

**Note**: Stage is an AEM Cloud instance (like dev), not a standard domain.

---

## Architecture Verification

### Environment Loading Chain

When you run: `env=stage npx playwright test ...`

```
1. User command specifies: env=stage
   
2. globalSetup.ts (line 14-19):
   └─ Loads: .env.stage file
   
3. dotenv.config loads:
   ├─ AEM_AUTHOR_URL: https://author-p101514-e947796.adobeaemcloud.com
   ├─ BASE_URL: https://publish-p101514-e947796.adobeaemcloud.com
   ├─ AEM_AUTHOR_USERNAME: [credentials]
   ├─ AEM_AUTHOR_PASSWORD: [credentials]
   └─ GA_AUTH_REQUIRED: true

4. globalSetup authenticates:
   └─ Uses loginToAEMAuthor(page) with AEM Cloud IMS login

5. auth-fixture.ts detects:
   └─ Cloud authentication required → Uses Adobe IMS SSO flow

6. Tests execute:
   └─ All requests go to: author-p101514-e947796.adobeaemcloud.com

7. Results tagged:
   └─ [stage] environment confirmed in reports
```

---

## Next Steps (In Order)

### Step 1: Get Stage Credentials ⏳ REQUIRED

**Contact**: DevOps/Infrastructure Team  
**Request**: Test account credentials for AEM Cloud stage instance

**Details to Provide**:
- Instance: `author-p101514-e947796.adobeaemcloud.com`
- Purpose: Test automation
- Requirements:
  - Author rights (can modify components)
  - IMS user account (Adobe email)
  - No MFA complications preferred

**Typical Response Time**: 1-2 business days

---

### Step 2: Update Credentials

Once you receive credentials from DevOps:

```bash
# Edit the file
nano tests/environments/.env.stage

# Update these two lines:
AEM_AUTHOR_USERNAME=your-adobe-email@company.com
AEM_AUTHOR_PASSWORD=your-password
```

**File**: `tests/environments/.env.stage`

```env
BASE_URL=https://publish-p101514-e947796.adobeaemcloud.com
AEM_AUTHOR_URL=https://author-p101514-e947796.adobeaemcloud.com
AEM_AUTHOR_USERNAME=your-adobe-email@company.com    ← ADD THIS
AEM_AUTHOR_PASSWORD=your-password                    ← ADD THIS
GA_AUTH_REQUIRED=true
```

---

### Step 3: Verify Stage Access

Test manual login first:

```bash
# Test that stage author is accessible
curl -I https://author-p101514-e947796.adobeaemcloud.com

# Expected output:
# HTTP/1.1 200 OK
# or
# HTTP/1.1 302 Found  (redirect to IMS login)
```

---

### Step 4: Test Authentication Flow

Run a simple test to verify credentials work:

```bash
env=stage npx playwright test tests/specFiles/ga/login/login.author.spec.ts --project chromium --debug
```

**Expected Output**:
```
[globalSetup] Authenticating with AEM author...
[globalSetup] Auth state saved — all workers will reuse this session
✓ [LOGIN-EDGE-001] ... (2.3s)
✓ [LOGIN-EDGE-002] ... (1.8s)
```

---

### Step 5: Run Full Component Tests

After credentials are verified:

```bash
# Test single component
env=stage npx playwright test tests/specFiles/ga/form-field-dropdown/ --project chromium

# Test all edge cases
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# Run full suite (1,757 tests)
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

---

### Step 6: Generate HTML Report

```bash
# After tests complete
npx playwright show-report

# Opens interactive HTML report in browser
# Shows results, screenshots, videos, traces
```

---

## File Verification

### Location Check

```bash
# Verify file exists and is readable
ls -la tests/environments/.env.stage

# Output:
# -rw-r--r-- tests/environments/.env.stage
```

### Content Check

```bash
# Verify content is correct
cat tests/environments/.env.stage

# Output:
# BASE_URL=https://publish-p101514-e947796.adobeaemcloud.com
# AEM_AUTHOR_URL=https://author-p101514-e947796.adobeaemcloud.com
# AEM_AUTHOR_USERNAME=
# AEM_AUTHOR_PASSWORD=
# GA_AUTH_REQUIRED=true
```

### Git Check

```bash
# Ensure file is in .gitignore
cat .gitignore | grep "env"

# Should show:
# tests/environments/.env.*
```

---

## Understanding the URLs

### Author URL: `https://author-p101514-e947796.adobeaemcloud.com`

**Used For**:
- Component authoring and editing
- Dialog configuration testing
- Author-side behavior validation
- Form field testing in edit mode

**Access Point**:
```
https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/sites.html/content
```

**Tests Run Here**:
- Happy path tests
- Interaction tests
- Edge case tests
- Accessibility tests
- Form validation tests

---

### Publish URL: `https://publish-p101514-e947796.adobeaemcloud.com`

**Used For**:
- Viewing published/rendered components
- Frontend behavior validation
- Performance testing
- Public-facing functionality

**Access Point**:
```
https://publish-p101514-e947796.adobeaemcloud.com/content/...
```

**Tests Run Here**:
- Visual regression tests
- Frontend-only tests
- Performance tests
- Public component validation

---

## Authentication Flow (Adobe IMS)

### How Stage Authentication Works

**Stage uses Adobe IMS** (not basic auth like local):

```
1. Test starts: env=stage npx playwright test ...
   
2. globalSetup detects cloud URL:
   └─ "author-p101514-*.adobeaemcloud.com" = Cloud instance
   
3. loginToAEMAuthor fixture:
   └─ Navigates to: /ui#/login
   └─ Waits for IMS iframe to appear
   └─ Enters credentials in IMS form
   └─ Waits for redirect to /ui#/aem/...
   
4. Session established:
   └─ Browser cookies saved
   └─ Auth state cached to: .auth-state.json
   
5. Subsequent tests:
   └─ Reuse cached auth state
   └─ No additional logins needed
   └─ All requests authenticated
```

### Storage Location

```
.auth-state.json (gitignored)
├─ Contains: Browser cookies & session data
├─ Created: First test run
├─ Reused: All subsequent runs (30 minutes)
├─ Expires: After 30 minutes of inactivity
└─ Refreshed: Automatically on expiration
```

---

## Deployment Timeline

**Phase 1** (Today):
- ✅ URLs configured in `.env.stage`
- ✅ Architecture verified
- ✅ Documentation complete

**Phase 2** (1-2 days):
- ⏳ Get credentials from DevOps
- ⏳ Update `.env.stage` with credentials
- ⏳ Test manual login

**Phase 3** (Day 3):
- ⏳ Run test authentication flow
- ⏳ Execute component tests
- ⏳ Verify all 1,757 tests pass

**Phase 4** (Day 4):
- ⏳ Integrate into CI/CD pipeline
- ⏳ Set up scheduled stage testing
- ⏳ Configure alerts for failures

---

## Test Execution Commands Reference

### Stage-Specific Commands

```bash
# Single component test
env=stage npx playwright test tests/specFiles/ga/form-field-dropdown/ --project chromium

# By tag (edge cases)
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# By tag (accessibility)
env=stage npx playwright test --grep "@a11y" tests/specFiles/ga/ --project chromium

# By tag (mobile responsive)
env=stage npx playwright test --grep "@mobile" tests/specFiles/ga/ --project chromium

# Specific test only
env=stage npx playwright test -g "GAAM-507-001" tests/specFiles/ga/ --project chromium

# Full suite (all 1,757 tests)
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# With debug mode
env=stage npx playwright test tests/specFiles/ga/ --project chromium --debug

# Generate report
env=stage npx playwright test tests/specFiles/ga/ --project chromium
npx playwright show-report
```

---

## Troubleshooting Pre-Credentials

### Issue: "Need credentials for stage"

**Error**:
```
AEM_AUTHOR_USERNAME and AEM_AUTHOR_PASSWORD are empty
Cannot authenticate
```

**Solution**:
1. This is expected until credentials are provided
2. Contact DevOps for stage test account
3. Update `.env.stage` once received
4. Run test again

### Issue: "Stage URL not accessible"

**Error**:
```
curl: (7) Failed to connect to author-p101514-e947796.adobeaemcloud.com
```

**Solution**:
1. Verify VPN connection if required
2. Check firewall rules
3. Verify URL spelling: `author-p101514-e947796.adobeaemcloud.com`
4. Contact DevOps if still unable to reach

---

## Summary Table

| Item | Status | Value |
|------|--------|-------|
| **Author URL** | ✅ Configured | `https://author-p101514-e947796.adobeaemcloud.com` |
| **Publish URL** | ✅ Configured | `https://publish-p101514-e947796.adobeaemcloud.com` |
| **Cloud Authentication** | ✅ Enabled | Adobe IMS SSO |
| **Credentials** | ⏳ Awaiting | From DevOps team |
| **File Location** | ✅ Ready | `tests/environments/.env.stage` |
| **Test Count** | ✅ Ready | 1,757 tests to execute |
| **Environment** | ✅ Ready | Stage (pre-production) |

---

## Next Action

**WAIT FOR**: Stage credentials from DevOps team

**WHEN RECEIVED**:
1. Update `AEM_AUTHOR_USERNAME` in `.env.stage`
2. Update `AEM_AUTHOR_PASSWORD` in `.env.stage`
3. Run: `env=stage npx playwright test tests/specFiles/ga/login/ --project chromium`
4. Verify authentication succeeds
5. Run full suite if initial tests pass

---

**Status**: ✅ **STAGE ENVIRONMENT URLS CONFIGURED**  
**Awaiting**: Credentials from DevOps  
**Ready To Execute**: Once credentials provided

