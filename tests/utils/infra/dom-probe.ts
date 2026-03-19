import type { Page } from '@playwright/test';

/**
 * DOM Probe — inspects the live AEM DOM for CSS class names.
 *
 * Use this to discover actual rendered selectors for any component's
 * style guide page. Works with any GA component — pass the component
 * name (URL slug) and optional extra CSS selectors to query.
 *
 * Usage in a spec:
 *   const probe = new DomProbe(page);
 *   await probe.navigate('button');            // loads button style guide
 *   const sections = await probe.sections();   // section background classes
 *   const components = await probe.components('.button'); // wrapper classes
 */

export interface ProbeEntry {
  index: number;
  tag: string;
  className: string;
}

export interface ProbeResult {
  url: string;
  sections: ProbeEntry[];
  components: ProbeEntry[];
  /** Raw class lists keyed by selector */
  custom: Record<string, ProbeEntry[]>;
}

export class DomProbe {
  constructor(
    private page: Page,
    private baseUrl?: string,
  ) {}

  /** Navigate to a component's style guide page (wcmmode=disabled) */
  async navigate(component: string, baseUrl?: string): Promise<void> {
    const base = baseUrl ?? this.baseUrl ?? 'http://localhost:4502';
    const url = `${base}/content/global-atlantic/style-guide/components/${component}.html?wcmmode=disabled`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /** Discover section/background wrapper classes on the page */
  async sections(): Promise<ProbeEntry[]> {
    return this.page.evaluate(() => {
      const results: ProbeEntry[] = [];
      const els = document.querySelectorAll(
        '.section, [class*="cmp-section"], [class*="background"]',
      );
      els.forEach((el, i) => {
        results.push({ index: i, tag: el.tagName, className: el.className });
      });
      if (results.length === 0) {
        // Fallback: direct children of main or first container
        const main = document.querySelector('main');
        if (main) {
          const container =
            main.querySelector('.container, .responsivegrid, [class*="par"]') ?? main;
          Array.from(container.children).forEach((el, i) => {
            if (i < 80)
              results.push({ index: i, tag: el.tagName, className: el.className });
          });
        }
      }
      return results;
    });
  }

  /**
   * Discover component wrapper classes matching a CSS selector.
   * @param selector  e.g. '.button', '.statistic', '.feature-banner'
   * @param limit     max elements to return (default 30)
   */
  async components(selector: string, limit = 30): Promise<ProbeEntry[]> {
    return this.page.evaluate(
      ({ sel, max }) => {
        const results: ProbeEntry[] = [];
        document.querySelectorAll(sel).forEach((el, i) => {
          if (i < max) results.push({ index: i, tag: el.tagName, className: el.className });
        });
        return results;
      },
      { sel: selector, max: limit },
    );
  }

  /**
   * Run a full probe: sections + component wrappers + optional custom selectors.
   * @param componentSelector  wrapper selector, e.g. '.button'
   * @param extra              additional selectors to query
   */
  async probe(
    componentSelector: string,
    extra: string[] = [],
  ): Promise<ProbeResult> {
    const [secs, comps] = await Promise.all([
      this.sections(),
      this.components(componentSelector),
    ]);

    const custom: Record<string, ProbeEntry[]> = {};
    for (const sel of extra) {
      custom[sel] = await this.components(sel);
    }

    return {
      url: this.page.url(),
      sections: secs,
      components: comps,
      custom,
    };
  }

  /** Pretty-print probe results to console */
  static log(result: ProbeResult): void {
    console.log(`=== DOM PROBE: ${result.url} ===`);
    console.log('\n--- Sections ---');
    result.sections.forEach(e => console.log(`  [${e.index}] <${e.tag}> "${e.className}"`));
    console.log('\n--- Components ---');
    result.components.forEach(e => console.log(`  [${e.index}] <${e.tag}> "${e.className}"`));
    for (const [sel, entries] of Object.entries(result.custom)) {
      console.log(`\n--- ${sel} ---`);
      entries.forEach(e => console.log(`  [${e.index}] <${e.tag}> "${e.className}"`));
    }
  }
}
