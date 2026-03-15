/**
 * One-time utility: Generate HTML test summaries for all existing component spec directories.
 * Usage: npx playwright test tests/generators/generate-html-summaries.ts --project chromium --workers 1
 */
import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { generateHTMLSummaryFromSpecs, SummaryMetadata } from '../utils/generation/html-summary-writer';

const GA_SPECS_DIR = path.resolve(__dirname, '../specFiles/ga');

test('Generate HTML summaries for all components', async () => {
  const components = fs.readdirSync(GA_SPECS_DIR).filter(f =>
    fs.statSync(path.join(GA_SPECS_DIR, f)).isDirectory()
  );

  for (const component of components) {
    const compDir = path.join(GA_SPECS_DIR, component);
    const specFiles = fs.readdirSync(compDir).filter(f => f.endsWith('.spec.ts'));
    if (specFiles.length === 0) continue;

    // Build metadata from .meta.json if available
    const meta: SummaryMetadata = {
      component,
      displayName: component.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      specFiles: [],
    };

    const metaFiles = fs.readdirSync(compDir).filter(f => f.endsWith('.meta.json'));
    const jiraTickets = new Set<string>();
    const figmaLinks: { label: string; url: string }[] = [];
    const sources = new Set<string>();

    for (const mf of metaFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(compDir, mf), 'utf-8'));
        if (content.jiraId) jiraTickets.add(content.jiraId);
        if (content.figmaLink) figmaLinks.push({ label: 'Open Design', url: content.figmaLink });
        if (content.testName) {
          meta.description = content.testName;
          sources.add(`CSV: ${content.testName}`);
        }
      } catch { /* skip */ }
    }

    if (jiraTickets.size > 0) meta.jiraTickets = [...jiraTickets];
    if (figmaLinks.length > 0) meta.figmaLinks = figmaLinks;
    if (sources.size > 0) meta.sources = [...sources];

    // Detect sources from spec file names
    for (const sf of specFiles) {
      if (sf.includes('.author.')) sources.add('DOM scan + framework categories');
      if (sf.includes('.interaction.')) sources.add('Interaction generator');
      if (sf.includes('.matrix.')) sources.add('State matrix generator');
      if (sf.includes('.visual.')) sources.add('Visual assertion generator');
      if (sf.includes('.images.')) sources.add('Image health generator');
    }
    meta.sources = [...sources];

    const outputPath = generateHTMLSummaryFromSpecs(compDir, meta);
    console.log(`Generated: ${outputPath} (${specFiles.length} spec files)`);
  }
});
