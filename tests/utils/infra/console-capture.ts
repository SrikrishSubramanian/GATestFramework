import { Page } from '@playwright/test';

export interface CapturedConsoleEntry {
  type: 'error' | 'warning' | 'pageerror' | 'response-error';
  message: string;
  url?: string;
  timestamp: string;
}

/**
 * Browser-native / third-party AEM author-overlay noise unrelated to component behavior
 * (Firefox rejecting analytics cookies on the author domain, Adobe Experience Platform /
 * Universal Editor scripts racing document.body during domcontentloaded, etc). Excluded from
 * getErrors() so "no JS errors" assertions aren't polluted by environment noise.
 */
const BENIGN_ERROR_PATTERNS: RegExp[] = [
  /has been rejected for invalid domain/i,
  /document\.body is null/i,
  /MutationObserver\.observe: Argument 1 is not an object/i,
  /^The operation was aborted\.?\s*$/i,
  /Failed to fetch dynamically imported module: https:\/\/exc-unifiedcontent\.experience\.adobe\.net/i,
];

/** Shared benign-noise check — also used by specs that capture `pageerror` inline instead of via ConsoleCapture. */
export function isBenignError(message: string): boolean {
  return BENIGN_ERROR_PATTERNS.some(p => p.test(message));
}

/**
 * URL patterns whose errors can never be attributable to the component under test — e.g. the
 * AEM Start console shell a test transiently sits on right after login, before its own navigate().
 */
const BENIGN_ERROR_URL_PATTERNS: RegExp[] = [
  /\/ui#\/aem\//i,
];

function isFromBenignUrl(url: string | undefined): boolean {
  return !!url && BENIGN_ERROR_URL_PATTERNS.some(p => p.test(url));
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

  /** Get only errors (console errors + page errors), excluding known-benign browser noise */
  getErrors(): CapturedConsoleEntry[] {
    return this.entries.filter(e =>
      (e.type === 'error' || e.type === 'pageerror') && !isBenignError(e.message) && !isFromBenignUrl(e.url)
    );
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
