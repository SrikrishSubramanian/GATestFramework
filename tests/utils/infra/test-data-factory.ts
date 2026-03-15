/**
 * Pure TypeScript test data generator — no external dependencies.
 * Generates realistic but deterministic test data for form testing.
 */

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Lisa', 'Matthew', 'Nancy',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
];

const DOMAINS = ['example.com', 'test.org', 'sample.net', 'demo.io'];
const AREA_CODES = ['212', '310', '312', '415', '617', '702', '713', '818', '917', '305'];

let counter = 0;

export class TestDataFactory {
  /** Generate a unique email address */
  static email(prefix = 'testuser'): string {
    counter++;
    const domain = DOMAINS[counter % DOMAINS.length];
    return `${prefix}+${Date.now()}-${counter}@${domain}`;
  }

  /** Generate a random full name */
  static fullName(): { first: string; last: string; full: string } {
    const first = FIRST_NAMES[counter++ % FIRST_NAMES.length];
    const last = LAST_NAMES[counter % LAST_NAMES.length];
    return { first, last, full: `${first} ${last}` };
  }

  /** Generate a US phone number */
  static phone(): string {
    const area = AREA_CODES[counter++ % AREA_CODES.length];
    const mid = String(100 + (counter % 900)).padStart(3, '0');
    const end = String(1000 + (counter % 9000)).padStart(4, '0');
    return `(${area}) ${mid}-${end}`;
  }

  /** Generate a date string in MM/DD/YYYY format */
  static date(minYear = 1950, maxYear = 2005): string {
    counter++;
    const year = minYear + (counter % (maxYear - minYear));
    const month = 1 + (counter % 12);
    const day = 1 + (counter % 28);
    return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
  }

  /** Generate a 5-digit US zip code */
  static zipCode(): string {
    counter++;
    return String(10000 + (counter % 90000));
  }

  /** Generate a street address */
  static address(): string {
    counter++;
    const num = 100 + (counter % 9900);
    const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Park Blvd', 'First St', 'Elm Rd'];
    return `${num} ${streets[counter % streets.length]}`;
  }

  /** Generate composite form data for common form types */
  static formData(type: 'subscribe' | 'contact' | 'login'): Record<string, string> {
    const name = TestDataFactory.fullName();

    switch (type) {
      case 'subscribe':
        return {
          firstName: name.first,
          lastName: name.last,
          email: TestDataFactory.email('subscribe'),
          zipCode: TestDataFactory.zipCode(),
        };
      case 'contact':
        return {
          firstName: name.first,
          lastName: name.last,
          email: TestDataFactory.email('contact'),
          phone: TestDataFactory.phone(),
          message: `Test inquiry from ${name.full} at ${new Date().toISOString()}`,
        };
      case 'login':
        return {
          username: TestDataFactory.email('user'),
          password: `Test${counter}Pass!`,
        };
      default:
        return { email: TestDataFactory.email() };
    }
  }

  /** Generate an array of form data for parametric testing */
  static batch(type: 'subscribe' | 'contact' | 'login', count: number): Record<string, string>[] {
    return Array.from({ length: count }, () => TestDataFactory.formData(type));
  }

  /** Reset counter for deterministic test runs */
  static reset(): void {
    counter = 0;
  }
}
