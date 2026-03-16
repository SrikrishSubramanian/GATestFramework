import { test, expect } from '@playwright/test';
import ENV from '../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(`${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('Content-Driven Validation', () => {
test('@regression Content: button: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_1758013441: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_1758013441: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_260826422: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_260826422: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_868168118: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_868168118: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_copy: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_copy: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1094401951: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1094401951: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2093465727: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2093465727: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_756798446: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_756798446: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1521946648: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1521946648: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_488695210: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_488695210: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2051062303: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2051062303: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1342993852: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1342993852: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1517643101: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1517643101: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1628232848: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1628232848: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_729917626: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_729917626: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2097205224: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_2097205224: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1409086153: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1409086153: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_845323341: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_845323341: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_655178607: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_655178607: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1557786842: missing required property "linkURL"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkURL"}
    // Verify this issue is handled correctly
  });

test('@regression Content: button_copy_26082642_1557786842: missing required property "linkText"', async ({ page }) => {
    // Issue type: missing-property
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\button\.content.xml
    // Details: {"resourceType":"ga/components/content/button","property":"linkText"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy_249442947.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy_c.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy_c_2003914106.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy_c_1509132237.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: content_trail_copy_1521364670.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\content-trail\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_one.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_three.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_four.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_five.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_six.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_seven.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: feature_banner_eight.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\feature-banner\.content.xml
    // Details: {"property":"linkDestination","value":"/content/ga/style-guide"}
    // Verify this issue is handled correctly
  });

test('@negative Content: root.linkDestination: internal link may be missing .html extension', async ({ page }) => {
    // Issue type: broken-link
    // Path: C:\Users\SrikrishSubramanian\Downloads\workspace\kkr-aem\ui.content.ga\src\main\content\jcr_root\content\global-atlantic\style-guide\components\image-with-nested-content\.content.xml
    // Details: {"property":"linkDestination","value":"/content/global-atlantic/style-guide/components/content-trail"}
    // Verify this issue is handled correctly
  });
});
