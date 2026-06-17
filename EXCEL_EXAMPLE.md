# Excel Report Examples

## What You'll See in the Failed Tests Sheet

### Example 1: Element Not Found Failure
```
Test ID      : FT-0001
Test Name    : should render button with correct text
Component    : button
Test Path    : GA Button Component > button.author > should render button with correct text
Status       : FAILED (red background)
Primary Error: Locator('#btn-primary') did not match any elements in the DOM at 12 ms
Assertion    : Element Not Found
Expected     : Primary button element to be visible
Actual       : No elements matched the locator
Location     : tests/specFiles/ga/button/button.author.spec.ts:45
Stack Trace  : Error: Locator('#btn-primary') did not match...
Remediation  : 1. Verify locator CSS is correct
               2. Check if element is in DOM
               3. Wait for page to load
               4. Check for hidden/off-screen elements
Duration     : 2500 ms
Browser      : chromium
Retries      : 2
Screenshot   : Yes (view in HTML report)
Report Link  : View
```

---

### Example 2: Timeout Error
```
Test ID      : FT-0042
Test Name    : should handle form submission
Component    : form-container
Test Path    : GA Form Container > form-container.author > should handle form submission
Status       : TIMEDOUT (orange background)
Primary Error: Timeout 30000ms exceeded while waiting for navigation
Assertion    : Timeout - Element or action did not complete
Expected     : Page should navigate to success page
Actual       : Still on same page after 30 seconds
Location     : tests/specFiles/ga/form-container/form-container.author.spec.ts:128
Stack Trace  : TimeoutError: Timeout 30000ms exceeded...
Remediation  : 1. Check network/server response time
               2. Verify API endpoints are working
               3. Check form validation rules
               4. Increase timeout if needed
Duration     : 30000 ms
Browser      : webkit
Retries      : 1
Screenshot   : Yes
Report Link  : View
```

---

### Example 3: Value Assertion Failure
```
Test ID      : FT-0089
Test Name    : should display correct statistics
Component    : statistic
Test Path    : GA Statistic > statistic.author > should display correct statistics
Status       : FAILED (red background)
Primary Error: Expected "5,000+" to equal "5000+"
Assertion    : Value Assertion Failed
Expected     : "5000+" (formatted with thousands separator)
Actual       : "5,000+" (different formatting)
Location     : tests/specFiles/ga/statistic/statistic.author.spec.ts:67
Stack Trace  : AssertionError: expected "5,000+"...
Remediation  : 1. Verify formatting in component
               2. Check locale/international settings
               3. Update test expectation if correct
Duration     : 1200 ms
Browser      : Mobile-Chrome
Retries      : 0
Screenshot   : Yes
Report Link  : View
```

---

## Summary Sheet Examples

```
Summary Statistics
===================

Metric                          | Count
Total Failed Tests              | 487
  └─ Failed                     | 420
  └─ Timed Out                  | 67

By Component (Top 10)
  └─ form-container             | 145
  └─ nested-content-carousel    | 98
  └─ statistic                  | 76
  └─ button                     | 54
  └─ feature-banner             | 42
  └─ hero-fifty-fifty           | 28
  └─ login                      | 22
  └─ footer                     | 12
  └─ navigation                 | 8
  └─ breadcrumb                 | 2

By Browser Project
  └─ chromium                   | 245
  └─ webkit                     | 154
  └─ Mobile-Chrome              | 76
  └─ Mobile-Safari              | 12
```

---

## Color Coding in Excel

| Color | Meaning |
|-------|---------|
| **Red Cell** | Status = FAILED |
| **Orange Cell** | Status = TIMEDOUT |
| **Yellow Cell** | Primary Error message (always highlighted) |
| **Light Gray** | Alternating row background for readability |
| **Blue Link** | Click "View" link to open test in HTML report |

---

## How to Use This Information

### 1. **Prioritize Fixes**
- Sort by component count
- Fix form-container issues first (145 failures)
- This will reduce total failures the most

### 2. **Identify Pattern Issues**
- Check if all failures for "statistic" are the same error
- If yes: one fix resolves multiple failures
- If no: multiple different issues to debug

### 3. **Investigate By Browser**
- 245 failures in chromium (desktop)
- 76 failures in Mobile-Chrome
- Maybe CSS not responsive? Check media queries

### 4. **Use Remediation Steps**
- Excel automatically suggests fixes
- Don't just see "Element Not Found"
- See the exact steps to fix it

### 5. **View Screenshots**
- Most failures have screenshots
- Click HTML report link to see what actually happened
- Compare with expected behavior

---

## Excel Navigation Tips

1. **Sort by Duration**: Find the slowest failing tests (potential timeout issues)
2. **Filter by Remediation**: Copy common remediation steps and create tickets
3. **Group by Error Type**: "Element Not Found" appears how many times?
4. **Export Component List**: Get unique list of affected components for stakeholders
5. **Create Dashboard**: Use Summary sheet data for management reporting

---

## Next Steps After Analyzing Excel

1. **Open HTML Report**
   - Click "View" link for any failed test
   - See screenshot of what happened
   - Check browser console for errors
   - Review test logs and traces

2. **Open Test File**
   - Use Failure Location path
   - Review the assertion that failed
   - Check if test expectation is correct
   - Verify locators are up-to-date

3. **Fix & Re-run**
   - Update locators/selectors if changed
   - Fix test data if outdated
   - Adjust timeout if legitimate
   - Re-run with: `npx playwright test <component> --workers 6`

4. **Extract Report Again**
   - Run: `node scripts/extract-failed-tests.js`
   - Verify failures are resolved
   - Send updated Excel to team
