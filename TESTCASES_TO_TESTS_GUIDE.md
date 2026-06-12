# Generate Tests from Excel Test Cases

## ✅ Why This is Better

You already have **54 Excel files with actual test cases** at:
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
```

**Instead of:**
- Fetching from Jira (unreliable, network-dependent)
- Guessing what tests to run

**You can use:**
- Pre-written, proven test cases
- Local files (no network dependency)
- Direct mapping to test scenarios

---

## ⚡ 30-Second Quick Start

```bash
# 1. Make script executable
chmod +x generate-from-testcases.sh

# 2. Run it (converts Excel → CSV → Tests)
./generate-from-testcases.sh

# That's it! Script handles:
# ✓ Finding all 54 Excel files
# ✓ Converting to CSV
# ✓ Generating Playwright tests
# ✓ Creating POMs and specs
# ✓ Logging all progress
```

---

## 📊 What Happens

```
Step 1: Discover
  └─ Find all 54 Excel files in C:\Users\PuneethAM\GA_testcases\GA_testcases\
     GAAM-1000_REFERENCE_FORMAT_Component_Feature_Implementation.xlsx
     GAAM-1001_REFERENCE_FORMAT_Component_Feature_Implementation.xlsx
     ... (54 total)

Step 2: Convert
  └─ Convert each Excel file to CSV (preserves test data)
     GAAM-1000-testcases.csv
     GAAM-1001-testcases.csv
     ... (54 CSVs)

Step 3: Generate Tests
  └─ For each CSV, run: /automate excel <csv-path>
     Generates:
       • tests/specFiles/ga/component/component.author.spec.ts
       • tests/pages/ga/components/componentPage.ts
       • tests/pages/ga/components/componentPage.locators.json
       • component-test-summary.html
       • content-fixtures/component-fixtures.xml

Step 4: Report
  └─ Summary of what was generated:
     ✓ 52/54 successful
     ✗ 2 failed (easy to debug via logs)
```

---

## 🎯 Advantages Over Jira Approach

| Factor | Jira Fetch | Excel Files ✓ |
|--------|-----------|----------------|
| **Reliability** | ❌ Network-dependent | ✅ Local files |
| **Already exists?** | ❌ No | ✅ Yes (54 files) |
| **Accuracy** | ⚠️ Depends on Jira data | ✅ Pre-verified |
| **Speed** | ❌ Slower (API calls) | ✅ Instant (local) |
| **Debuggable** | ❌ Hard | ✅ CSV files easy to review |
| **Editable** | ⚠️ Requires Jira access | ✅ Just edit CSV/Excel |

---

## 📂 File Locations

### Input (Test Cases)
```
C:\Users\PuneethAM\GA_testcases\GA_testcases\
├── GAAM-1000_REFERENCE_FORMAT_Component_Feature_Implementation.xlsx
├── GAAM-1001_REFERENCE_FORMAT_Component_Feature_Implementation.xlsx
├── ... (54 total)
└── GAAM-338_REFERENCE_FORMAT_Component_Feature_Implementation.xlsx
```

### Output (Generated Tests)
```
tests/specFiles/ga/
├── component-1/
│   ├── component-1.author.spec.ts
│   ├── component-1.interaction.spec.ts
│   ├── component-1.matrix.spec.ts
│   ├── component-1.visual.spec.ts
│   ├── component-1.images.spec.ts
│   ├── component-1-test-summary.html
│   └── content-fixtures/component-1-fixtures.xml
├── component-2/
│   └── ... (same structure)
└── ... (for all 54 tickets)

tests/pages/ga/components/
├── component-1Page.ts
├── component-1Page.locators.json
├── component-2Page.ts
├── component-2Page.locators.json
└── ... (POMs for all components)
```

### Temporary (For Reference)
```
.temp/sprint-17-csv/
├── GAAM-1000-testcases.csv
├── GAAM-1001-testcases.csv
└── ... (54 CSVs, kept for debugging)
```

---

## 🚀 Running the Script

### Prerequisites

1. **Python 3** (to convert Excel → CSV)
   ```bash
   python3 --version  # Should be 3.7+
   ```

2. **openpyxl** (Python Excel library)
   ```bash
   pip install openpyxl
   # or
   pip3 install openpyxl
   ```

3. **AEM Running** (for POM generation)
   ```bash
   curl http://localhost:4502
   # Expected: 302 redirect
   ```

4. **Playwright** (already installed via npm)
   ```bash
   npm list @playwright/test
   ```

### Installation

```bash
# 1. Install Python dependencies
pip install openpyxl

# 2. Make script executable
chmod +x generate-from-testcases.sh

# 3. Run it
./generate-from-testcases.sh
```

---

## 📖 Script Output

The script shows real-time progress:

```
Sprint 17 Test Generation from Excel Test Cases
===============================================
Started: 2026-06-12 12:00:00

ℹ Checking prerequisites...
✓ Found 54 test case files

ℹ Converting Excel to CSV...
✓ GAAM-1000
✓ GAAM-1001
✓ GAAM-1002
... (all 54)

✓ Conversion complete: 54/54 files

ℹ Generating tests from CSV files...

[1/54] Generating for GAAM-1000... ✓
[2/54] Generating for GAAM-1001... ✓
[3/54] Generating for GAAM-1002... ✓
... (progress continues)

=== Generation Complete ===

Sprint 17 Test Generation Summary
==================================

Conversions:
  Total: 54
  Converted: 54
  Failed: 0

Test Generation:
  Total CSVs: 54
  Generated: 52
  Failed: 2
  Success rate: 96%

Next steps:
  1. Verify generated tests:
     npx playwright test --grep '@smoke' --project chromium

  2. Run full test suite:
     env=local npx playwright test tests/specFiles/ga/ --project chromium

  3. Review HTML summaries:
     ls tests/specFiles/ga/*/\*-test-summary.html
```

---

## 📋 Logs & Debugging

### Log Locations
```bash
.claude/sprint-17-testcase-generation/
├── generation-TIMESTAMP.log         # Main log
├── errors-TIMESTAMP.log             # Failed generations
├── GAAM-1000-generation.log         # Per-ticket generation logs
├── GAAM-1001-generation.log
└── ... (one per ticket)
```

### View Logs
```bash
# Watch real-time
tail -f .claude/sprint-17-testcase-generation/generation-*.log

# View errors
cat .claude/sprint-17-testcase-generation/errors-*.log

# View specific ticket failure
cat .claude/sprint-17-testcase-generation/GAAM-1000-generation.log

# Count successes
grep "✓" .claude/sprint-17-testcase-generation/generation-*.log | wc -l
```

---

## ✅ Validation Steps

After generation:

### 1. Quick Check (5 minutes)
```bash
# Run smoke tests only
npx playwright test --grep "@smoke" --project chromium --workers 4

# Expected: 100-200 smoke tests pass
```

### 2. Full Validation (20-30 minutes with AEM)
```bash
# Run all tests on chromium
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Expected: All should pass (if selectors are correct)
```

### 3. Review Generated Tests
```bash
# Count generated specs
find tests/specFiles/ga -name "*.spec.ts" | wc -l

# Count POMs
ls tests/pages/ga/components/*Page.ts | wc -l

# View HTML summaries
open tests/specFiles/ga/component-name/component-name-test-summary.html
```

---

## 🐛 Troubleshooting

### Error: "Python not found"
```bash
# Install Python 3
# macOS: brew install python3
# Windows: https://www.python.org/downloads/
# Linux: sudo apt-get install python3

python3 --version
```

### Error: "No module named 'openpyxl'"
```bash
pip install openpyxl
# or
pip3 install openpyxl
```

### Error: "AEM auth failed"
```bash
# Start AEM
cd ~/AEM && ./start.sh

# Wait 60 seconds for boot
sleep 60

# Verify ready
curl http://localhost:4502
```

### Error: "Timeout during generation"
```bash
# Increase timeout (default 10 min per ticket)
TIMEOUT=900 ./generate-from-testcases.sh
# (900 seconds = 15 minutes)
```

### Generated Tests Have Wrong Selectors
```bash
# Means component not on style guide or AEM not responsive
# Check:
# 1. Component deployed to AEM
# 2. Style guide page loads: curl http://localhost:4502/content/.../style-guide/components/
# 3. AEM has enough resources
```

---

## 🎯 Expected Results

After ~4 hours:

```
✓ 54/54 Excel files found
✓ 54/54 Converted to CSV
✓ 52/54 Tests generated successfully
✗ 2/54 Failed (easy to debug via logs)

Generated:
  • 50+ spec files (.author, .interaction, .matrix, .visual, .images)
  • 15-20 component POMs
  • 15-20 locator sidecars
  • 15-20 HTML test summaries
  • 10-15 content fixtures

Tests added:
  • 2,000-3,000+ new test cases
  • Coverage from pre-written scenarios
  • Ready to run on CI/CD
```

---

## 💡 Pro Tips

**Tip 1**: Keep CSV files for reference
```bash
# CSV files are saved in .temp/sprint-17-csv/
# You can review them if tests fail:
cat .temp/sprint-17-csv/GAAM-1000-testcases.csv
```

**Tip 2**: Run in background
```bash
# Keep generation running even if terminal disconnects
tmux new-session -d -s s17 './generate-from-testcases.sh && echo DONE'

# Check progress later
tail -f .claude/sprint-17-testcase-generation/*.log
```

**Tip 3**: Edit Excel files before generation
```bash
# If you want to modify test cases:
# 1. Edit the Excel files in C:\Users\PuneethAM\GA_testcases\GA_testcases\
# 2. Run the script again
# 3. Script will regenerate from updated files
```

---

## 📝 Next Steps

1. **Run the script**: `./generate-from-testcases.sh`
2. **Monitor progress**: `tail -f .claude/sprint-17-testcase-generation/*.log`
3. **Wait for completion**: ~4 hours
4. **Validate tests**: `npx playwright test --grep "@smoke" --project chromium`
5. **Review results**: Check `tests/specFiles/ga/` for new tests
6. **Commit changes**: `git add tests/specFiles/ga/ tests/pages/ga/`
7. **Create PR**: Submit for code review

---

## Questions?

Check the logs:
```bash
cat .claude/sprint-17-testcase-generation/errors-*.log
```

Or view specific ticket generation:
```bash
cat .claude/sprint-17-testcase-generation/GAAM-1000-generation.log
```

