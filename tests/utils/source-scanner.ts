import * as fs from 'fs';
import * as path from 'path';
import { LocatorStrategy } from './locator-registry';

/**
 * Source-based component data extracted from kkr-aem repo.
 * Used as fallback when live DOM is not available.
 */
export interface SourceComponentData {
  component: string;
  source: 'kkr-aem';
  htlTemplate?: string;
  dialogFields: string[];
  lessClasses: string[];
  styleIds: Record<string, string>;
  resourceSuperType?: string;
  slingResourceType?: string;
}

/**
 * Element inferred from source code analysis.
 */
export interface InferredElement {
  name: string;
  tag: string;
  cssSelector: string;
  inferredFrom: 'htl' | 'less' | 'dialog' | 'policy';
  isInteractive: boolean;
}

/**
 * Scan a component from kkr-aem source files.
 * Reads HTL template, dialog XML, LESS, and policy XML to infer DOM structure.
 *
 * @param componentName - e.g., 'button', 'section', 'homepage-hero'
 * @param kkrAemRoot - path to kkr-aem repo root
 */
export function scanSource(componentName: string, kkrAemRoot: string): SourceComponentData {
  const data: SourceComponentData = {
    component: componentName,
    source: 'kkr-aem',
    dialogFields: [],
    lessClasses: [],
    styleIds: {},
  };

  // 1. Read GA component overlay .content.xml
  const gaComponentPath = path.join(
    kkrAemRoot,
    'ui.apps.ga/src/main/content/jcr_root/apps/ga/components/content',
    componentName,
    '.content.xml'
  );
  if (fs.existsSync(gaComponentPath)) {
    const xml = fs.readFileSync(gaComponentPath, 'utf-8');
    const superTypeMatch = xml.match(/sling:resourceSuperType="([^"]+)"/);
    if (superTypeMatch) {
      data.resourceSuperType = superTypeMatch[1];
    }
    const resTypeMatch = xml.match(/sling:resourceType="([^"]+)"/);
    if (resTypeMatch) {
      data.slingResourceType = resTypeMatch[1];
    }
  }

  // 2. Read HTL template
  const htlPaths = [
    // GA overlay HTL
    path.join(kkrAemRoot, 'ui.apps.ga/src/main/content/jcr_root/apps/ga/components/content', componentName, `${componentName}.html`),
    // Base HTL
    path.join(kkrAemRoot, 'ui.apps/src/main/content/jcr_root/apps/kkr-aem-base/components/content', componentName, `${componentName}.html`),
  ];
  for (const htlPath of htlPaths) {
    if (fs.existsSync(htlPath)) {
      data.htlTemplate = fs.readFileSync(htlPath, 'utf-8');
      break;
    }
  }

  // 3. Read dialog XML for field names
  const dialogPaths = [
    path.join(kkrAemRoot, 'ui.apps.ga/src/main/content/jcr_root/apps/ga/components/content', componentName, '_cq_dialog/.content.xml'),
    path.join(kkrAemRoot, 'ui.apps/src/main/content/jcr_root/apps/kkr-aem-base/components/content', componentName, '_cq_dialog/.content.xml'),
  ];
  for (const dialogPath of dialogPaths) {
    if (fs.existsSync(dialogPath)) {
      const xml = fs.readFileSync(dialogPath, 'utf-8');
      data.dialogFields = extractDialogFields(xml);
      break;
    }
  }

  // 4. Read LESS file for CSS classes
  const lessPath = path.join(
    kkrAemRoot,
    'ui.apps.ga/src/main/content/jcr_root/apps/ga/clientlibs/clientlib-site/less/components',
    `${componentName}.less`
  );
  if (fs.existsSync(lessPath)) {
    const less = fs.readFileSync(lessPath, 'utf-8');
    data.lessClasses = extractLessClasses(less);
  }

  // 5. Read style system policy for style IDs
  const policyDir = path.join(
    kkrAemRoot,
    'ui.content.ga/src/main/content/jcr_root/conf/global-atlantic/settings/wcm/policies'
  );
  if (fs.existsSync(policyDir)) {
    data.styleIds = findStyleIds(policyDir, componentName);
  }

  return data;
}

/**
 * Extract dialog field names from _cq_dialog XML.
 */
function extractDialogFields(xml: string): string[] {
  const fields: string[] = [];
  // Match name="./fieldName" patterns
  const nameRegex = /name="\.\/([\w]+)"/g;
  let match;
  while ((match = nameRegex.exec(xml)) !== null) {
    fields.push(match[1]);
  }
  return fields;
}

/**
 * Extract CSS class selectors from LESS source.
 */
function extractLessClasses(less: string): string[] {
  const classes = new Set<string>();
  // Match .class-name patterns (not inside comments)
  const classRegex = /\.(ga-[\w-]+|[\w]+-[\w-]+)/g;
  let match;
  while ((match = classRegex.exec(less)) !== null) {
    classes.add(`.${match[1]}`);
  }
  return Array.from(classes);
}

/**
 * Find style IDs from policy XML files.
 */
function findStyleIds(policyDir: string, componentName: string): Record<string, string> {
  const styleIds: Record<string, string> = {};

  function searchDir(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        searchDir(fullPath);
      } else if (entry.name === '.content.xml') {
        const xml = fs.readFileSync(fullPath, 'utf-8');
        if (xml.includes(componentName)) {
          // Extract cq:styleId and class name pairs
          const styleIdRegex = /cq:styleId="(\d+)"[^>]*cq:styleClasses="([^"]+)"/g;
          let m;
          while ((m = styleIdRegex.exec(xml)) !== null) {
            styleIds[m[2]] = m[1];
          }
          // Also try reverse order
          const reverseRegex = /cq:styleClasses="([^"]+)"[^>]*cq:styleId="(\d+)"/g;
          while ((m = reverseRegex.exec(xml)) !== null) {
            styleIds[m[1]] = m[2];
          }
        }
      }
    }
  }

  searchDir(policyDir);
  return styleIds;
}

/**
 * Infer DOM elements from source data.
 * Used when live DOM scanning is not available.
 */
export function inferElementsFromSource(data: SourceComponentData): InferredElement[] {
  const elements: InferredElement[] = [];

  // From HTL template — extract data-sly-test, data-sly-use, and common HTML tags
  if (data.htlTemplate) {
    const htl = data.htlTemplate;

    // Find links
    const linkRegex = /<a[^>]*class="([^"]*)"[^>]*>/g;
    let match;
    while ((match = linkRegex.exec(htl)) !== null) {
      const classes = match[1];
      const name = classesToName(classes, 'link');
      elements.push({
        name,
        tag: 'a',
        cssSelector: `.${classes.split(/\s+/).join('.')}`,
        inferredFrom: 'htl',
        isInteractive: true,
      });
    }

    // Find buttons
    const btnRegex = /<button[^>]*class="([^"]*)"[^>]*>/g;
    while ((match = btnRegex.exec(htl)) !== null) {
      const classes = match[1];
      elements.push({
        name: classesToName(classes, 'button'),
        tag: 'button',
        cssSelector: `.${classes.split(/\s+/).join('.')}`,
        inferredFrom: 'htl',
        isInteractive: true,
      });
    }

    // Find images
    const imgRegex = /<img[^>]*class="([^"]*)"[^>]*>/g;
    while ((match = imgRegex.exec(htl)) !== null) {
      elements.push({
        name: classesToName(match[1], 'image'),
        tag: 'img',
        cssSelector: `.${match[1].split(/\s+/).join('.')}`,
        inferredFrom: 'htl',
        isInteractive: false,
      });
    }

    // Find headings
    const headingRegex = /<(h[1-6])[^>]*class="([^"]*)"[^>]*>/g;
    while ((match = headingRegex.exec(htl)) !== null) {
      elements.push({
        name: classesToName(match[2], match[1]),
        tag: match[1],
        cssSelector: `.${match[2].split(/\s+/).join('.')}`,
        inferredFrom: 'htl',
        isInteractive: false,
      });
    }
  }

  // From LESS — component root and key sub-elements
  if (data.lessClasses.length > 0) {
    const rootClass = data.lessClasses.find(c => c.startsWith(`.ga-${data.component}`));
    if (rootClass) {
      elements.push({
        name: 'componentRoot',
        tag: 'div',
        cssSelector: rootClass,
        inferredFrom: 'less',
        isInteractive: false,
      });
    }
  }

  // From dialog — each field implies a rendered property
  for (const field of data.dialogFields) {
    elements.push({
      name: `dialog_${field}`,
      tag: 'input',
      cssSelector: `[name="./${field}"]`,
      inferredFrom: 'dialog',
      isInteractive: true,
    });
  }

  return elements;
}

/**
 * Generate locator strategies from source-inferred elements.
 */
export function sourceElementToStrategies(element: InferredElement): LocatorStrategy[] {
  const strategies: LocatorStrategy[] = [];

  if (element.cssSelector) {
    strategies.push({ type: 'css', value: element.cssSelector, confidence: 0.7 });
  }

  // XPath from tag + class
  if (element.cssSelector.startsWith('.')) {
    const className = element.cssSelector.slice(1).split('.')[0];
    strategies.push({
      type: 'xpath',
      value: `//${element.tag}[contains(@class,'${className}')]`,
      confidence: 0.5,
    });
  }

  return strategies;
}

function classesToName(classes: string, prefix: string): string {
  const main = classes.split(/\s+/)
    .filter(c => c.startsWith('ga-') || !c.includes('-'))
    .join('_')
    .replace(/[^a-zA-Z0-9_]/g, '') || prefix;
  return `${prefix}_${main}`.replace(/_+/g, '_').replace(/_$/, '');
}
