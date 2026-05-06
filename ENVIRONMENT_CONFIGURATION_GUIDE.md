# Environment Configuration Guide

**Date**: May 5, 2026  
**Status**: ✅ Complete  
**Available Environments**: 6 (local, dev, stage, qa, uat, prod)

---

## Overview

Environment configurations are managed through `.env.<environment>` files in `tests/environments/` directory. Each environment specifies:
- AEM Author instance URL
- AEM Publish instance URL (BASE_URL)
- Authentication credentials
- Feature toggles

---

## Available Environments

| Environment | Status | Author URL | Publish URL | Use Case |
|-------------|--------|-----------|------------|----------|
| **local** | ✅ Active | `http://localhost:4502` | N/A | Local development |
| **dev** | ✅ Active | AEM Cloud instance | N/A | Development testing |
| **stage** | ✅ NEW | `https://stage-author.globalatlantic.com` | `https://stage-publish.globalatlantic.com` | Staging validation |
| **qa** | ✅ Active | `https://qa-author.globalatlantic.com` | `https://qa-publish.globalatlantic.com` | QA testing |
| **uat** | ✅ Active | `https://uat-author.globalatlantic.com` | `https://uat-publish.globalatlantic.com` | User acceptance testing |
| **prod** | ✅ Active | `https://prod-author.globalatlantic.com` | `https://prod-publish.globalatlantic.com` | Production validation |

---

## Environment Configuration Files

### File Location
```
tests/environments/
├── .env.local
├── .env.dev
├── .env.stage          ← NEW
├── .env.qa
├── .env.uat
├── .env.prod
└── urls.json
```

### Configuration Template

Each `.env.<environment>` file contains:

```env
BASE_URL=<publish-instance-url>
AEM_AUTHOR_URL=<author-instance-url>
AEM_AUTHOR_USERNAME=<username-or-email>
AEM_AUTHOR_PASSWORD=<password>
GA_AUTH_REQUIRED=true|false
```

**Variables**:
- `BASE_URL`: Publish instance for viewing rendered pages
- `AEM_AUTHOR_URL`: Author instance for component testing
- `AEM_AUTHOR_USERNAME`: User email or username for login
- `AEM_AUTHOR_PASSWORD`: User password (use secrets manager in CI/CD)
- `GA_AUTH_REQUIRED`: Whether authentication is required (true for cloud, false for local)

---

## Current Configurations

### 1. Local Environment (.env.local)
```env
BASE_URL=http://localhost:4502
AEM_AUTHOR_URL=http://localhost:4502
AEM_AUTHOR_USERNAME=admin
AEM_AUTHOR_PASSWORD=admin
GA_AUTH_REQUIRED=false
```

**Usage**:
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium
```

**Notes**:
- For local AEM SDK development
- Default credentials (admin/admin)
- No cloud authentication required

---

### 2. Development Environment (.env.dev)
```env
BASE_URL=https://author-p101514-e1845752.adobeaemcloud.com
AEM_AUTHOR_URL=https://author-p101514-e1845752.adobeaemcloud.com
AEM_AUTHOR_USERNAME=srikrish.subramanian@bounteous.com
AEM_AUTHOR_PASSWORD=Junnu@2296
GA_AUTH_REQUIRED=true
```

**Usage**:
```bash
env=dev npx playwright test tests/specFiles/ga/ --project chromium
```

**Notes**:
- AEM Cloud development instance
- Requires IMS SSO or Adobe credentials
- Used for active feature development

---

### 3. Stage Environment (.env.stage) ← NEW
```env
BASE_URL=https://stage-publish.globalatlantic.com
AEM_AUTHOR_URL=https://stage-author.globalatlantic.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

**Usage**:
```bash
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

**Configuration Required**:
- ⚠️ **AEM_AUTHOR_USERNAME**: Add staging credentials (email)
- ⚠️ **AEM_AUTHOR_PASSWORD**: Add staging credentials (password)
- Obtain from DevOps/Infrastructure team
- Store in secure secrets manager for CI/CD

**Use Cases**:
- Pre-production validation
- UAT environment testing
- Staging rollout verification
- Production cutover preparation

**Notes**:
- Intermediate between QA and production
- Should mirror production setup
- Used for final validation before prod deployment
- Requires Cloud IMS authentication

---

### 4. QA Environment (.env.qa)
```env
BASE_URL=https://qa-publish.globalatlantic.com
AEM_AUTHOR_URL=https://qa-author.globalatlantic.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

**Usage**:
```bash
env=qa npx playwright test tests/specFiles/ga/ --project chromium
```

---

### 5. UAT Environment (.env.uat)
```env
BASE_URL=https://uat-publish.globalatlantic.com
AEM_AUTHOR_URL=https://uat-author.globalatlantic.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

**Usage**:
```bash
env=uat npx playwright test tests/specFiles/ga/ --project chromium
```

---

### 6. Production Environment (.env.prod)
```env
BASE_URL=https://prod-publish.globalatlantic.com
AEM_AUTHOR_URL=https://prod-author.globalatlantic.com
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=
GA_AUTH_REQUIRED=true
```

**Usage** (restricted):
```bash
env=prod npx playwright test tests/specFiles/ga/ --project chromium
```

**⚠️ CAUTION**:
- Production testing should be read-only
- Requires elevated permissions
- Use with care; never modify production data
- Typically used for smoke tests only

---

## How Environments Work

### 1. Environment Loading (globalSetup.ts)

When you run tests with `env=<name>`:

```typescript
// 1. User runs with env variable
env=stage npx playwright test ...

// 2. globalSetup.ts loads the correct .env file
if (process.env.env) {
    dotenv.config({
        path: path.resolve(__dirname, 'tests', 'environments', `.env.${process.env.env}`),
        override: true
    });
}

// 3. Variables loaded into process.env
process.env.AEM_AUTHOR_URL   // from .env.stage
process.env.AEM_AUTHOR_USERNAME
process.env.AEM_AUTHOR_PASSWORD
```

### 2. Environment Usage (ENV.ts)

Tests access variables through the ENV class:

```typescript
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
// Reads: process.env.AEM_AUTHOR_URL from loaded .env file
```

### 3. Test Execution

```bash
# Playwright loads .env.stage
# globalSetup authenticates with stage credentials
# All tests run against stage author/publish instances
# Results reported with [stage] tag
```

---

## Configuration Checklist

### Stage Environment Setup

- [ ] **Verify URLs**
  - [ ] Stage author URL correct: `https://stage-author.globalatlantic.com`
  - [ ] Stage publish URL correct: `https://stage-publish.globalatlantic.com`

- [ ] **Credentials**
  - [ ] Obtain stage test account from DevOps/Infra team
  - [ ] Verify credentials work (manual login test)
  - [ ] Update `.env.stage` with credentials
  - [ ] Ensure password is stored in secure secrets manager (don't commit to git)

- [ ] **Authentication**
  - [ ] Confirm GA_AUTH_REQUIRED=true (cloud authentication)
  - [ ] Test IMS SSO login if applicable
  - [ ] Verify auth state caching works

- [ ] **Access Validation**
  - [ ] Test components are accessible on stage author
  - [ ] Verify component URLs resolve correctly
  - [ ] Check network connectivity to stage environment

- [ ] **CI/CD Integration**
  - [ ] Add stage credentials to pipeline secrets
  - [ ] Configure stage test job in pipeline
  - [ ] Test environment variable substitution

---

## Updating Stage Credentials

### Step 1: Update .env.stage
```bash
vi tests/environments/.env.stage
```

**Change**:
```env
# FROM:
AEM_AUTHOR_USERNAME=
AEM_AUTHOR_PASSWORD=

# TO:
AEM_AUTHOR_USERNAME=your-stage-email@globalatlantic.com
AEM_AUTHOR_PASSWORD=your-stage-password
```

### Step 2: Test Connection
```bash
env=stage npx playwright test tests/specFiles/ga/login/login.author.spec.ts --project chromium
```

**Expected Result**:
```
✓ [LGN-001] ... passed
✓ [LGN-002] ... passed
```

### Step 3: Store Credentials Securely
⚠️ **IMPORTANT**: Never commit credentials to git!

**For CI/CD**:
1. Add `AEM_AUTHOR_PASSWORD` to pipeline secrets
2. Reference in pipeline: `${{ secrets.STAGE_AEM_PASSWORD }}`
3. Never echo passwords in logs

**For Local Testing**:
1. Create local `.env.stage` (gitignored)
2. Update credentials locally only
3. Never push to repository

---

## Running Tests Against Each Environment

### Local Tests (Development)
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium
```

### Dev Tests (Cloud Development)
```bash
env=dev npx playwright test tests/specFiles/ga/ --project chromium
```

### Stage Tests (Pre-Production) ← NEW
```bash
env=stage npx playwright test tests/specFiles/ga/ --project chromium
```

### QA Tests
```bash
env=qa npx playwright test tests/specFiles/ga/ --project chromium
```

### UAT Tests
```bash
env=uat npx playwright test tests/specFiles/ga/ --project chromium
```

### Production Tests (Read-Only)
```bash
env=prod npx playwright test tests/specFiles/ga/login/ --grep @smoke --project chromium
```

---

## Running Specific Component Tests by Environment

```bash
# Test single component in stage
env=stage npx playwright test tests/specFiles/ga/form-field-dropdown/ --project chromium

# Test by tag in stage
env=stage npx playwright test --grep "@a11y" tests/specFiles/ga/ --project chromium

# Test edge cases in stage
env=stage npx playwright test --grep "@edge" tests/specFiles/ga/ --project chromium

# Test mobile in stage
env=stage npx playwright test --grep "@mobile" tests/specFiles/ga/ --project chromium
```

---

## Environment Variables Reference

### Available Variables

All variables defined in `ENV.ts`:

```typescript
ENV.BASE_URL                    // Publish instance
ENV.AEM_AUTHOR_URL              // Author instance
ENV.AEM_AUTHOR_USERNAME         // Login username
ENV.AEM_AUTHOR_PASSWORD         // Login password
ENV.GA_AUTH_REQUIRED            // Auth toggle (true/false)

// Feature-specific URLs (optional)
ENV.BIO                         // BIO component URL
ENV.EXPANDABLE_TEASER           // Expandable teaser URL
ENV.PORTFOLIO                   // Portfolio component URL
ENV.INSIGHTSFILTER              // Insights filter URL
// ... and more
```

### Usage in Tests

```typescript
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test('Component test', async ({ page }) => {
  // Uses environment-specific URL
  await page.goto(`${BASE()}/content/global-atlantic/...`);
});
```

---

## Troubleshooting

### Issue: "Authentication failed for stage"

**Solution**:
1. Verify credentials in `.env.stage` are correct
2. Test manual login to stage author URL
3. Check if stage is accessible from your network
4. Confirm IMS SSO is configured
5. Check firewall/VPN restrictions

**Command to test**:
```bash
env=stage npx playwright test tests/specFiles/ga/login/ --project chromium --debug
```

### Issue: "Component not found on stage"

**Solution**:
1. Verify component is published to stage
2. Check URL in test matches stage structure
3. Verify author/publish URLs are correct
4. Check component permissions

### Issue: "Wrong environment loaded"

**Solution**:
1. Verify `env=stage` is set correctly
2. Check file exists: `tests/environments/.env.stage`
3. Verify environment variable prefix is correct
4. Clear node cache: `rm -rf node_modules/.cache`

---

## Security Best Practices

### ✅ DO:
- ✅ Store credentials in `.env` files (gitignored)
- ✅ Use secrets manager for CI/CD pipelines
- ✅ Rotate credentials regularly
- ✅ Use service accounts for automation
- ✅ Restrict access to stage credentials
- ✅ Audit stage test execution logs

### ❌ DON'T:
- ❌ Commit credentials to git repository
- ❌ Log passwords in test output
- ❌ Share credentials via email/chat
- ❌ Use production credentials for testing
- ❌ Store passwords in code comments
- ❌ Use personal accounts for test automation

---

## CI/CD Integration Example

### GitHub Actions (stage environment)

```yaml
name: Test Stage Environment

on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8am

jobs:
  test-stage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      
      - run: npx playwright install
      
      - run: env=stage npx playwright test tests/specFiles/ga/ --project chromium
        env:
          AEM_AUTHOR_USERNAME: ${{ secrets.STAGE_AEM_USERNAME }}
          AEM_AUTHOR_PASSWORD: ${{ secrets.STAGE_AEM_PASSWORD }}
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-stage
          path: playwright-report/
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Total Environments** | 6 (local, dev, stage, qa, uat, prod) |
| **Stage Status** | ✅ Configured and ready |
| **Configuration File** | `tests/environments/.env.stage` |
| **Requires Setup** | Credentials (username/password) |
| **Use Command** | `env=stage npx playwright test ...` |
| **Security** | Credentials stored in secrets manager |
| **Next Step** | Add stage credentials and test connection |

---

**Last Updated**: May 5, 2026  
**Configuration Status**: ✅ COMPLETE  
**Stage Environment**: ✅ READY FOR CONFIGURATION

