# Test Execution Time Optimization Guide

## Quick Start (Fastest Local Testing)

### Option 1: Run only Chromium (RECOMMENDED for local development)
```bash
# Fastest - only chromium, no video/trace overhead
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Estimated time: 15-20 minutes
```

### Option 2: Run specific component (Fastest for debugging)
```bash
# Test a single component
env=local npx playwright test tests/specFiles/ga/button/ --project chromium --workers 4

# Estimated time: 2-5 minutes
```

### Option 3: Run by tag (Fast filtering)
```bash
# Run only smoke tests (subset of tests marked @smoke)
npx playwright test --grep "@smoke" --project chromium --workers 4

# Run only accessibility tests
npx playwright test --grep "@a11y" --project chromium --workers 4

# Run regression tests
npx playwright test --grep "@regression" --project chromium --workers 4

# Estimated time: 5-10 minutes
```

### Option 4: Full test suite (slow - for CI only)
```bash
# All 5 browser projects - runs desktop parallel with mobile
# Desktop: chromium, firefox, webkit (3 workers each)
# Mobile: Mobile-Chrome, Mobile-WebKit (2 workers each)
npx playwright test tests/specFiles/ga/ --workers 4

# Estimated time: 2-3 hours (previously 6+ hours)
```

## CI/CD Pipeline (Bitbucket)

The CI pipeline automatically runs:
- **Mobile tests** (Mobile-Chrome + Mobile-WebKit): ~30 minutes, 4 workers
- **Desktop tests** (chromium + firefox + webkit): ~1 hour, 4 workers
- Both run in parallel, total: ~1 hour

## Performance Improvements Made

| Change | Impact |
|--------|--------|
| Disable videos/traces locally | -30-40% |
| Skip firefox/webkit for local dev | -50% |
| Already optimized: removed redundant auth | -50% (done in previous commit) |

## Test Categories

Each component generates 5 spec file types:

| Type | Tags | Speed | When to Use |
|------|------|-------|------------|
| `.author.spec.ts` | `@smoke @regression` | ⚡ Fast (2-3s per test) | Quick validation |
| `.interaction.spec.ts` | `@interaction` | ⚡ Fast (2-3s) | Context/nesting tests |
| `.matrix.spec.ts` | `@matrix` | 🐢 Slow (5-10s per test) | Thorough variant testing |
| `.visual.spec.ts` | `@visual` | 🐢 Slow (5-8s per test) | Design regression |
| `.images.spec.ts` | `@regression` | ⚡ Fast (2-3s) | Image health |

## Execution Timing Examples

### Local Development (Chromium only, no video)
- **All GA tests**: 15-20 minutes
- **Single component**: 2-5 minutes
- **@smoke tag**: 3-5 minutes

### CI Pipeline (All browsers)
- **Mobile step** (2 projects, 4 workers): ~30 minutes
- **Desktop step** (3 projects, 4 workers): ~1 hour
- **Total** (parallel): ~1 hour

## Recommended Workflow

1. **During development** → Use chromium only
   ```bash
   env=local npx playwright test tests/specFiles/ga/your-component/ --project chromium
   ```

2. **Before committing** → Run @smoke tests
   ```bash
   npx playwright test --grep "@smoke" --project chromium
   ```

3. **Before pushing** → Run full chromium suite
   ```bash
   env=local npx playwright test tests/specFiles/ga/ --project chromium
   ```

4. **On CI** → All browsers (automatic, no manual action needed)

## Troubleshooting Slow Tests

### If tests are still slow locally:

1. Check CPU/memory usage
   ```bash
   # Reduce workers if system is under stress
   npx playwright test --workers 2
   ```

2. Check for hanging browser instances
   ```bash
   # Kill any lingering processes
   taskkill /F /IM chrome.exe /FI "windowtitle eq --headless"
   ```

3. Run with debug output
   ```bash
   PWDEBUG=1 npx playwright test --project chromium --workers 1
   ```

## Next Steps for Further Optimization

- [ ] Audit 276 explicit waits (`page.waitFor`, `setTimeout`)
- [ ] Consider reducing matrix test scope to chromium + 1 mobile project
- [ ] Evaluate upgrading CI workers from 4 to 6-8 workers
