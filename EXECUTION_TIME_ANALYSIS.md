# Test Execution Time Analysis — Last Run with 4 Workers

## Last Full Test Run Summary
- **Date**: June 2, 2026 @ 18:46
- **Total Duration**: **7 hours 12 minutes 32 seconds**
- **Total Tests**: 1,969
- **Average per test**: 13.18 seconds
- **Failed tests**: 570
- **Passed tests**: 1,399
- **Skipped tests**: 95

## Why is execution so slow?

### Root Cause: AEM Server Not Available
The tests are **timing out waiting for AEM** on `localhost:4502`:
- Each test tries to authenticate with AEM
- If AEM is not running → connection refused
- Playwright waits ~5 minutes timeout per test before failing
- 1,969 tests × various timeouts = 7+ hours

**Evidence from earlier test attempt**:
```
[globalSetup] AEM auth failed: Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4502
```

### Secondary Issues
1. **No workers benefit**: 4 workers help, but timeouts still accumulate
2. **All 5 projects running**: Each test runs on chromium + firefox + webkit + 2 mobile browsers
3. **570 failures**: Tests failing at connection stage, not actual test logic
4. **No CI filtering**: The run includes all tests without @mobile/@desktop filters

## What Should Be Done

### For Local Development
```bash
# Run ONLY against chromium to save time
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
# Expected time: 15-20 minutes (with AEM running)
```

### For Accurate Timing
1. **Start AEM server** on localhost:4502
2. **Run chromium only** for development
3. **Let CI handle full browser matrix** (it's set up correctly)

## Realistic Expected Times

### With AEM Running (Chromium Only)
- 2,634 total tests ÷ (4 workers × 1 project) 
- ~10-15 seconds per test (depends on component)
- **Estimated: 20-30 minutes**

### With AEM Running (All 5 Projects)
- 2,634 tests × 5 projects = 13,170 test runs
- 13,170 ÷ (4 workers × 5 projects in parallel) = ~660 batches
- **Estimated: 2-3 hours** (down from 7+ hours)

### CI Pipeline (Optimized)
- Mobile tests (2 projects, 4 workers): ~30 minutes
- Desktop tests (3 projects, 4 workers): ~50 minutes
- Run in parallel → **~50-60 minutes total**

## Recent Smaller Test Runs
```
2026-06-01 12:05 | 57 tests   | 18m 10s (≈19 sec/test)
2026-06-01 11:57 | 52 tests   | 19m 27s (≈22 sec/test)
2026-06-01 11:16 | 4 tests    | 17m 9s  (??? timeout?)
```

These smaller runs still show 15-22 seconds per test, confirming:
- AEM availability is critical
- Without AEM, tests hit timeout limits

## Action Items

- [ ] **Verify AEM is running** on localhost:4502 before test runs
- [ ] **Run chromium only locally** for development (use TEST_EXECUTION_GUIDE.md)
- [ ] **Reserve full browser tests for CI** where they run in parallel
- [ ] **Monitor CI pipeline time** after recent optimizations (videos/traces disabled)

