# Content Fixture Deployment Guide

## Overview

The GA test automation framework generates **14 content fixture files** that contain test data for the AEM style guide pages. These fixtures must be deployed to AEM for the Playwright tests to pass.

## Why Content Fixtures Are Needed

- **Components are deployed** ✅ (`/apps/ga/components/...`)
- **Tests are generated** ✅ (2,318 tests in `tests/specFiles/ga/`)
- **Style guide pages need content** ❌ (component instances missing from pages)

Tests fail with "element(s) not found" because the style guide pages don't contain component instances. Once fixtures are deployed, tests will find the required components.

## Content Fixtures Ready for Deployment

### Fixture Files Location
```
tests/specFiles/ga/<component>/content-fixtures/<component>-fixtures.xml
```

### All 14 Fixtures

1. **Accordion** — `tests/specFiles/ga/accordion/content-fixtures/accordion-fixtures.xml`
2. **Accordion Tabs Feature** — `tests/specFiles/ga/accordion-tabs-feature/content-fixtures/accordion-tabs-feature-fixtures.xml`
3. **Button** — `tests/specFiles/ga/button/content-fixtures/button-fixtures.xml`
4. **Content Trail** — `tests/specFiles/ga/content-trail/content-fixtures/content-trail-fixtures.xml`
5. **Feature Banner** — `tests/specFiles/ga/feature-banner/content-fixtures/feature-banner-fixtures.xml`
6. **Form Options** — `tests/specFiles/ga/form-options/content-fixtures/form-options-fixtures.xml`
7. **Form Text** — `tests/specFiles/ga/form-text/content-fixtures/form-text-fixtures.xml`
8. **Headline Block** — `tests/specFiles/ga/headline-block/content-fixtures/headline-block-fixtures.xml`
9. **Hero Fifty-Fifty** — `tests/specFiles/ga/hero-fifty-fifty/content-fixtures/hero-fifty-fifty-fixtures.xml`
10. **Navigation** — `tests/specFiles/ga/navigation/content-fixtures/navigation-fixtures.xml`
11. **Rate Table** — `tests/specFiles/ga/rate-table/content-fixtures/rate-table-fixtures.xml`
12. **Spacer** — `tests/specFiles/ga/spacer/content-fixtures/spacer-fixtures.xml`
13. **Statistic** — `tests/specFiles/ga/statistic/content-fixtures/statistic-fixtures.xml`
14. **Text** — `tests/specFiles/ga/text/content-fixtures/text-fixtures.xml`

## Fixture File Structure

Each fixture is a JCR XML file containing:
- Full page structure (`cq:Page`)
- Component instances (e.g., `cmp-accordion`, `cmp-button`)
- Property values and configurations
- Multiple variations (light background, dark background, etc.)

**Example from accordion-fixtures.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          jcr:primaryType="cq:Page">
    <jcr:content jcr:primaryType="cq:PageContent"
                 jcr:title="Accordion"
                 sling:resourceType="ga/components/structure/page/basepage">
        <!-- Component instances here -->
    </jcr:content>
</jcr:root>
```

## Deployment Options

### Option 1: Manual AEM UI Import (Recommended for first-time)

1. **Open AEM Package Manager**
   - Navigate to: `http://localhost:4502/crx/packmgr/`
   - Login: `admin` / `admin`

2. **Create Package**
   - Click "Create Package"
   - Name: `ga-content-fixtures`
   - Group: `GA Test Fixtures`

3. **Add Files**
   - Click "Edit" → "Add Files"
   - Select all 14 fixture XML files from `tests/specFiles/ga/*/content-fixtures/`
   - Target path in package: `/content/global-atlantic/style-guide/`

4. **Build and Install**
   - Click "Build"
   - Click "Install"
   - Wait for completion

### Option 2: Programmatic REST API Upload (Advanced)

Use this script to deploy fixtures via AEM's REST API:

```bash
#!/bin/bash
AEM_URL="http://localhost:4502"
AEM_USER="admin"
AEM_PASS="admin"

for fixture in tests/specFiles/ga/*/content-fixtures/*-fixtures.xml; do
    component=$(basename $(dirname $(dirname "$fixture")))
    echo "Deploying $component..."
    
    curl -u "$AEM_USER:$AEM_PASS" \
        -X POST \
        -F "file=@$fixture" \
        -F "name=$component-fixtures.xml" \
        "$AEM_URL/crx/packmgr/service.jsp"
done
```

### Option 3: Direct Repository Import (Fastest, requires AEM knowledge)

1. Stop AEM
2. Place fixture files in: `crx-quickstart/repository/` directory structure
3. Restart AEM
4. AEM will auto-import on startup

## Verification After Deployment

### Check if Content is Deployed

```bash
# List deployed content nodes
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json | jq '.children[]'

# Verify specific component page
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide/accordion.json
```

### Expected Response

```json
{
  "jcr:primaryType": "cq:Page",
  "jcr:title": "Accordion",
  "children": [
    {
      "jcr:primaryType": "nt:unstructured",
      "sling:resourceType": "ga/components/content/accordion"
    }
  ]
}
```

## Testing After Deployment

Once fixtures are deployed, re-run the tests:

```bash
# Run specific component tests
env=local npx playwright test tests/specFiles/ga/accordion/ --project chromium

# Run all GA tests
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4

# Expected result: ✅ Tests pass (or fail with specific component issues, not "element not found")
```

## Troubleshooting

### Issue: Tests still show "element(s) not found"

**Solution:** Verify fixture deployment
```bash
curl -u admin:admin http://localhost:4502/content/global-atlantic/style-guide.json | grep -i "accordion"
```

If no results, fixtures weren't deployed. Check AEM logs:
```
GA_AEM_CODE/aem-sdk-.../crx-quickstart/logs/error.log
```

### Issue: HTTP 500 when uploading fixtures

**Solution:** Check AEM instance requirements:
- AEM must be fully started (`crx-quickstart/logs/stdout.log` shows "Startup completed")
- Admin user credentials must be correct
- Sufficient disk space in `crx-quickstart/repository/`

### Issue: "Cannot create node" error

**Solution:** Parent path may not exist
- Create `/content/global-atlantic/` manually first via AEM UI
- Or use Option 3 (direct repository import)

## Timeline Estimate

| Approach | Time |
|----------|------|
| Manual UI (Option 1) | 10-15 minutes |
| REST API Script (Option 2) | 15-20 minutes |
| Direct Import (Option 3) | 2-3 minutes (+ AEM restart) |

## Next Steps After Deployment

1. **Verify content**: Use curl commands above to confirm deployment
2. **Re-run tests**: Execute test suite to validate
3. **Analyze results**: Check for test pass rate increase
4. **Generate report**: Run final test report generation

---

## Support

For detailed instructions or issues, refer to:
- AEM documentation: `https://experienceleague.adobe.com/`
- GA component docs: `repo-overview.md`
- Test framework guide: `CLAUDE.md`
