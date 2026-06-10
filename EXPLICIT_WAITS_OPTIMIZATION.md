# Explicit Waits Optimization Guide

## Summary
- **Total explicit waits found**: 276 instances
- **Types**:
  - `page.waitForTimeout(ms)` - Fixed duration waits (most optimizable)
  - `page.waitForLoadState()` - Already optimal
  - `setTimeout()` - Test helper waits (safe to optimize)

## Optimization Strategy

### Safe to Remove/Replace (Immediate Wins)

**Pattern 1: Animation waits (200-500ms)**
```typescript
// BEFORE (wasteful)
await page.waitForTimeout(500); // Wait for expansion animation

// AFTER (smart wait)
await element.locator('transition').waitFor({ timeout: 1000 });
// OR just rely on Playwright's auto-waiting
```

**Pattern 2: Network waits**
```typescript
// BEFORE
await page.waitForTimeout(1000);

// AFTER (already correct)
await page.waitForLoadState('networkidle');
```

**Pattern 3: State transitions**
```typescript
// BEFORE
await page.waitForTimeout(300);

// AFTER
await element.evaluate(el => el.classList.contains('active'));
```

## Found Instances (by file pattern)

### High Priority (20+ instances each)
- `accordion/accordion.author.spec.ts` - 13 instances
- `accordion-tabs-feature/accordion-tabs-feature.author.spec.ts` - 23 instances
- `accordion-tabs-feature/accordion-tabs-feature.interaction.spec.ts` - 12 instances

### Medium Priority (5-10 instances)
- Multiple matrix and interaction spec files

## Implementation Approach

### Phase 1: Audit (Low Risk)
1. Document which waits are for animations (safe to optimize)
2. Document which waits are for network (already using waitForLoadState)
3. Document which waits are unknown (need investigation)

### Phase 2: Optimize Animation Waits (Medium Risk)
1. Replace `waitForTimeout(200-500)` with element-based waits
2. Test thoroughly - animations must complete visibly
3. Potential savings: 15-20 seconds per test file

### Phase 3: Remove Unnecessary Waits (Medium Risk)
1. Identify waits that duplicate Playwright's auto-waiting
2. Remove them and run tests
3. Potential savings: 10-15 seconds per test file

## Estimated Impact

If all 276 explicit waits can be optimized:
- Average wait: 400ms
- Total wait time: 276 × 0.4s ≈ 110 seconds
- Full suite (2,634 tests): 110s × (2634/100) ≈ **29 minutes saved**
- **Potential reduction: 15-20% of total execution time**

## Action Items

- [ ] Audit files in `accordion/` directory (highest volume)
- [ ] Create template for safe wait replacement
- [ ] Test in staging before CI merge
- [ ] Document final patterns in CLAUDE.md

