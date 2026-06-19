import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { DomProbe } from '../../../../tests/utils/infra/dom-probe';
import ENV from '../../../../tests/utils/infra/env';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test('probe teaser-card style guide DOM', async ({ page }) => {
  await loginToAEMAuthor(page);

  const probe = new DomProbe(page);
  await probe.navigate('teaser-card', BASE());

  // 1. All outer wrapper modifier combos
  const wrappers = await probe.components('.teaser-card', 100);
  console.log('\n=== OUTER WRAPPERS (.teaser-card) — ALL ===');
  const uniqueClasses = [...new Set(wrappers.map(e => e.className))];
  uniqueClasses.forEach(c => console.log(' ', c));

  // 2. Is the inner .cmp-teaser-card ever a <div> (no-CTA variant)?
  const innerTags = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
    const els = document.querySelectorAll('.cmp-teaser-card');
    const tags: string[] = [];
    els.forEach(el => {
      if (!tags.includes(el.tagName)) tags.push(el.tagName);
    });

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});
    return tags;
  });
  console.log('\n=== .cmp-teaser-card tag types ===', innerTags);

  // 3. All unique child BEM element class names
  const children = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
    const results: string[] = [];
    document.querySelectorAll('[class*="cmp-teaser-card__"]').forEach(el => {
      const cls = el.getAttribute('class') ?? '';
      const bemClasses = cls.split(' ').filter(c => c.includes('cmp-teaser-card__'));
      bemClasses.forEach(c => { if (!results.includes(c)) results.push(c); });
    });
    return results.sort();
  });
  console.log('\n=== BEM child elements ===');
  children.forEach(c => console.log(' ', c));

  // 4. Title element tag
  const titleTags = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => {
    const tags: string[] = [];
    document.querySelectorAll('.cmp-teaser-card__title').forEach(el => {
      if (!tags.includes(el.tagName)) tags.push(el.tagName);
    });
    return tags;
  });
  console.log('\n=== .cmp-teaser-card__title tag types ===', titleTags);

  DomProbe.log(await probe.probe('.teaser-card', []));
});
