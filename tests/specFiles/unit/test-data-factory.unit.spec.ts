import { test, expect } from '@playwright/test';
import { TestDataFactory } from '../../utils/infra/test-data-factory';

test.describe('TestDataFactory — Unit Tests', () => {
  test.beforeEach(() => {
    TestDataFactory.reset();
  });

  test('email generates unique addresses', () => {
    const e1 = TestDataFactory.email();
    const e2 = TestDataFactory.email();
    expect(e1).not.toBe(e2);
    expect(e1).toContain('@');
    expect(e1).toMatch(/^testuser\+/);
  });

  test('email accepts custom prefix', () => {
    const e = TestDataFactory.email('admin');
    expect(e).toMatch(/^admin\+/);
  });

  test('fullName returns first, last, and full', () => {
    const name = TestDataFactory.fullName();
    expect(name.first).toBeTruthy();
    expect(name.last).toBeTruthy();
    expect(name.full).toBe(`${name.first} ${name.last}`);
  });

  test('phone returns US format', () => {
    const phone = TestDataFactory.phone();
    expect(phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
  });

  test('date returns MM/DD/YYYY format', () => {
    const date = TestDataFactory.date();
    expect(date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test('date respects year range', () => {
    const date = TestDataFactory.date(2000, 2010);
    const year = parseInt(date.split('/')[2]);
    expect(year).toBeGreaterThanOrEqual(2000);
    expect(year).toBeLessThan(2010);
  });

  test('zipCode returns 5-digit string', () => {
    const zip = TestDataFactory.zipCode();
    expect(zip).toMatch(/^\d{5}$/);
  });

  test('address returns a street address', () => {
    const addr = TestDataFactory.address();
    expect(addr).toBeTruthy();
    expect(addr).toMatch(/^\d+\s+\w+/);
  });

  test('formData subscribe returns required fields', () => {
    const data = TestDataFactory.formData('subscribe');
    expect(data.firstName).toBeTruthy();
    expect(data.lastName).toBeTruthy();
    expect(data.email).toContain('@');
    expect(data.zipCode).toMatch(/^\d{5}$/);
  });

  test('formData contact returns required fields', () => {
    const data = TestDataFactory.formData('contact');
    expect(data.firstName).toBeTruthy();
    expect(data.lastName).toBeTruthy();
    expect(data.email).toContain('@');
    expect(data.phone).toMatch(/^\(\d{3}\)/);
    expect(data.message).toBeTruthy();
  });

  test('formData login returns username and password', () => {
    const data = TestDataFactory.formData('login');
    expect(data.username).toContain('@');
    expect(data.password).toBeTruthy();
    expect(data.password.length).toBeGreaterThan(5);
  });

  test('batch generates N items', () => {
    const batch = TestDataFactory.batch('subscribe', 5);
    expect(batch).toHaveLength(5);
    // All should be unique emails
    const emails = batch.map(d => d.email);
    expect(new Set(emails).size).toBe(5);
  });

  test('reset makes output deterministic', () => {
    TestDataFactory.reset();
    const a1 = TestDataFactory.fullName();
    const a2 = TestDataFactory.email();

    TestDataFactory.reset();
    const b1 = TestDataFactory.fullName();
    const b2 = TestDataFactory.email();

    expect(a1.first).toBe(b1.first);
    expect(a1.last).toBe(b1.last);
    // Emails won't be identical due to Date.now() in them, but prefix pattern matches
    expect(a2.split('+')[0]).toBe(b2.split('+')[0]);
  });
});
