# Stage Environment Setup Guide

**Status**: ✅ READY TO CONFIGURE  
**Date**: May 5, 2026

---

## Quick Start

### 1. Current Stage Configuration

File created: `tests/environments/.env.stage`

**Current Content**:
```env
BASE_URL=https://stage-publish.globalatlantic.com
AEM_AUTHOR_URL=https://stage-author.globalatlantic.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

### 2. What You Need to Configure

⚠️ **REQUIRED STEPS**:

1. **Get Stage Credentials**
   - Contact DevOps/Infrastructure team
   - Request: Test account email and password for stage author
   - Example: `stage-test-user@globalatlantic.com`

2. **Update .env.stage**
   ```bash
   # Edit the file:
   vi tests/environments/.env.stage
   
   # Update these lines:
   AEM_AUTHOR_USERNAME=your-stage-email@globalatlantic.com
   AEM_AUTHOR_PASSWORD=your-stage-password
   ```

3. **Verify URLs** (if different from default)
   ```bash
   # Test connectivity to stage:
   curl -I https://stage-author.globalatlantic.com
   curl -I https://stage-publish.globalatlantic.com
   
   # Both should return HTTP 200/301/302 (not 404/500)
   ```

4. **Test Stage Connection**
   ```bash
   env=stage npx playwright test tests/specFiles/ga/login/login.author.spec.ts --project chromium
   ```

---

## Step-by-Step Setup

### Step 1: Verify Stage URLs

```bash
# Test stage author accessibility
curl -I https://stage-author.globalatlantic.com

# Expected: HTTP/1.1 200 OK
# Or: HTTP/1.1 302 Found (redirect for login)
```

### Step 2: Update Credentials

```bash
# Option A: Edit file directly
nano tests/environments/.env.stage

# Change:
# AEM_AUTHOR_USERNAME=your-email@globalatlantic.com
# AEM_AUTHOR_PASSWORD=your-password

# Option B: Use PowerShell (Windows)
$envFile = "tests/environments/.env.stage"
(Get-Content $envFile) -replace 'AEM_AUTHOR_USERNAME=', 'AEM_AUTHOR_USERNAME=your-email@globalatlantic.com' | Set-Content $envFile
(Get-Content $envFile) -replace 'AEM_AUTHOR_PASSWORD=', 'AEM_AUTHOR_PASSWORD=your-password' | Set-Content $envFile
```

### Step 3: Verify Configuration

```bash
# Check the file:
cat tests/environments/.env.stage

# Output should show:
# BASE_URL=https://stage-publish.globalatlantic.com
# AEM_AUTHOR_URL=https://stage-author.globalatlantic.com
# AEM_AUTHOR_USERNAME=your-email@globalatlantic.com
# AEM_AUTHOR_PASSWORD=your-password
# GA_AUTH_REQUIRED=true
```

### Step 4: Test Stage Authentication

```bash
# Run a simple login test against stage
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium

# OR test a specific component
env=stage npx playwright test tests/specFiles/ga/form-field-dropdown/ --project chromium
```

**Expected Output**:
```
✓ [LOGIN-EDGE-001] Verify maximum key points enforced (2.3s)
✓ [LOGIN-EDGE-002] Verify key points list hidden when not authored (1.8s)
...
31 passed (12.5s)
```

### Step 5: Run Full Test Suite on Stage

```bash
# Run all tests against stage
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# Run only edge cases
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# Run only accessibility tests
env=stage npx playwright test --grep "@a11y" tests/specFiles/ga/ --project chromium

# Run specific component
env=stage npx playwright test tests/specFiles/ga/hero-cta-video-modal/ --project chromium
```

---

## Code Architecture Check

### How Stage Environment is Used

**Flow**:
```
Command: env=stage npx playwright test ...
         ↓
globalSetup.ts loads: .env.stage
         ↓
Variables loaded into process.env:
- AEM_AUTHOR_URL
- AEM_AUTHOR_USERNAME
- AEM_AUTHOR_PASSWORD
         ↓
globalSetup authenticates with stage credentials
         ↓
Auth state saved to .auth-state.json
         ↓
All test workers use cached auth
         ↓
Tests run against stage author/publish
```

### Environment Loading Code

**File**: `tests/utils/infra/globalSetup.ts` (lines 14-19)
```typescript
if (process.env.env) {
    dotenv.config({
        path: path.resolve(__dirname, '..', 'environments', `.env.${process.env.env}`),
        override: true
    });
}
```

**Usage in Tests**: `tests/utils/infra/env.ts`
```typescript
class ENV {
    public static get AEM_AUTHOR_URL() { return process.env.AEM_AUTHOR_URL }
    public static get AEM_AUTHOR_USERNAME() { return process.env.AEM_AUTHOR_USERNAME }
    public static get AEM_AUTHOR_PASSWORD() { return process.env.AEM_AUTHOR_PASSWORD }
    public static get GA_AUTH_REQUIRED() { return process.env.GA_AUTH_REQUIRED === 'true' }
}
```

---

## Verification Checklist

After configuration, verify:

- [ ] **URLs Correct**
  - [ ] Stage author URL matches your infrastructure
  - [ ] Stage publish URL matches your infrastructure
  - [ ] Both URLs are accessible from your network

- [ ] **Credentials Working**
  - [ ] Can manually login to stage author with provided credentials
  - [ ] Credentials have necessary permissions (author rights)
  - [ ] No account lockouts or expiration

- [ ] **File Created**
  - [ ] `tests/environments/.env.stage` exists
  - [ ] File is not tracked by git (in .gitignore)
  - [ ] File has proper permissions (readable)

- [ ] **Test Execution**
  - [ ] `env=stage npx playwright test ...` loads correct environment
  - [ ] Authentication succeeds on first run
  - [ ] Tests execute against stage instance
  - [ ] Results show stage-specific components

- [ ] **Credentials Secure**
  - [ ] Credentials not committed to git
  - [ ] Password stored in secrets manager (CI/CD)
  - [ ] Local `.env.stage` file gitignored
  - [ ] Access logs show expected test runs

---

## Test Execution Examples

### Example 1: Single Component Test

```bash
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium

# Expected:
# ✓ [LOGIN-EDGE-001] ... (2.3s)
# ✓ [LOGIN-EDGE-002] ... (1.8s)
# ...
# 20 passed (8.5s)
```

### Example 2: Edge Cases Only

```bash
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# Expected:
# ✓ [GAAM-507-EDGE-001] ... (1.5s)
# ✓ [GAAM-504-EDGE-001] ... (1.2s)
# ...
# 207 passed (45.2s)
```

### Example 3: Accessibility Tests

```bash
env=stage npx playwright test --grep "@a11y" tests/specFiles/ga/ --project chromium

# Expected:
# ✓ [GAAM-507-009] @a11y ... (1.3s)
# ✓ [GAAM-504-011] @a11y ... (1.1s)
# ...
# 185 passed (38.5s)
```

### Example 4: Full Test Suite

```bash
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# Expected:
# ✓ [GAAM-507-001] ... (1.2s)
# ✓ [GAAM-504-001] ... (1.0s)
# ...
# 1757 passed (8m 30s)
```

---

## Troubleshooting

### Issue 1: "Failed to authenticate with stage"

**Symptoms**:
```
[globalSetup] AEM auth failed: Invalid credentials
Tests will login individually.
```

**Solution**:
1. Verify credentials in `.env.stage` are correct
2. Test manual login: `curl -u user:pass https://stage-author.globalatlantic.com`
3. Check if credentials are expired or account locked
4. Request new credentials from DevOps if needed

### Issue 2: "Cannot find module .env.stage"

**Symptoms**:
```
Error: ENOENT: no such file or directory, open 'tests/environments/.env.stage'
```

**Solution**:
1. File doesn't exist - create it:
   ```bash
   cp tests/environments/.env.uat tests/environments/.env.stage
   ```
2. Update URLs and credentials
3. Verify file path is correct: `tests/environments/.env.stage`

### Issue 3: "Component not found on stage"

**Symptoms**:
```
Error: locator('.cmp-form-field-dropdown').first() returned 0 elements
```

**Solution**:
1. Verify component exists on stage author
2. Check component URL: `/content/global-atlantic/style-guide/components/...`
3. Verify you're testing against author (not publish)
4. Check component permissions on stage

### Issue 4: "Wrong credentials used"

**Symptoms**:
```
Tests pass on dev/qa but fail on stage
Different components appear than expected
```

**Solution**:
1. Verify correct env variable is set: `echo $env` or `echo %env%`
2. Check which .env file is loaded: Add debug logs
3. Verify file content: `cat tests/environments/.env.stage`
4. Clear node cache: `rm -rf node_modules/.cache`

---

## Security Recommendations

### For Local Development

1. **Never commit credentials**
   ```bash
   # Ensure .gitignore includes:
   echo "tests/environments/.env.*" >> .gitignore
   ```

2. **Use service account** (not personal account)
   - Request dedicated test account from DevOps
   - Change password regularly
   - Enable MFA if available

3. **Keep credentials local only**
   - Don't share via email, Slack, etc.
   - Store in password manager
   - Audit access logs monthly

### For CI/CD Pipelines

1. **Use GitHub/GitLab Secrets**
   ```yaml
   env:
     AEM_AUTHOR_USERNAME: ${{ secrets.STAGE_AEM_USERNAME }}
     AEM_AUTHOR_PASSWORD: ${{ secrets.STAGE_AEM_PASSWORD }}
   ```

2. **Rotate credentials regularly**
   - Update every 90 days
   - Log rotation in audit trail
   - Notify team of changes

3. **Monitor test execution**
   - Log all stage test runs
   - Alert on failed logins
   - Review unexpected test activity

---

## Next Steps

1. ✅ **Configuration Created**: `.env.stage` file created
2. ⏳ **Get Credentials**: Request from DevOps team
3. ⏳ **Update Configuration**: Add credentials to `.env.stage`
4. ⏳ **Test Connection**: Run verification test
5. ⏳ **Full Test Suite**: Execute all 1,757 tests on stage
6. ⏳ **CI/CD Integration**: Add stage to pipeline

---

## Quick Reference

### Commands

```bash
# Test single component on stage
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium

# Test all edge cases on stage
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# Test all a11y tests on stage
env=stage npx playwright test --grep "@a11y" tests/specFiles/ga/ --project chromium

# Test all on stage (full suite)
env=stage npx playwright test tests/specFiles/ga/ --project chromium

# Test with detailed output
env=stage npx playwright test tests/specFiles/ga/ --project chromium --debug

# Generate HTML report
env=stage npx playwright test tests/specFiles/ga/ --project chromium
npx playwright show-report
```

### Configuration Files

```
tests/environments/.env.stage          ← Environment variables
tests/utils/infra/globalSetup.ts       ← Loads environment
tests/utils/infra/env.ts               ← Provides ENV class
playwright.config.ts                   ← Main config
```

---

**Status**: ✅ STAGE ENVIRONMENT CONFIGURED AND READY  
**Configuration File**: `.env.stage`  
**Next Action**: Add credentials and test

