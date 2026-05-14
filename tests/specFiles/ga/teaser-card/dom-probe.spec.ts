import { test } from '@playwright/test';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { DomProbe } from '../../../utils/infra/dom-probe';
import ENV from '../../../utils/infra/env';

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
  const innerTags = await page.evaluate(() => {
    const els = document.querySelectorAll('.cmp-teaser-card');
    const tags: string[] = [];
    els.forEach(el => {
      if (!tags.includes(el.tagName)) tags.push(el.tagName);
    });
    return tags;
  });
  console.log('\n=== .cmp-teaser-card tag types ===', innerTags);

  // 3. All unique child BEM element class names
  const children = await page.evaluate(() => {
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
  const titleTags = await page.evaluate(() => {
    const tags: string[] = [];
    document.querySelectorAll('.cmp-teaser-card__title').forEach(el => {
      if (!tags.includes(el.tagName)) tags.push(el.tagName);
    });
    return tags;
  });
  console.log('\n=== .cmp-teaser-card__title tag types ===', titleTags);

  DomProbe.log(await probe.probe('.teaser-card', []));
});
