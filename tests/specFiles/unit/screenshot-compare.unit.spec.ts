import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  getBaselineDir,
  getBaselinePath,
  captureBaseline,
  baselineExists,
} from '../../utils/infra/screenshot-compare';

const TEST_COMPONENT = '_test_screenshot_temp';
const TEST_ENV = 'test';

test.describe('Screenshot Compare — Unit Tests', () => {
  test.afterAll(() => {
    // Clean up temp baselines
    const dir = getBaselineDir(TEST_COMPONENT, TEST_ENV);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(f => fs.unlinkSync(path.join(dir, f)));
      fs.rmdirSync(dir);
      // Clean parent if empty
      const parent = path.dirname(dir);
      try { fs.rmdirSync(parent); } catch { /* not empty */ }
    }
  });

  test('getBaselineDir returns correct path structure', () => {
    const dir = getBaselineDir('button', 'qa');
    expect(dir).toContain('baselines');
    expect(dir).toContain('button');
    expect(dir).toContain('qa');
  });

  test('getBaselinePath returns png path', () => {
    const p = getBaselinePath('button', 'primary', 'local');
    expect(p).toMatch(/primary\.png$/);
    expect(p).toContain('button');
    expect(p).toContain('local');
  });

  test('getBaselineDir uses local as default env', () => {
    const dir = getBaselineDir('section');
    expect(dir).toContain('local');
  });

  test('baselineExists returns false for non-existent baseline', () => {
    expect(baselineExists('nonexistent-component', 'screenshot', 'noenv')).toBe(false);
  });

  test('captureBaseline saves screenshot to disk', async ({ page }) => {
    await page.setContent(`
      <div style="width:200px;height:100px;background:blue;color:white;padding:20px;">
        Test Component
      </div>
    `);

    const filePath = await captureBaseline(page, 'div', {
      component: TEST_COMPONENT,
      name: 'test-capture',
      env: TEST_ENV,
    });

    expect(fs.existsSync(filePath)).toBe(true);
    expect(filePath).toMatch(/\.png$/);

    // Verify it's actually a PNG (starts with PNG magic bytes)
    const buffer = fs.readFileSync(filePath);
    expect(buffer.length).toBeGreaterThan(100);
    // PNG magic: 137 80 78 71
    expect(buffer[0]).toBe(137);
    expect(buffer[1]).toBe(80);
  });

  test('baselineExists returns true after capture', async ({ page }) => {
    await page.setContent('<div style="width:50px;height:50px;background:red;">X</div>');
    await captureBaseline(page, 'div', {
      component: TEST_COMPONENT,
      name: 'exists-check',
      env: TEST_ENV,
    });
    expect(baselineExists(TEST_COMPONENT, 'exists-check', TEST_ENV)).toBe(true);
  });
});
