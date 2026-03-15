/* This file includes the compareExtractedWithMaster function, which extracts comparison details and compares them with master files.
It also manages broken link testing, with results saved in the result/compare folder. It is used in typography-execute.ts utils file. */

import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs'; // Use fsPromises for async operations
import { checkBrokenLinks } from './brokenLinksUtils'
import { extractFontDetailsWithHighlightCompare, extractImageDetailsCompare } from '../utils/typography-compare';
import { getPage } from '../../src/utils/page-utils';
import { attachFileToReport } from '../utils/reportAttach'

type Detail = {
  id: string;
  tag: string;
  class: string;
  width?: number;
  height?: number;
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  padding?: string;
  lineHeight?: string;
  fontWeight?: string;
};

type DifferenceValue = {
  extracted: string | number | undefined;
  reference: string | number | undefined;
};

type Differences = {
  width?: DifferenceValue;
  height?: DifferenceValue;
  fontFamily?: DifferenceValue;
  fontSize?: DifferenceValue;
  fontStyle?: DifferenceValue;
  padding?: DifferenceValue;
  lineHeight?: DifferenceValue;
  fontWeight?: DifferenceValue;
};

type ComparisonResult = {
  summary: {
    totalExtracted: number;
    totalMatched: number;
    totalMismatched: number;
  };
  matchedResults: Detail[];
  unmatchedResults: (Detail & { differences?: Differences[]; comment?: string })[];
  screenshotPath: string;
  jsonPath: string;
};

function getFormattedTimestamp(): string {
  const now = new Date();
  // Format time to 12-hour and include AM/PM, then replace colons with dashes
  let formattedTime = now.toLocaleTimeString('en-GB', { hour12: true }).replace(/:/g, '-');
  // Convert AM/PM to lowercase
  formattedTime = formattedTime.replace(' AM', '-am').replace(' PM', '-pm');

  const formattedDate = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // Format date
  return `${formattedTime}_${formattedDate}`;
}


function formatUrlForFileName(url: string): string {
  // Remove 'https://' and 'aem-'
  const cleanedUrl = url.replace('https://', '').replace('aem-', '');

  // Replace unsafe characters with underscores
  return cleanedUrl.replace(/[:/\\?%*|"<>]/g, '.');
}

function createComparisonKey(tag: string, className: string): string {
  // Normalize class names by splitting into words, removing known dynamic classes, and sorting
  const normalizedClasses = className.split(' ').filter(c => c !== 'active' && c !== 'sticky-header--down').sort();
  return `${tag}:${normalizedClasses.join(' ')}`;
}



export async function compareExtractedWithMaster(page: Page, referenceJsonPath: string): Promise<ComparisonResult | null> {

  const fontDetails = await extractFontDetailsWithHighlightCompare(page);
  const imageDetails = await extractImageDetailsCompare(page);
  const allDetails: Detail[] = [...fontDetails, ...imageDetails];

  allDetails.sort((a, b) => a.tag.localeCompare(b.tag) || a.class.localeCompare(b.class));

  let referenceData: Detail[] = [];

  if (fs.existsSync(referenceJsonPath)) {
    const fileContent = fs.readFileSync(referenceJsonPath, 'utf-8');
    referenceData = JSON.parse(fileContent);
  } else {
    console.error('Reference file not found:', referenceJsonPath);
    return null;
  }

  const referenceMap = new Map<string, Detail[]>();
  referenceData.forEach((item) => {
    const key = createComparisonKey(item.tag, item.class);
    if (!referenceMap.has(key)) {
      referenceMap.set(key, []);
    }
    referenceMap.get(key)!.push(item);
  });

  const matchedResults: Detail[] = [];
  const unmatchedResults: (Detail & { differences?: Differences[]; comment?: string })[] = [];

  allDetails.forEach((detail) => {
    const key = createComparisonKey(detail.tag, detail.class);
    const referenceDetails = referenceMap.get(key) || [];

    let matched = false;
    const uniqueDifferences = new Set<string>();

    for (const referenceDetail of referenceDetails) {

      const differences: Differences = {};

      if (detail.tag === 'img') {
        const widthDiff = Math.abs((detail.width ?? 0) - (referenceDetail.width ?? 0));
        const heightDiff = Math.abs((detail.height ?? 0) - (referenceDetail.height ?? 0));

        if (widthDiff > 5) {
          differences.width = { extracted: detail.width, reference: referenceDetail.width };
        }

        if (heightDiff > 5) {
          differences.height = { extracted: detail.height, reference: referenceDetail.height };
        }
      } else {
        if (detail.fontFamily !== referenceDetail.fontFamily) {
          differences.fontFamily = { extracted: detail.fontFamily, reference: referenceDetail.fontFamily };
        }
        if (detail.fontSize !== referenceDetail.fontSize) {
          differences.fontSize = { extracted: detail.fontSize, reference: referenceDetail.fontSize };
        }
        if (detail.fontStyle !== referenceDetail.fontStyle) {
          differences.fontStyle = { extracted: detail.fontStyle, reference: referenceDetail.fontStyle };
        }
        const extractNumeric = (value: string | undefined): number => {
          if (!value) return 0;
          const match = value.match(/^(\d+)(px)?$/);
          return match ? parseInt(match[1]) : 0;
        };

        const extractedPadding = extractNumeric(detail.padding);
        const referencePadding = extractNumeric(referenceDetail.padding);

        if (Math.abs(extractedPadding - referencePadding) > 5) {
          differences.padding = {
            extracted: detail.padding,
            reference: referenceDetail.padding,
          };
        }
        if (detail.lineHeight !== referenceDetail.lineHeight) {
          differences.lineHeight = { extracted: detail.lineHeight, reference: referenceDetail.lineHeight };
        }
        if (detail.fontWeight !== referenceDetail.fontWeight) {
          differences.fontWeight = { extracted: detail.fontWeight, reference: referenceDetail.fontWeight };
        }
      }

      if (Object.keys(differences).length === 0) {
        matched = true;
        matchedResults.push(detail);
        break;
      } else {
        uniqueDifferences.add(JSON.stringify(differences));
      }
    }

    if (!matched) {
      const uniqueDifferencesArray: Differences[] = Array.from(uniqueDifferences).map((item) => JSON.parse(item));
      unmatchedResults.push({ ...detail, differences: uniqueDifferencesArray });
    }
  });

  if (allDetails.length < referenceData.length) {
    const extractedKeys = new Set(allDetails.map(detail => createComparisonKey(detail.tag, detail.class)));
    referenceData.forEach(referenceDetail => {
      const key = createComparisonKey(referenceDetail.tag, referenceDetail.class);
      if (!extractedKeys.has(key)) {
        unmatchedResults.push({ ...referenceDetail, comment: 'Not extracted from comparison URL' });
      }
    });
  }

  const rootDir = process.cwd();
  const currentUrl = await page.url();
  const timestamp = getFormattedTimestamp();
  const safeFolderName = `${formatUrlForFileName(currentUrl)}_${timestamp}`;
  const compareDir = path.join(rootDir, 'results', 'compare', safeFolderName);

  if (!fs.existsSync(compareDir)) {
    fs.mkdirSync(compareDir, { recursive: true });
  }

  // Check broken links
  const { allLinksWithStatus } = await checkBrokenLinks(page);

  // Calculate total links and broken links
  const totalLinks = allLinksWithStatus.length;
  const brokenLinks = allLinksWithStatus.filter(link => link.status !== 200).length;
  const successfulLinks = allLinksWithStatus.filter(link => link.status === 200).length;

  // Create CSV content with a summary
  const csvPath = path.join(compareDir, 'validated_links.csv');
  const csvHeader = 'Link,Status,Error Message\n';
  const csvContent = allLinksWithStatus.map(link => `${link.href},${link.status},${link.errorMessage}`).join('\n');
  const csvSummary = `\nSummary\nTotal Links: ${totalLinks}\nSuccessful Links: ${successfulLinks}\nBroken Links: ${brokenLinks}\n\n`;
  await fsPromises.writeFile(csvPath, csvHeader + csvContent + csvSummary);

  attachFileToReport(csvPath, 'Validated Links');
  const comparisonFilePath = path.join(compareDir, `compare.json`);
  const screenshotPath = path.join(compareDir, `screenshot.png`);


  const comparisonResults = {
    summary: {
      totalExtracted: allDetails.length,
      totalMatched: matchedResults.length,
      totalMismatched: unmatchedResults.length,
    },
    matchedResults,
    unmatchedResults,
    jsonPath: comparisonFilePath,
    screenshotPath,
  };

  fs.writeFileSync(comparisonFilePath, JSON.stringify(comparisonResults, null, 2));

  attachFileToReport(comparisonFilePath, `Comparison Results ${timestamp}`);

  // Highlight unmatched results on the page
  await page.evaluate(({ matchedResults, unmatchedResults }) => {
    matchedResults.forEach((detail: any) => {
      const element = document.querySelector(`[data-id='${detail.id}']`)as HTMLElement;
      if (element) {
        element.style.outline = '2px solid green';
        
      }
    });
    unmatchedResults.forEach((detail: any) => {
      const element = document.querySelector(`[data-id='${detail.id}']`) as HTMLElement;
      if (element) {
        element.style.outline = '2px solid red';
      }
    });
  }, { matchedResults, unmatchedResults });

  await page.screenshot({ path: screenshotPath, fullPage: true });

  attachFileToReport(screenshotPath, 'Validated Page Screenshot');

  return comparisonResults;
}
