import { Page } from '@playwright/test';

/**
 * Describes a parent-child interaction context for testing.
 */
export interface InteractionContext {
  parent: {
    component: string;
    rootSelector: string;
    background: BackgroundType;
    classes: string[];
  };
  child: {
    component: string;
    rootSelector: string;
    expectedTheme: 'light-theme' | 'dark-theme';
    classes: string[];
  };
}

export type BackgroundType = 'white' | 'slate' | 'granite' | 'azul' | 'primary' | 'ink' | 'charcoal' | 'aubergine' | 'unknown';

/**
 * Background classification: dark vs light.
 */
const DARK_BACKGROUNDS: BackgroundType[] = ['granite', 'azul', 'primary', 'ink', 'charcoal', 'aubergine'];
const LIGHT_BACKGROUNDS: BackgroundType[] = ['white', 'slate'];

/**
 * Known container components with hardcoded backgrounds.
 */
const HARDCODED_CONTAINERS: Record<string, BackgroundType> = {
  'footer-banner': 'azul',
  'ga-brand-relationship': 'aubergine',
};

/**
 * Detect parent-child component interactions on a page.
 * Returns interaction contexts for generating context-aware tests.
 */
export async function detectInteractions(
  page: Page,
  componentSelector: string
): Promise<InteractionContext[]> {
  const interactions = await page.evaluate(
    ({ selector, darkBgs, lightBgs, hardcoded }: { selector: string; darkBgs: string[]; lightBgs: string[]; hardcoded: Record<string, string> }) => {
      const results: any[] = [];
      const components = document.querySelectorAll(selector);

      components.forEach(component => {
        // Walk up the DOM to find parent container
        let parent = component.parentElement;
        while (parent && parent !== document.body) {
          const parentClasses = Array.from(parent.classList);

          // Check for section with background
          const isSectionLike = parentClasses.some(c =>
            c.includes('section') || c.includes('container') || c.includes('wrapper')
          );
          const isHardcodedContainer = Object.keys(hardcoded).some(cls =>
            parentClasses.some(c => c.includes(cls))
          );

          if (isSectionLike || isHardcodedContainer) {
            // Detect background
            let background = 'unknown';

            // Check hardcoded containers first
            for (const [cls, bg] of Object.entries(hardcoded)) {
              if (parentClasses.some(c => c.includes(cls))) {
                background = bg;
                break;
              }
            }

            // Check style-system background classes
            if (background === 'unknown') {
              for (const cls of parentClasses) {
                if (cls.startsWith('background-')) {
                  background = cls.replace('background-', '');
                  break;
                }
              }
            }

            const isDark = darkBgs.includes(background);
            const isLight = lightBgs.includes(background);

            results.push({
              parent: {
                component: parent.getAttribute('data-component') || guessComponent(parentClasses),
                rootSelector: classesToSelector(parentClasses),
                background,
                classes: parentClasses,
              },
              child: {
                component: component.getAttribute('data-component') || guessComponent(Array.from(component.classList)),
                rootSelector: classesToSelector(Array.from(component.classList)),
                expectedTheme: isDark ? 'light-theme' : 'dark-theme',
                classes: Array.from(component.classList),
              },
            });
            break; // Only report first (nearest) parent
          }
          parent = parent.parentElement;
        }
      });

      function guessComponent(classes: string[]): string {
        const gaClass = classes.find(c => c.startsWith('ga-'));
        return gaClass ? gaClass.replace('ga-', '') : classes[0] || 'unknown';
      }

      function classesToSelector(classes: string[]): string {
        const relevant = classes.filter(c => c.startsWith('ga-') || c.startsWith('background-'));
        return relevant.length > 0 ? `.${relevant.join('.')}` : `.${classes[0] || 'unknown'}`;
      }

      return results;
    },
    {
      selector: componentSelector,
      darkBgs: DARK_BACKGROUNDS,
      lightBgs: LIGHT_BACKGROUNDS,
      hardcoded: HARDCODED_CONTAINERS,
    }
  );

  return interactions as InteractionContext[];
}

/**
 * Check if a background is classified as dark.
 */
export function isDarkBackground(bg: BackgroundType): boolean {
  return DARK_BACKGROUNDS.includes(bg);
}

/**
 * Check if a background is classified as light.
 */
export function isLightBackground(bg: BackgroundType): boolean {
  return LIGHT_BACKGROUNDS.includes(bg);
}

/**
 * Generate expected theme for a child component inside a parent background.
 */
export function getExpectedChildTheme(parentBackground: BackgroundType): 'light-theme' | 'dark-theme' {
  return isDarkBackground(parentBackground) ? 'light-theme' : 'dark-theme';
}

/**
 * Get all known background variants for the section component.
 */
export function getSectionBackgrounds(): BackgroundType[] {
  return ['white', 'slate', 'granite', 'azul'];
}

/**
 * Get all hardcoded container backgrounds.
 */
export function getHardcodedContainers(): Record<string, BackgroundType> {
  return { ...HARDCODED_CONTAINERS };
}
