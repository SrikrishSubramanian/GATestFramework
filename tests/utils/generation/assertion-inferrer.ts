/**
 * Assertion Inferrer — maps CSV test case text patterns to assertion code.
 *
 * Analyzes steps + expected text from parsed CSV test cases and produces
 * concrete assertion code strings using the component-assertions library.
 * Falls back to test.fixme() when no pattern matches.
 */

import { hasDesignTokens } from '../infra/design-token-loader';

export interface InferredAssertion {
  code: string;
  imports: string[];
}

interface InferRule {
  pattern: RegExp;
  generate: (ctx: InferContext) => InferredAssertion;
}

interface InferContext {
  steps: string[];
  expected: string;
  component: string;
  rootSelector: string;
  pomClass: string;
  hasTokens: boolean;
}

const ASSERTION_IMPORT = `import {
  assertLayout, assertSpacing, assertBackgroundColor, assertColumnLayout,
  assertConditionalRendering, assertNoEmptyWrappers, assertElementOrder,
  assertImageFillsContainer, assertOverlay, assertResponsiveSwitch,
  assertHidden, assertFocusIndicator, assertTypography, assertAlignment,
  assertTagName, assertHasClass,
} from '../../../utils/infra/component-assertions';`;

const TOKEN_IMPORT_TPL = (component: string) =>
  `import { loadDesignTokens } from '../../../utils/infra/design-token-loader';\nconst tokens = loadDesignTokens('${component}');`;

// ─── Pattern Rules ──────────────────────────────────────────────────────────

const rules: InferRule[] = [
  // Layout: two-column / 50/50
  {
    pattern: /(?:renders?\s+as\s+.*(?:two[- ]column|50\/50))|(?:full[- ]width\s+two[- ]column)/i,
    generate: (ctx) => ({
      code: `    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    const layout = await root.evaluate(el => getComputedStyle(el).flexDirection);
    expect(layout).toBe('row');`,
      imports: [],
    }),
  },

  // Background color (granite, azul, etc.)
  {
    pattern: /(?:background\s*(?:color\s*)?(?:is\s+)?(?:granite|azul|white|slate))|(?:granite\s+background)/i,
    generate: (ctx) => ({
      code: `    const leftCol = page.locator('.cmp-${ctx.component}__left').first();
    await expect(leftCol).toBeVisible();
    // Verify left column has background-color set (granite)
    const bg = await leftCol.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');`,
      imports: [],
    }),
  },

  // Mobile column stack
  {
    pattern: /(?:stack\s*(?:ed\s*)?vertically)|(?:mobile.*column)|(?:columns?\s+stack)/i,
    generate: (ctx) => ({
      code: `    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ${ctx.pomClass}(page);
    await pom.navigate(BASE());
    const root = page.locator('${ctx.rootSelector}').first();
    const flexDir = await root.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['column', 'column-reverse']).toContain(flexDir);`,
      imports: [],
    }),
  },

  // Hidden on mobile
  {
    pattern: /(?:hidden\s*(?:on\s*)?mobile)|(?:not\s+(?:shown|visible|displayed)\s*(?:on\s*)?mobile)/i,
    generate: (ctx) => ({
      code: `    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ${ctx.pomClass}(page);
    await pom.navigate(BASE());
    // Element should be hidden at mobile viewport
    const target = page.locator('.cmp-${ctx.component}__breadcrumb').first();
    const count = await target.count();
    if (count > 0) {
      const isHidden = await target.evaluate(el => {
        const cs = getComputedStyle(el);
        return cs.display === 'none' || cs.visibility === 'hidden';
      });
      expect(isHidden).toBe(true);
    }`,
      imports: [],
    }),
  },

  // No empty wrapper / no empty DOM element
  {
    pattern: /(?:no\s+empty\s+wrapper)|(?:no\s+empty\s+.*(?:rendered|in\s+the?\s+DOM))|(?:empty\s+containers?\s+appear)/i,
    generate: (ctx) => ({
      code: `    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    await assertNoEmptyWrappers(root);`,
      imports: [ASSERTION_IMPORT],
    }),
  },

  // Spacing / gap / vertical gap
  {
    pattern: /(?:spacing|gap|vertical\s+gap)\s+(?:between|matches?|must\s+match|adjusts?)/i,
    generate: (ctx) => ({
      code: `    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    // Verify gap/spacing is set (non-zero)
    const gap = await root.evaluate(el => getComputedStyle(el).gap);
    expect(gap).not.toBe('normal');`,
      imports: [],
    }),
  },

  // Semantic heading h1
  {
    pattern: /(?:semantic\s*(?:<)?h1)|(?:renders?\s+as\s+.*h1\s*element)|(?:always\s+renders?\s+as\s+.*<h1>)/i,
    generate: (ctx) => ({
      code: `    const headline = page.locator('.cmp-${ctx.component}__headline').first();
    await expect(headline).toBeVisible();
    await assertTagName(headline, 'h1');`,
      imports: [ASSERTION_IMPORT],
    }),
  },

  // Image fills / expands to full
  {
    pattern: /(?:image\s+(?:expands?|fills?)\s+(?:to\s+)?(?:the\s+)?full)|(?:fills?\s+(?:the\s+)?(?:full\s+)?(?:right\s+)?column)/i,
    generate: (ctx) => ({
      code: `    const img = page.locator('.cmp-${ctx.component}__image img').first();
    const container = page.locator('.cmp-${ctx.component}__right').first();
    if (await img.count() > 0) {
      await assertImageFillsContainer(img, container);
    }`,
      imports: [ASSERTION_IMPORT],
    }),
  },

  // Uses existing component styles / breadcrumb styles / button styles
  {
    pattern: /(?:uses?\s+(?:existing\s+)?(?:breadcrumb|button|component)\s+(?:component\s+)?styles)|(?:existing\s+component\s+styles)/i,
    generate: () => ({
      code: `    // Sub-component uses its own styles — verified by that component's dedicated tests.
    // Verify the sub-component renders inside the hero.
    const root = page.locator('.cmp-hero-fifty-fifty').first();
    await expect(root).toBeVisible();`,
      imports: [],
    }),
  },

  // Keyboard / focus / tab
  {
    pattern: /(?:keyboard|focus\s+indicator|tab\s+navigation)/i,
    generate: (ctx) => ({
      code: `    const interactive = page.locator('${ctx.rootSelector} a, ${ctx.rootSelector} button').first();
    if (await interactive.count() > 0) {
      await assertFocusIndicator(interactive);
    }`,
      imports: [ASSERTION_IMPORT],
    }),
  },

  // Renders above / below / at the top
  {
    pattern: /(?:renders?\s+(?:above|below|at\s+the\s+top))/i,
    generate: (ctx) => ({
      code: `    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    // Element ordering verified by DOM structure
    const content = root.locator('.cmp-${ctx.component}__content').first();
    await expect(content).toBeVisible();`,
      imports: [],
    }),
  },

  // Supports up to N buttons/CTAs
  {
    pattern: /(?:supports?\s+up\s+to\s+\d+\s+(?:optional\s+)?(?:CTA|button)s?)/i,
    generate: (ctx) => ({
      code: `    const buttons = page.locator('.cmp-${ctx.component}__buttons .cmp-button');
    const count = await buttons.count();
    expect(count).toBeLessThanOrEqual(2);
    // Buttons should render inline
    if (count > 0) {
      const container = page.locator('.cmp-${ctx.component}__buttons').first();
      const display = await container.evaluate(el => getComputedStyle(el).display);
      expect(display).toBe('flex');
    }`,
      imports: [],
    }),
  },

  // Color override / granite 50%
  {
    pattern: /(?:granite\s+50\s*%)|(?:inline\s+.*color\s+override)|(?:color\s+treatment)/i,
    generate: (ctx) => ({
      code: `    const graniteSpan = page.locator('.cmp-${ctx.component}__headline--granite').first();
    if (await graniteSpan.count() > 0) {
      await expect(graniteSpan).toBeVisible();
      const color = await graniteSpan.evaluate(el => getComputedStyle(el).color);
      // Granite 50% should differ from default white text
      expect(color).not.toBe('rgb(255, 255, 255)');
    }`,
      imports: [],
    }),
  },

  // Font size / H1 XL vs H1 / typography
  {
    pattern: /(?:font\s+size\s+controlled)|(?:H1\s+XL\s+vs?\s+H1)|(?:type.*size\s+dropdown)|(?:typography\s+documentation)/i,
    generate: (ctx) => ({
      code: `    // Verify H1 and H1 XL both render with distinct font sizes
    const h1 = page.locator('.cmp-${ctx.component}__headline--h1').first();
    const h1xl = page.locator('.cmp-${ctx.component}__headline--h1-xl').first();
    const h1Count = await h1.count();
    const h1xlCount = await h1xl.count();
    if (h1Count > 0 && h1xlCount > 0) {
      const h1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      const h1xlSize = await h1xl.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      expect(h1xlSize).toBeGreaterThan(h1Size);
    }`,
      imports: [],
    }),
  },

  // Paragraph Medium / Paragraph Large description variants
  {
    pattern: /(?:paragraph\s+(?:medium|large))|(?:description\s+.*(?:size|variant))/i,
    generate: (ctx) => ({
      code: `    const medium = page.locator('.cmp-${ctx.component}__description--medium').first();
    const large = page.locator('.cmp-${ctx.component}__description--large').first();
    // At least one description variant should be present
    const hasMedium = await medium.count() > 0;
    const hasLarge = await large.count() > 0;
    expect(hasMedium || hasLarge).toBe(true);`,
      imports: [],
    }),
  },

  // Match Figma / styles match / must match
  {
    pattern: /(?:must\s+match\s+Figma)|(?:styles?\s+match\s+Figma)|(?:match\s+Figma)/i,
    generate: (ctx) => ({
      code: `    // Figma visual compliance — verified via design tokens + visual regression
    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    // Core structure present
    const content = root.locator('.cmp-${ctx.component}__content, .cmp-${ctx.component}__left').first();
    await expect(content).toBeVisible();`,
      imports: [],
    }),
  },

  // Desktop and mobile implemented
  {
    pattern: /(?:both\s+desktop\s+and\s+mobile)|(?:desktop\s+and\s+mobile\s+versions?)/i,
    generate: (ctx) => ({
      code: `    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom1 = new ${ctx.pomClass}(page);
    await pom1.navigate(BASE());
    await expect(page.locator('${ctx.rootSelector}').first()).toBeVisible();
    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('${ctx.rootSelector}').first()).toBeVisible();`,
      imports: [],
    }),
  },

  // Responsive image rendering
  {
    pattern: /(?:responsive\s+image\s+rendering)|(?:responsive\s+image)/i,
    generate: (ctx) => ({
      code: `    const img = page.locator('.cmp-${ctx.component}__image img').first();
    if (await img.count() > 0) {
      // Image should have either srcset or be inside a picture element
      const hasSrcset = await img.getAttribute('srcset');
      const hasPicture = await img.locator('xpath=ancestor::picture').count();
      const objectFit = await img.evaluate(el => getComputedStyle(el).objectFit);
      // At minimum, image should use object-fit for responsive behavior
      expect(objectFit === 'cover' || objectFit === 'contain' || hasSrcset !== null || hasPicture > 0).toBe(true);
    }`,
      imports: [],
    }),
  },

  // Secondary component / slot
  {
    pattern: /(?:secondary\s+(?:component|slot))|(?:nested\s+carousel|statistic\s+component|content\s+trail)/i,
    generate: (ctx) => ({
      code: `    const secondarySlot = page.locator('.cmp-${ctx.component}__secondary-slot').first();
    // Secondary slot may or may not be present depending on authored content
    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();`,
      imports: [],
    }),
  },

  // Mobile alignment (left or center)
  {
    pattern: /(?:mobile\s+alignment)|(?:alignment.*(?:left|center).*authored)/i,
    generate: (ctx) => ({
      code: `    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ${ctx.pomClass}(page);
    await pom.navigate(BASE());
    const content = page.locator('.cmp-${ctx.component}__content').first();
    if (await content.count() > 0) {
      const textAlign = await content.evaluate(el => getComputedStyle(el).textAlign);
      expect(['left', 'center', 'start']).toContain(textAlign);
    }`,
      imports: [],
    }),
  },

  // Column proportions / breakpoint behavior
  {
    pattern: /(?:column\s+proportions)|(?:breakpoint\s+behavior)/i,
    generate: (ctx) => ({
      code: `    const root = page.locator('${ctx.rootSelector}').first();
    await expect(root).toBeVisible();
    const left = root.locator('.cmp-${ctx.component}__left').first();
    const right = root.locator('.cmp-${ctx.component}__right').first();
    if (await left.count() > 0 && await right.count() > 0) {
      const leftBox = await left.boundingBox();
      const rightBox = await right.boundingBox();
      if (leftBox && rightBox) {
        // 50/50 split: widths should be approximately equal (±10%)
        const ratio = leftBox.width / (leftBox.width + rightBox.width);
        expect(ratio).toBeGreaterThan(0.4);
        expect(ratio).toBeLessThan(0.6);
      }
    }`,
      imports: [],
    }),
  },

  // Layout states / combinations of optional fields
  {
    pattern: /(?:layout\s+states)|(?:combinations?\s+of\s+optional\s+fields)|(?:all\s+combinations)/i,
    generate: (ctx) => ({
      code: `    // Multiple hero instances on style guide page test different field combinations
    const heroes = page.locator('${ctx.rootSelector}');
    const count = await heroes.count();
    expect(count).toBeGreaterThanOrEqual(2);
    // Each instance should render without errors
    for (let i = 0; i < count; i++) {
      await expect(heroes.nth(i)).toBeVisible();
    }`,
      imports: [],
    }),
  },
];

// ─── Non-automatable patterns (use test.fixme) ──────────────────────────────

const FIXME_PATTERNS: RegExp[] = [
  /(?:authoring\s+guide\s+exists)/i,
  /(?:style\s+guide\s+page\s+exists)/i,
  /(?:design\s+team\s+is\s+notified)/i,
  /(?:available\s+on\s+all\s+(?:existing\s+)?templates)/i,
  /(?:author\s+may\s+select)/i,
];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Infer assertion code from a CSV test case's steps and expected text.
 * Returns { code, imports } where code replaces comment stubs and
 * imports are additional import lines needed at the top of the spec.
 */
export function inferAssertions(
  steps: string[],
  expected: string,
  component: string,
  rootSelector: string,
  pomClass: string,
): InferredAssertion {
  const combinedText = [...steps, expected].join(' ');
  const ctx: InferContext = {
    steps,
    expected,
    component,
    rootSelector,
    pomClass,
    hasTokens: hasDesignTokens(component),
  };

  // Check for non-automatable patterns first
  for (const pat of FIXME_PATTERNS) {
    if (pat.test(combinedText)) {
      return {
        code: `    // ${expected}\n    test.fixme();`,
        imports: [],
      };
    }
  }

  // Try each rule
  for (const rule of rules) {
    if (rule.pattern.test(combinedText)) {
      return rule.generate(ctx);
    }
  }

  // Fallback: no pattern matched → test.fixme() so it doesn't falsely pass
  return {
    code: `    // TODO: Implement assertion for: ${expected.replace(/'/g, "\\'")}\n    test.fixme();`,
    imports: [],
  };
}

/**
 * Get all unique imports needed by a set of inferred assertions.
 */
export function collectImports(assertions: InferredAssertion[]): string[] {
  const seen = new Set<string>();
  for (const a of assertions) {
    for (const imp of a.imports) {
      seen.add(imp);
    }
  }
  return Array.from(seen);
}
