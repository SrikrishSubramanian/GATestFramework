# Sprint 17 Quick Start - Safe Test Generation

## ⚡ 30-Second Setup

```bash
# 1. Set Jira credentials (one-time)
export JIRA_EMAIL=your-email@bounteous.com
export JIRA_API_TOKEN=your-jira-api-token

# 2. Verify AEM is running
curl http://localhost:4502
# Should return 302 redirect (not Connection refused)

# 3. Run the safe generation script
chmod +x generate-sprint-17-safe.sh
./generate-sprint-17-safe.sh

# That's it! Script handles the rest...
```

---

## 📊 What the Script Does

✅ **Generates tests for all 54 tickets individually** (one at a time)  
✅ **Easy debugging** - identify exactly which ticket failed  
✅ **Automatic retries** - retries failed tickets 2 times  
✅ **Full logging** - all output saved to `.claude/sprint-17-generation/`  
✅ **Progress tracking** - shows status for each ticket in real-time  
✅ **Error reporting** - clear list of failed tickets and why  

---

## 🎯 Why This Script is Best

| Feature | Other Methods | This Script |
|---------|---------------|-------------|
| **Error isolation** | ❌ Hard to know which ticket failed | ✅ Clear ticket-by-ticket reporting |
| **Debugging** | ❌ Large batch failures | ✅ One ticket at a time |
| **Retries** | ❌ None | ✅ Automatic 2 retries per ticket |
| **Logging** | ❌ Mixed output | ✅ Separate log per ticket |
| **Resume** | ❌ Have to restart all | ✅ Can re-run failed tickets |
| **Speed** | ✅ Fast | ⏱️ Slower but worth it |

**Ideal for**: Finding and fixing bugs in generated tests  
**Not ideal for**: Maximum speed (use batch method if all 54 are guaranteed to work)

---

## 🚀 Running the Script

### Step 1: Set Environment Variables

```bash
# Get your API token from Jira settings
# Settings → Personal Access Tokens → Create Token

export JIRA_EMAIL=your-email@bounteous.com
export JIRA_API_TOKEN=paste-your-token-here
export JIRA_URL=https://bounteous.jira.com
```

### Step 2: Verify Prerequisites

```bash
# Check AEM is running
curl http://localhost:4502
# Expected: 302 redirect

# Check Playwright is installed
npx playwright --version
# Expected: playwright v1.x.x

# Check npm is working
npm list @playwright/test | head -5
```

### Step 3: Run Generation

```bash
# Make script executable
chmod +x generate-sprint-17-safe.sh

# Run it (takes 2-4 hours depending on AEM speed)
./generate-sprint-17-safe.sh

# Or with custom timeout (increase if tests are slow)
TIMEOUT=900 ./generate-sprint-17-safe.sh  # 15 minutes per ticket

# Or with more retries
MAX_RETRIES=3 ./generate-sprint-17-safe.sh
```

### Step 4: Monitor Progress

The script will show:
```
[1/54] Processing GAAM-1190...
✓ GAAM-1190: Tests generated

[2/54] Processing GAAM-1189...
⟳ GAAM-1189: Attempt 1 failed, retrying...
✓ GAAM-1189: Tests generated

[3/54] Processing GAAM-1176...
✗ GAAM-1176: Failed after 2 attempts
```

---

## 📋 Output & Logs

### Files Created

```
.claude/sprint-17-generation/
├── sprint-17-TIMESTAMP.log          # Main log (all output)
├── sprint-17-errors-TIMESTAMP.log   # Failed tickets only
├── sprint-17-summary-TIMESTAMP.txt  # Final summary
├── GAAM-1190-attempt-1.log          # Individual ticket logs
├── GAAM-1190-attempt-2.log
├── GAAM-1189-attempt-1.log
└── ... (one per ticket)
```

### View Logs

```bash
# View main log (real-time during run)
tail -f .claude/sprint-17-generation/sprint-17-*.log

# View only errors
cat .claude/sprint-17-generation/sprint-17-errors-*.log

# View a specific ticket's failure
cat .claude/sprint-17-generation/GAAM-1190-attempt-2.log

# Count successes
grep "✓" .claude/sprint-17-generation/sprint-17-*.log | wc -l
```

---

## ✅ After Generation Completes

### 1. Check Results

```bash
# Count generated specs
find tests/specFiles/ga -type f -name "*.spec.ts" | wc -l

# Count new components
ls -d tests/specFiles/ga/*/ | wc -l

# View error summary
cat .claude/sprint-17-generation/sprint-17-errors-*.log
```

### 2. Run Quick Validation (5-10 minutes)

```bash
# Just smoke tests
npx playwright test --grep "@smoke" --project chromium --workers 4

# Or run one component to test
./quick-test.sh component button
```

### 3. If Tests Failed

```bash
# View why specific test failed
cat .claude/sprint-17-generation/GAAM-1190-attempt-2.log | tail -50

# Re-run just one ticket
JIRA_TICKET=GAAM-1190 \
  JIRA_EMAIL=your-email@bounteous.com \
  JIRA_API_TOKEN=your-token \
  env=local npx playwright test generate-from-jira \
    --config playwright.generators.config.ts --project chromium

# Check if issue is AEM or Jira
curl "https://bounteous.jira.com/rest/api/3/issues/GAAM-1190" \
  -H "Authorization: Bearer $JIRA_API_TOKEN"
```

---

## 🐛 Troubleshooting

### Script Says "AEM not responding"
```bash
# Start AEM
cd ~/AEM && ./start.sh

# Wait 60 seconds for it to boot
sleep 60

# Check it's ready
curl http://localhost:4502
```

### Script Says "Jira credentials invalid"
```bash
# Verify token works
curl "https://bounteous.jira.com/rest/api/3/myself" \
  -H "Authorization: Bearer $JIRA_API_TOKEN"

# If it fails, get new token from Jira settings
# Then export JIRA_API_TOKEN=new-token
```

### Script Times Out on One Ticket
```bash
# Increase timeout from 10 min to 15 min
TIMEOUT=900 ./generate-sprint-17-safe.sh

# Or rerun just that ticket with more time
JIRA_TICKET=GAAM-1050 timeout 1200 npx playwright test generate-from-jira ...
```

### Generated Tests Have Wrong Selectors
```bash
# Means AEM DOM doesn't match what generator scanned
# Solutions:
# 1. Verify component exists on style guide page
# 2. Check component is deployed to AEM
# 3. Try manual generation: ./quick-test.sh component button
```

---

## 📈 Performance Tips

### To Speed Up Generation

```bash
# Use fewer retries (default 2, but most succeed on first try)
MAX_RETRIES=1 ./generate-sprint-17-safe.sh  # ~2-3 hours instead of 4

# Increase timeout if tests are hanging (too low causes retries)
TIMEOUT=900 ./generate-sprint-17-safe.sh    # 15 min instead of 10
```

### To Save Results During Generation

```bash
# Run in tmux/screen so it survives terminal disconnect
tmux new-session -d -s sprint17 'cd ~/GATestFramework && ./generate-sprint-17-safe.sh'

# View logs later
tail -f .claude/sprint-17-generation/sprint-17-*.log
```

---

## 📊 Expected Results

After ~4 hours:

```
Sprint 17 Test Generation - Completed: [date]

Results:
  Total tickets: 54
  Generated: 52
  Failed: 2
  Success rate: 96%
  Duration: 4h 15m

Failed tickets:
  • GAAM-1050
  • GAAM-794

Next steps:
  1. Review generated tests: find tests/specFiles/ga -name '*.spec.ts' -newer .claude -type f
  2. Run quick validation: npx playwright test --grep '@smoke' --project chromium --workers 4
  3. View HTML test summaries: ls tests/specFiles/ga/*/\*-test-summary.html
```

---

## 🎯 Success Criteria

✅ Generation is successful when:
- [ ] 50+ spec files generated (out of 54 tickets)
- [ ] Error rate < 10% (< 6 failures)
- [ ] Each ticket either succeeded or has clear failure reason
- [ ] `@smoke` tests pass (5-10 minutes with AEM)
- [ ] HTML summaries created for all new components
- [ ] No "timeout" errors (increase TIMEOUT if this happens)

---

## 📝 Next Steps

1. **Run the script**: `./generate-sprint-17-safe.sh`
2. **Monitor progress**: `tail -f .claude/sprint-17-generation/*.log`
3. **Check results**: `cat .claude/sprint-17-generation/sprint-17-summary-*.txt`
4. **Validate**: `npx playwright test --grep "@smoke" --project chromium`
5. **Commit**: `git add -A && git commit -m "test: Generate Sprint 17 tests (52/54 successful)"`
6. **Create PR**: Share results with team

---

## 💡 Pro Tips

**Tip 1**: Set up a background session so generation keeps running if you disconnect
```bash
tmux new-session -d -s s17 'cd GATestFramework && ./generate-sprint-17-safe.sh && echo "DONE - Check results"'
```

**Tip 2**: Check progress without interrupting
```bash
# In another terminal
tail -f .claude/sprint-17-generation/sprint-17-*.log
```

**Tip 3**: If a ticket fails, you can see exactly why
```bash
cat .claude/sprint-17-generation/GAAM-1190-attempt-2.log | grep -A 20 "Error\|Error"
```

**Tip 4**: Quickly find which tickets failed
```bash
grep "✗" .claude/sprint-17-generation/sprint-17-*.log
```

