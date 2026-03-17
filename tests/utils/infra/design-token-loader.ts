import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DesignTokenLayout {
  desktop?: { columns?: number; direction?: string; columnRatio?: string };
  mobile?: { columns?: number; direction?: string };
}

export interface DesignTokenSpacing {
  desktop?: string;
  mobile?: string;
}

export interface DesignTokenTypography {
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  color?: string;
}

export interface DesignTokenColumn {
  backgroundColor?: string;
  padding?: DesignTokenSpacing;
  verticalGap?: DesignTokenSpacing;
  alignment?: Record<string, string>;
}

export interface DesignTokens {
  component: string;
  figmaUrl?: string;
  tokens: {
    layout?: DesignTokenLayout;
    leftColumn?: DesignTokenColumn;
    rightColumn?: {
      image?: { objectFit?: string; fillsContainer?: boolean };
      secondaryOverlay?: boolean;
    };
    typography?: Record<string, Record<string, DesignTokenTypography>>;
    breadcrumb?: { hiddenOnMobile?: boolean; usesOwnStyles?: boolean };
    cta?: { maxCount?: number; layout?: string; usesButtonStyles?: boolean };
    [key: string]: unknown;
  };
}

const TOKENS_DIR = path.resolve(__dirname, '..', '..', 'data', 'design-tokens');

/**
 * Load design tokens for a component.
 * Returns the parsed DesignTokens or null if no token file exists.
 */
export function loadDesignTokens(component: string): DesignTokens | null {
  const filePath = path.join(TOKENS_DIR, `${component}.tokens.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as DesignTokens;
}

/**
 * Check if design tokens exist for a component.
 */
export function hasDesignTokens(component: string): boolean {
  return fs.existsSync(path.join(TOKENS_DIR, `${component}.tokens.json`));
}
