import { Page } from '@playwright/test';

export interface CapturedConsoleEntry {
  type: 'error' | 'warning' | 'pageerror' | 'response-error';
  message: string;
  url?: string;
  timestamp: string;
}

/**
 * Captures browser console errors, page errors, and failed network responses.
 * Attach to a page in beforeEach, then check entries in afterEach or assertions.
 *
 * Usage:
 *   const capture = new ConsoleCapture(page);
 *   capture.start();
 *   // ... run test ...
 *   const errors = capture.getErrors();
 *   expect(errors).toEqual([]);
 *   capture.stop();
 */
export class ConsoleCapture {
  private entries: CapturedConsoleEntry[] = [];
  private page: Page;
  private consoleHandler: ((msg: any) => void) | null = null;
  private pageErrorHandler: ((error: Error) => void) | null = null;
  private responseHandler: ((response: any) => void) | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  start(): void {
    this.entries = [];

    this.consoleHandler = (msg) => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        this.entries.push({
          type: type === 'error' ? 'error' : 'warning',
          message: msg.text(),
          url: this.page.url(),
          timestamp: new Date().toISOString(),
        });
      }
    };

    this.pageErrorHandler = (error: Error) => {
      this.entries.push({
        type: 'pageerror',
        message: error.message,
        url: this.page.url(),
        timestamp: new Date().toISOString(),
      });
    };

    this.responseHandler = (response: any) => {
      const status = response.status();
      if (status >= 400) {
        this.entries.push({
          type: 'response-error',
          message: `HTTP ${status}: ${response.url()}`,
          url: response.url(),
          timestamp: new Date().toISOString(),
        });
      }
    };

    this.page.on('console', this.consoleHandler);
    this.page.on('pageerror', this.pageErrorHandler);
    this.page.on('response', this.responseHandler);
  }

  stop(): void {
    if (this.consoleHandler) {
      this.page.removeListener('console', this.consoleHandler);
    }
    if (this.pageErrorHandler) {
      this.page.removeListener('pageerror', this.pageErrorHandler);
    }
    if (this.responseHandler) {
      this.page.removeListener('response', this.responseHandler);
    }
  }

  /** Get all captured entries */
  getAll(): CapturedConsoleEntry[] {
    return [...this.entries];
  }

  /** Get only errors (console errors + page errors) */
  getErrors(): CapturedConsoleEntry[] {
    return this.entries.filter(e => e.type === 'error' || e.type === 'pageerror');
  }

  /** Get failed HTTP responses (4xx/5xx) */
  getResponseErrors(): CapturedConsoleEntry[] {
    return this.entries.filter(e => e.type === 'response-error');
  }

  /** Get warnings */
  getWarnings(): CapturedConsoleEntry[] {
    return this.entries.filter(e => e.type === 'warning');
  }

  /** Check if any JS errors occurred */
  hasErrors(): boolean {
    return this.getErrors().length > 0;
  }

  /** Format entries as a string for report attachment */
  formatForReport(): string {
    if (this.entries.length === 0) return 'No console issues captured.';
    return this.entries
      .map(e => `[${e.type}] ${e.message}`)
      .join('\n');
  }

  /** Reset captured entries */
  clear(): void {
    this.entries = [];
  }
}
