# Sprint 18 Batch Test Generation Guide

This guide walks you through generating tests for all 28 Sprint 18 Jira tickets.

## Quick Start

```bash
# 1. Get your Jira API token (see "Get Jira API Token" section below)
# 2. Run batch generation:
export JIRA_API_TOKEN="your-api-token-here"
node scripts/run-sprint-18-batch.js local 3

# Or in one command:
JIRA_API_TOKEN="your-api-token-here" node scripts/run-sprint-18-batch.js local 3
```

---

## Step 1: Get Jira API Token

### Why You Need It
The batch generator must authenticate with Jira to fetch ticket details (summary, description, acceptance criteria, etc.).

### How to Get It

1. **Go to your Atlassian account settings:**
   - Open https://id.atlassian.com/manage-profile/security/api-tokens
   - You'll need to log in with your Atlassian account

2. **Create a new API token:**
   - Click **"Create API token"** button
   - Give it a descriptive name (e.g., "GA-Test-Generation-Bot")
   - Click **"Create"**
   - **Copy the token immediately** — you won't see it again

3. **Verify the token works:**
   ```bash
   # Replace YOUR-TOKEN with the actual token you just created
   curl -X GET "https://bounteous.jira.com/rest/api/3/myself" \
     -H "Authorization: Basic $(echo -n 'am.puneeth@bounteous.com:YOUR-TOKEN' | base64)" \
     -H "Content-Type: application/json"
   ```
   - If successful, you'll see your user details in JSON format
   - If it fails, double-check the token and email

---

## Step 2: Run Batch Generation

### Option A: Interactive (Recommended for Testing)

```bash
# Set the token for this terminal session only
export JIRA_API_TOKEN="your-api-token-here"

# Run with default batch size of 3
node scripts/run-sprint-18-batch.js local 3

# Or with larger batches (5 tickets at a time)
node scripts/run-sprint-18-batch.js local 5
```

### Option B: Command Line (One-Liner)

```bash
JIRA_API_TOKEN="your-api-token-here" node scripts/run-sprint-18-batch.js local 3
```

### Option C: Persistent (Add to ~/.bashrc or ~/.zshrc)

```bash
# Add this line to ~/.bashrc or ~/.zshrc
export JIRA_API_TOKEN="your-api-token-here"

# Then reload your shell:
source ~/.bashrc  # or: source ~/.zshrc

# Now you can run anytime:
node scripts/run-sprint-18-batch.js local 3
```

### Option D: PowerShell (Windows)

```powershell
# In PowerShell:
$env:JIRA_API_TOKEN = "your-api-token-here"
node scripts/run-sprint-18-batch.js local 3

# Or use the PowerShell script:
.\scripts\run-sprint-18-generation.ps1 -JiraToken "your-api-token-here"
```

---

## What Happens During Generation

### Batch Processing Flow

For each batch (default 3 tickets at a time):

1. **Fetch from Jira:**
   - Retrieves ticket summary, description, acceptance criteria
   - Saves normalized JSON to `tickets/GAAM-XXXX-requirements.json`

2. **Generate Tests:**
   - Runs Playwright generator for each ticket
   - Uses `env=local` to point to local AEM instance (localhost:4502)
   - Creates/updates Page Object Models (POMs) in `tests/pages/ga/components/`
   - Creates spec files in `tests/specFiles/ga/`
   - Generates locator sidecars (`.locators.json`)

3. **Pause Between Batches:**
   - 3-second delay after each batch to avoid resource contention
   - Allows file system to sync

### Output Structure

```
tickets/
  GAAM-1267-requirements.json
  GAAM-1265-requirements.json
  ... (one per ticket)

tests/pages/ga/components/
  textPage.ts                  (new or updated)
  textPage.locators.json       (new or updated)
  ... (one POM per component)

tests/specFiles/ga/
  text/
    text.author.spec.ts        (core happy-path tests)
    text.interaction.spec.ts   (parent-child context)
    text.matrix.spec.ts        (state combinations)
    text.visual.spec.ts        (visual regression)
    text.images.spec.ts        (broken image detection)
  button/
    ... (same structure)

reports/
  sprint-18-summary-YYYY-MM-DD-HHMMSS.txt
  
.claude/sprint-18-generation/
  generation-YYYY-MM-DD-HHMMSS.log
```

---

## Understanding the Batch Size Parameter

```bash
# Batch size = 3 (default)
node scripts/run-sprint-18-batch.js local 3
# Processes: GAAM-1267, GAAM-1265, GAAM-1252 (wait 3s)
#            GAAM-1245, GAAM-1244, GAAM-1217 (wait 3s)
#            ... and so on

# Batch size = 5 (more aggressive)
node scripts/run-sprint-18-batch.js local 5
# Processes: GAAM-1267, GAAM-1265, GAAM-1252, GAAM-1245, GAAM-1244 (wait 3s)
#            GAAM-1217, GAAM-1192, GAAM-1179, GAAM-1174, GAAM-1172 (wait 3s)
#            ... and so on
```

**Recommendation:**
- Start with **batch size 3** for stability
- Increase to **5 or 6** if you need faster completion and your system can handle it

---

## Monitoring Progress

### While Running

The script will output:
- Progress counter: `[1/28]`, `[2/28]`, etc.
- Jira fetch status: ✅ or ❌
- Generator status: ✅ or ⚠️
- Current ticket being processed

### After Completion

Check these files:

```bash
# Summary report
cat reports/sprint-18-summary-*.txt

# Detailed logs
cat .claude/sprint-18-generation/generation-*.log

# Verify POMs were created
ls tests/pages/ga/components/

# Verify specs were created
ls tests/specFiles/ga/*/
```

---

## Running the Generated Tests

### 1. Smoke Tests (Quick Sanity Check)

```bash
env=local npx playwright test --grep @smoke --project chromium
```

### 2. Full Component Tests

```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 6
```

### 3. Mobile Tests

```bash
npx playwright test --grep @mobile --project Pixel5
```

### 4. Accessibility Tests

```bash
npx playwright test --grep @a11y --project chromium
```

### 5. Visual Regression Tests

```bash
npx playwright test --grep @visual --project chromium
```

---

## Troubleshooting

### Error: "JIRA_API_TOKEN not set"

**Solution:**
```bash
export JIRA_API_TOKEN="your-token"
# Then run the script again
node scripts/run-sprint-18-batch.js local 3
```

### Error: "HTTP 401: Unauthorized"

**Possible causes:**
- Token is invalid or expired
- Email address is wrong (should be `am.puneeth@bounteous.com`)
- Token has insufficient permissions

**Solution:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Delete the old token
3. Create a new one
4. Copy and use the new token

### Error: "Cannot find playwright"

**Solution:**
```bash
npm install
npx playwright install
```

### Generator Takes Too Long

**Possible causes:**
- Local AEM instance (localhost:4502) is slow or not running
- Too many tickets in batch

**Solution:**
1. Check if AEM is running: `curl http://localhost:4502`
2. Reduce batch size to 2: `node scripts/run-sprint-18-batch.js local 2`
3. Or run individual tickets instead:
   ```bash
   export JIRA_API_TOKEN="your-token"
   JIRA_TICKET=GAAM-1267 env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium
   ```

### Some Tickets Failed

**What this means:**
- The generator was able to fetch the ticket from Jira
- It may have failed to create the POM or some spec files

**What to do:**
1. Check the log file for details: `.claude/sprint-18-generation/generation-*.log`
2. Try running the failed ticket individually:
   ```bash
   export JIRA_API_TOKEN="your-token"
   JIRA_TICKET=GAAM-XXXX env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium
   ```
3. If it fails again, the ticket might have issues (bad format, missing fields, etc.)

---

## All 28 Tickets

The batch script will process these tickets in order:

```
GAAM-1267, GAAM-1265, GAAM-1252, GAAM-1245, GAAM-1244, GAAM-1217,
GAAM-1192, GAAM-1179, GAAM-1174, GAAM-1172, GAAM-1155, GAAM-1145,
GAAM-1138, GAAM-1101, GAAM-1089, GAAM-1084, GAAM-1082, GAAM-1073,
GAAM-1063, GAAM-1062, GAAM-1021, GAAM-989,  GAAM-978,  GAAM-903,
GAAM-747,  GAAM-450,  GAAM-278,  GAAM-170
```

Total: **28 tickets**

---

## Advanced: Running Individual Tickets

If you want to generate tests for just one ticket without batch mode:

```bash
export JIRA_API_TOKEN="your-token"

# Option 1: Fetch from Jira and generate
JIRA_TICKET=GAAM-1267 env=local npx playwright test generate-from-jira \
  --config playwright.generators.config.ts \
  --project chromium

# Option 2: Use pre-fetched JSON
JIRA_JSON=tickets/GAAM-1267-requirements.json env=local npx playwright test generate-from-jira \
  --config playwright.generators.config.ts \
  --project chromium
```

---

## Security Notes

### Protecting Your Token

- **Never commit the token** to git (it's in `.gitignore` by default)
- **Don't share it** in Slack, email, or chat
- **Store it securely** — use environment variables or a password manager
- **Rotate it regularly** — go to Atlassian settings to delete old tokens

### Best Practices

1. **Use a dedicated service account:**
   - Ideally, create a bot account for CI/CD instead of personal account
   - But for now, using your personal account is fine

2. **Minimize token scope:**
   - Jira API tokens have full API access to your instance
   - Only create when needed, delete when done

3. **Monitor token usage:**
   - Check Atlassian for "active sessions" to see if your token was compromised

---

## FAQ

### Q: Why batch size 3?
**A:** It's a safe default that balances speed and stability. You can experiment with different sizes.

### Q: What environment should I use?
**A:** Use `local` if your local AEM (localhost:4502) is running. Use `dev`, `qa`, etc. if testing against those environments.

### Q: Can I run it on CI/CD?
**A:** Yes! Set `JIRA_API_TOKEN` as a secret in your CI/CD provider (GitHub Actions, Bitbucket Pipelines, etc.) and run the script.

### Q: What if I only want to process some tickets?
**A:** Edit the `TICKETS` array in `scripts/run-sprint-18-batch.js`, or run individual tickets.

### Q: How long does it take?
**A:** Roughly 2-5 minutes per ticket depending on AEM performance. 28 tickets ≈ 1-2 hours total.

### Q: Can I stop it midway?
**A:** Yes, press `Ctrl+C`. The script will save progress up to that point.

---

## Next Steps After Generation

1. **Review generated files:**
   ```bash
   # Check POMs
   git diff tests/pages/ga/components/
   
   # Check specs
   git diff tests/specFiles/ga/
   ```

2. **Commit the generated code:**
   ```bash
   git add tests/pages/ga/components/
   git add tests/specFiles/ga/
   git commit -m "feat: Generate tests for Sprint 18 (28 tickets)"
   ```

3. **Run smoke tests:**
   ```bash
   env=local npx playwright test --grep @smoke --project chromium
   ```

4. **Fix any failing tests** and update your code

5. **Create a PR** for code review

---

## Support

- **Playwright docs:** https://playwright.dev
- **Jira API docs:** https://developer.atlassian.com/cloud/jira/rest/v3
- **GATestFramework repo:** See `repo-overview.md` for project structure

For issues with the generator, check the logs in `.claude/sprint-18-generation/`
