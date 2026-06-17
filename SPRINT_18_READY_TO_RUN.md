# Sprint 18 Batch Test Generation - READY TO RUN

## Status: Orchestration Framework Ready ✅

All infrastructure and scripts for processing 28 Sprint 18 Jira tickets have been created and configured. The system is **ready to execute** pending a single requirement: **your Jira API Token**.

---

## What Has Been Prepared

### 1. **Main Batch Processing Scripts**

#### Node.js Batch Script (Recommended)
- **Location:** `scripts/run-sprint-18-batch.js`
- **Features:**
  - Processes all 28 tickets sequentially
  - Configurable batch size (default 3 tickets/batch)
  - Proper logging and error handling
  - JSON requirement saving to `tickets/` directory
  - Detailed summary reports
  - Works on Windows, macOS, Linux

#### PowerShell Script (Windows Native)
- **Location:** `scripts/run-sprint-18-generation.ps1`
- **Features:**
  - Windows-native implementation
  - Fetches Jira tickets via REST API
  - Saves requirements JSON
  - Runs Playwright generator per ticket

#### Bash Script (Linux/macOS)
- **Location:** `scripts/batch-sprint-18-generation.sh`
- **Features:**
  - POSIX-compatible shell script
  - Batch processing with inter-batch pauses
  - Detailed logging
  - Portable

#### Windows Batch Helper
- **Location:** `scripts/start-sprint-18-batch.cmd`
- **Features:**
  - Simple Windows batch file wrapper
  - Sets environment variables
  - Easy to use

### 2. **Verification Tool**

- **Location:** `scripts/verify-jira-token.js`
- **Purpose:** Test your Jira API token before running batch generation
- **Usage:**
  ```bash
  JIRA_API_TOKEN=your-token node scripts/verify-jira-token.js
  ```

### 3. **Documentation**

- **Location:** `SPRINT_18_BATCH_GENERATION.md`
- **Contents:**
  - Step-by-step setup instructions
  - How to get Jira API token
  - Usage examples for all platforms
  - Troubleshooting guide
  - FAQ section
  - Security best practices

---

## All 28 Tickets Ready for Processing

```
GAAM-1267  GAAM-1265  GAAM-1252  GAAM-1245  GAAM-1244  GAAM-1217
GAAM-1192  GAAM-1179  GAAM-1174  GAAM-1172  GAAM-1155  GAAM-1145
GAAM-1138  GAAM-1101  GAAM-1089  GAAM-1084  GAAM-1082  GAAM-1073
GAAM-1063  GAAM-1062  GAAM-1021  GAAM-989   GAAM-978   GAAM-903
GAAM-747   GAAM-450   GAAM-278   GAAM-170
```

---

## How to Run (5 Minutes to Complete Setup)

### Step 1: Get Jira API Token (2 minutes)

1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it (e.g., "GA-Test-Generation")
4. Click "Create"
5. **Copy the token immediately** (you won't see it again)

### Step 2: Verify Token Works (1 minute)

```bash
# Replace YOUR-TOKEN with the actual token
export JIRA_API_TOKEN="YOUR-TOKEN"
node scripts/verify-jira-token.js
```

Expected output:
```
✅ SUCCESS: Authenticated as [Your Name]
Test 2: Fetching sample ticket (GAAM-1267)...
✅ SUCCESS: Found ticket GAAM-1267
   Title: [ticket title]
   Status: [status]

✅ ALL TESTS PASSED
```

### Step 3: Run Batch Generation (2 minutes to start)

```bash
# Option A: Using Node.js (Recommended)
export JIRA_API_TOKEN="YOUR-TOKEN"
node scripts/run-sprint-18-batch.js local 3

# Option B: Using PowerShell (Windows)
$env:JIRA_API_TOKEN = "YOUR-TOKEN"
.\scripts\run-sprint-18-generation.ps1

# Option C: Using batch file (Windows)
set JIRA_API_TOKEN=YOUR-TOKEN
scripts\start-sprint-18-batch.cmd local 3

# Option D: One-liner (any platform)
JIRA_API_TOKEN="YOUR-TOKEN" node scripts/run-sprint-18-batch.js local 3
```

### Step 4: Monitor Progress

The script will display:
- Current ticket being processed: `[1/28] 🎫 Processing: GAAM-1267`
- Jira fetch status: ✅ or ❌
- Generator status: ✅ or ⚠️
- Batch completion messages

**Total time:** ~1-2 hours for all 28 tickets (2-5 min per ticket depending on AEM performance)

### Step 5: Verify Output

```bash
# Check summary
cat reports/sprint-18-summary-*.txt

# Check detailed logs
cat .claude/sprint-18-generation/generation-*.log

# Verify POMs created
ls tests/pages/ga/components/

# Verify specs created
ls tests/specFiles/ga/*/
```

---

## What Each Ticket Generation Produces

For each ticket (e.g., GAAM-1267):

### Files Created/Updated:

1. **Page Object Model (POM)**
   - `tests/pages/ga/components/componentNamePage.ts`
   - Class-based with constructor Page injection
   - All element selectors defined

2. **Locator Sidecar**
   - `tests/pages/ga/components/componentNamePage.locators.json`
   - Multi-strategy locators with confidence scores
   - Self-healing foundation

3. **Spec Files** (5 per component)
   - `text.author.spec.ts` - Core/happy-path tests
   - `text.interaction.spec.ts` - Parent-child context
   - `text.matrix.spec.ts` - State combinations
   - `text.visual.spec.ts` - Visual regression
   - `text.images.spec.ts` - Image validation

4. **Requirements Cache**
   - `tickets/GAAM-1267-requirements.json`
   - Normalized Jira data for reference

---

## Key Features of the Batch System

### ✅ Robustness
- Sequential processing (no parallel conflicts)
- Error handling per ticket (one failure doesn't stop the batch)
- Automatic logging and progress tracking
- Resumable (if interrupted, just run again)

### ✅ Transparency
- Real-time console output showing progress
- Detailed log files with timestamps
- Summary reports after completion
- Per-ticket status indicators

### ✅ Flexibility
- Configurable batch sizes (3, 5, 10, etc.)
- Works with multiple environments (local, dev, qa, uat, prod)
- Multiple platform support (Windows, macOS, Linux)
- Multiple script options (Node.js, PowerShell, Bash)

### ✅ Intelligence
- Validates token before processing
- Normalizes Jira API responses
- Handles malformed tickets gracefully
- Reports both successes and failures

---

## Generated Test Architecture

All generated tests follow these patterns:

### Test Tags
- `@smoke` - Smoke test suite
- `@regression` - Regression suite
- `@a11y` - Accessibility tests
- `@visual` - Visual regression
- `@interaction` - Component interaction
- `@matrix` - Combinatorial state tests
- `@mobile` - Mobile-specific tests

### Component Selectors
- Root: `.cmp-component-name`
- Elements: `.cmp-component-name__element`
- Modifiers: `.cmp-component-name--modifier`

### Test Structure
- **Author tests:** Core functionality
- **Interaction tests:** Context-aware behavior
- **Matrix tests:** Variant × Theme × Background × Viewport
- **Visual tests:** Figma-based visual regression
- **Image tests:** Broken images, alt text, oversizing

---

## Running the Generated Tests

After generation completes, run tests with:

```bash
# Smoke tests only
env=local npx playwright test --grep @smoke --project chromium

# All specs for a component
env=local npx playwright test tests/specFiles/ga/text/ --project chromium

# Full suite with 6 workers
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 6

# Mobile tests
npx playwright test --grep @mobile --project "Pixel 5"

# Accessibility tests
npx playwright test --grep @a11y --project chromium

# Visual regression
npx playwright test --grep @visual --project chromium

# View report
npx playwright show-report
```

---

## System Requirements

- **Node.js:** v16+ (already installed: `node -v`)
- **npm:** v7+ (already installed: `npm -v`)
- **Playwright:** v1.51+ (installed via npm)
- **AEM:** Local instance on localhost:4502 (or specify `env=dev`, etc.)
- **Internet:** To connect to https://bounteous.jira.com
- **Space:** ~500MB for generated files + Playwright artifacts

---

## Security & Token Management

### ✅ Safe Practices Implemented
- Token not stored in git (`.gitignore` configured)
- Token passed via environment variable (not command line)
- No token logging to files
- Token validation before use

### How to Store Safely
```bash
# Option 1: Add to ~/.bashrc (persistent for your user)
echo 'export JIRA_API_TOKEN="your-token"' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use password manager
# Store in Bitwarden, 1Password, etc. and paste when needed

# Option 3: CI/CD secrets
# Set as repository secret in GitHub, GitLab, Bitbucket, etc.
```

### Token Rotation
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Delete the old token
3. Create a new one
4. Update your environment variable

---

## Troubleshooting Quick Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "JIRA_API_TOKEN not set" | Missing token | `export JIRA_API_TOKEN="your-token"` |
| "HTTP 401: Unauthorized" | Invalid token | Verify token at https://id.atlassian.com |
| "Cannot find playwright" | Not installed | `npm install && npx playwright install` |
| "AEM not responding" | localhost:4502 offline | Start AEM or use `env=dev` |
| "Generator takes too long" | AEM slow | Reduce batch size to 2 or 1 |

For more details, see: `SPRINT_18_BATCH_GENERATION.md`

---

## Summary: What Happens When You Run

1. **Authentication:** Token is validated against Jira
2. **Fetching:** Each ticket is fetched from Jira API
3. **Normalization:** Ticket data is converted to standard format
4. **Generation:** Playwright generator creates:
   - Page Object Models (POMs)
   - Locator sidecars
   - 5 spec files per component
5. **Logging:** All progress tracked in log files
6. **Reporting:** Summary generated with counts and output locations

**Output:** 
- ~28 POMs (one per unique component)
- ~140 spec files (5 per component)
- 28 requirements JSONs (for reference)
- Detailed logs and summary reports

---

## Next Steps

### Now:
1. ✅ Read this file (you are here)
2. Get Jira API Token (5 minutes)
3. Run verification script (1 minute)
4. Start batch generation (2 minutes setup, 1-2 hours runtime)

### After Batch Completes:
1. Review generated files: `git diff tests/`
2. Run smoke tests: `env=local npx playwright test --grep @smoke`
3. Fix any issues
4. Commit: `git add tests/ && git commit -m "feat: Generate Sprint 18 tests"`
5. Create PR for review

### For CI/CD:
1. Set `JIRA_API_TOKEN` as repository secret
2. Add this to your pipeline:
   ```bash
   JIRA_API_TOKEN=${{ secrets.JIRA_API_TOKEN }} node scripts/run-sprint-18-batch.js local 5
   ```

---

## File Locations Summary

| File | Purpose |
|------|---------|
| `scripts/run-sprint-18-batch.js` | Main Node.js batch processor |
| `scripts/run-sprint-18-generation.ps1` | PowerShell batch processor |
| `scripts/batch-sprint-18-generation.sh` | Bash batch processor |
| `scripts/verify-jira-token.js` | Token verification tool |
| `SPRINT_18_BATCH_GENERATION.md` | Detailed guide & FAQ |
| `tickets/` | Generated requirement JSONs |
| `tests/pages/ga/components/` | Generated POMs |
| `tests/specFiles/ga/` | Generated spec files |
| `reports/` | Summary reports |
| `.claude/sprint-18-generation/` | Detailed logs |

---

## Support Resources

- **Playwright:** https://playwright.dev
- **Jira API:** https://developer.atlassian.com/cloud/jira/rest/v3
- **Project Docs:** See `repo-overview.md`
- **This Guide:** `SPRINT_18_BATCH_GENERATION.md`

---

## Ready to Launch?

```bash
# 1. Get token from: https://id.atlassian.com/manage-profile/security/api-tokens
# 2. Verify it works:
export JIRA_API_TOKEN="your-token-here"
node scripts/verify-jira-token.js

# 3. Run batch generation:
node scripts/run-sprint-18-batch.js local 3

# ✅ Done!
```

**Questions?** Check `SPRINT_18_BATCH_GENERATION.md` or review logs in `.claude/sprint-18-generation/`
