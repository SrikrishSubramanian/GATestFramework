/**
 * AEM Test Helper
 *
 * Best practices for testing AEM components:
 * - Stable selectors (CMS-specific)
 * - AEM author/publish mode support
 * - Dialog/editing mode testing
 * - Component property validation
 * - CSS class verification
 * - Accessibility validation
 */

import { Page, Locator, expect } from '@playwright/test';

export interface AEMComponentConfig {
  componentPath: string; // e.g., /apps/company/components/button
  componentName: string; // e.g., 'button'
  cssClass: string; // e.g., 'cmp-button'
}

export interface AEMTestResult {
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

export class AEMTestHelper {
  private page: Page;
  private config: AEMComponentConfig;

  constructor(page: Page, config: AEMComponentConfig) {
    this.page = page;
    this.config = config;
  }

  /**
   * Best Practice #1: Use stable, semantic selectors
   * ✅ GOOD: data-testid, role attributes, CSS classes
   * ❌ BAD: XPath, nth-child, dynamic IDs
   */
  async getComponentByTestId(testId: string): Promise<Locator> {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Best Practice #2: Find component by CSS class (AEM standard)
   * All AEM components use: .cmp-{component-name}
   */
  async getComponentRoot(): Promise<Locator> {
    return this.page.locator(`.${this.config.cssClass}`);
  }

  /**
   * Best Practice #3: Verify component renders with proper DOM structure
   */
  async verifyComponentRenders(): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const component = await this.getComponentRoot();

      // Check element exists
      const count = await component.count();
      if (count === 0) {
        return {
          passed: false,
          message: `Component .${this.config.cssClass} not found in DOM`,
          duration: Date.now() - start
        };
      }

      // Check is visible
      const visible = await component.first().isVisible();
      if (!visible) {
        return {
          passed: false,
          message: `Component .${this.config.cssClass} exists but is not visible`,
          duration: Date.now() - start
        };
      }

      return {
        passed: true,
        message: `Component renders correctly (${count} instance${count > 1 ? 's' : ''})`,
        duration: Date.now() - start,
        details: { instanceCount: count }
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify component render: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #4: Verify BEM CSS naming convention
   * .cmp-{component}__element--modifier
   */
  async verifyCSSClasses(expectedClasses: string[]): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const component = await this.getComponentRoot();
      const classAttribute = await component.first().getAttribute('class');
      const classes = classAttribute?.split(' ') || [];

      const missing = expectedClasses.filter(c => !classes.includes(c));

      if (missing.length > 0) {
        return {
          passed: false,
          message: `Missing CSS classes: ${missing.join(', ')}`,
          duration: Date.now() - start,
          details: { expected: expectedClasses, found: classes, missing }
        };
      }

      return {
        passed: true,
        message: `All expected CSS classes present`,
        duration: Date.now() - start,
        details: { classes }
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify CSS classes: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #5: Test semantic HTML and accessibility
   * - Use proper HTML5 elements
   * - ARIA attributes where needed
   * - Proper heading hierarchy
   */
  async verifySemanticHTML(tagName: string): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const component = await this.getComponentRoot();
      const actualTag = await component.first().evaluate(el => el.tagName.toLowerCase());

      if (actualTag !== tagName.toLowerCase()) {
        return {
          passed: false,
          message: `Expected ${tagName} but found ${actualTag}`,
          duration: Date.now() - start,
          details: { expected: tagName, actual: actualTag }
        };
      }

      return {
        passed: true,
        message: `Correct semantic HTML element: <${actualTag}>`,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify semantic HTML: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #6: Test in AEM author mode (dialog editing)
   */
  async openComponentDialog(): Promise<boolean> {
    try {
      // Right-click on component in author mode
      const component = await this.getComponentRoot();
      await component.first().click({ button: 'right' });

      // Wait for context menu
      const contextMenu = this.page.locator('[role="menu"]');
      await contextMenu.waitFor({ state: 'visible', timeout: 3000 });

      return true;
    } catch (error) {
      console.log('Failed to open component dialog:', error);
      return false;
    }
  }

  /**
   * Best Practice #7: Verify component properties/authored data
   */
  async verifyComponentProperty(
    propertyName: string,
    expectedValue: string
  ): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      // In AEM, properties are stored in data attributes or HTML content
      const component = await this.getComponentRoot();
      const dataAttribute = await component.first().getAttribute(`data-${propertyName}`);
      const textContent = await component.first().textContent();

      const match =
        dataAttribute === expectedValue ||
        (textContent?.includes(expectedValue) ?? false);

      if (!match) {
        return {
          passed: false,
          message: `Property ${propertyName} does not match expected value`,
          duration: Date.now() - start,
          details: {
            property: propertyName,
            expected: expectedValue,
            found: dataAttribute || textContent
          }
        };
      }

      return {
        passed: true,
        message: `Property ${propertyName} verified`,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify property: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #8: Test component styling (light & dark themes)
   */
  async verifyComponentStyle(
    cssProperty: string,
    expectedValue: string
  ): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const component = await this.getComponentRoot();
      const computedStyle = await component.first().evaluate(
        (el, prop) => window.getComputedStyle(el as HTMLElement).getPropertyValue(prop),
        cssProperty
      );

      if (!computedStyle.includes(expectedValue)) {
        return {
          passed: false,
          message: `CSS property ${cssProperty} does not match`,
          duration: Date.now() - start,
          details: {
            property: cssProperty,
            expected: expectedValue,
            actual: computedStyle
          }
        };
      }

      return {
        passed: true,
        message: `CSS property ${cssProperty} verified`,
        duration: Date.now() - start,
        details: { value: computedStyle }
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify CSS style: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #9: Verify responsive design (all viewports)
   */
  async verifyResponsiveDesign(viewports: { name: string; width: number }[]): Promise<AEMTestResult[]> {
    const results: AEMTestResult[] = [];

    for (const viewport of viewports) {
      const start = Date.now();
      try {
        await this.page.setViewportSize({ width: viewport.width, height: 900 });
        await this.page.waitForLoadState('networkidle');

        const component = await this.getComponentRoot();
        const isVisible = await component.first().isVisible();

        results.push({
          passed: isVisible,
          message: isVisible
            ? `Component responsive at ${viewport.width}px`
            : `Component not visible at ${viewport.width}px`,
          duration: Date.now() - start,
          details: { viewport: viewport.name, width: viewport.width }
        });
      } catch (error) {
        results.push({
          passed: false,
          message: `Failed to test ${viewport.name}: ${error}`,
          duration: Date.now() - start,
          details: { viewport: viewport.name }
        });
      }
    }

    return results;
  }

  /**
   * Best Practice #10: No inline CSS/JS (AEM convention)
   */
  async verifyNoInlineStyles(): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const component = await this.getComponentRoot();
      const style = await component.first().getAttribute('style');

      if (style && style.trim().length > 0) {
        return {
          passed: false,
          message: 'Component has inline styles (violates AEM conventions)',
          duration: Date.now() - start,
          details: { inlineStyle: style }
        };
      }

      return {
        passed: true,
        message: 'No inline styles found (follows AEM best practice)',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify inline styles: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #11: Verify no HTL comments in published output
   */
  async verifyNoHTLComments(): Promise<AEMTestResult> {
    const start = Date.now();
    try {
      const htmlContent = await this.page.content();
      const hasHTLComments = htmlContent.includes('<!--/* ') || htmlContent.includes(' */-->');

      if (hasHTLComments) {
        return {
          passed: false,
          message: 'HTL comments found in published output (security risk)',
          duration: Date.now() - start
        };
      }

      return {
        passed: true,
        message: 'No HTL comments in published output',
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        passed: false,
        message: `Failed to verify HTL comments: ${error}`,
        duration: Date.now() - start
      };
    }
  }

  /**
   * Best Practice #12: Run comprehensive AEM component test
   */
  async runFullComponentTest(): Promise<AEMTestResult[]> {
    const results: AEMTestResult[] = [];

    // Test 1: Component renders
    results.push(await this.verifyComponentRenders());

    // Test 2: Proper CSS classes
    results.push(await this.verifyCSSClasses([this.config.cssClass]));

    // Test 3: No inline styles
    results.push(await this.verifyNoInlineStyles());

    // Test 4: No HTL comments
    results.push(await this.verifyNoHTLComments());

    return results;
  }

  /**
   * Generate AEM test report
   */
  generateReport(results: AEMTestResult[]): string {
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const passRate = ((passed / total) * 100).toFixed(1);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    let report = '\n';
    report += '╔════════════════════════════════════════════════════════════╗\n';
    report += '║             AEM COMPONENT TEST REPORT                      ║\n';
    report += '╚════════════════════════════════════════════════════════════╝\n';
    report += '\n';

    report += `📊 RESULTS: ${passed}/${total} passed (${passRate}%)\n`;
    report += `⏱️  Duration: ${totalDuration}ms\n`;
    report += '\n';

    results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      report += `${status} Test ${index + 1}: ${result.message}\n`;
      if (result.details) {
        report += `   Details: ${JSON.stringify(result.details)}\n`;
      }
    });

    report += '\n';

    return report;
  }
}

export default AEMTestHelper;
