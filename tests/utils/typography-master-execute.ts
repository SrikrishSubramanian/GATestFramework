/* This file includes the extractMasterDetails function, which retrieves 
typography details from a page and saves them in a result/master folder.
 This function is implemented in the typography-execute.ts utils file. */
import { extractFontDetailsWithHighlight, extractImageDetails, saveFontDetailsToJson, createDirectories } from '../utils/typography-master';
import { gotoURL } from '../../src/utils/action-utils';
import { getPage } from '../../src/utils/page-utils';
import * as path from 'path';
import * as fs from 'fs';
import { attachFileToReport } from '../utils/reportAttach'

export async function extractMasterDetails(url: string, screenshotIndex: number = 1) {
  const rootDir = process.cwd();
  const resultsDir = path.join(rootDir, 'results');
  const cleanedUrl = url.replace('https://', '').replace('aem-', '');
  const sanitizedUrl = cleanedUrl.replace(/[:/\\?%*|"<>]/g, '.');
  // Ensure the master directory wraps around the sanitized URL directory
  const extractedDir = path.join(resultsDir, 'master', sanitizedUrl);

  // Check if the directory already exists
  if (fs.existsSync(extractedDir)) {
    console.log(`Data for URL '${url}' already exists. Skipping extraction.`);
    // Attach the existing files to the report
  const files = fs.readdirSync(extractedDir);
  files.forEach(file => {
    const filePath = path.join(extractedDir, file);
    attachFileToReport(filePath, `Existing Master File: ${file}`);
  });
  return;
  }

  // Create directories if they don't exist
  createDirectories(rootDir, ['results', 'master', path.join('master', sanitizedUrl)]);

  let fontDetails: {
    tag: string;
    class: string;
    parentClass: string;
    src: string;
    alt: string;
    width: string;
    height: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
    fontWeight?: string;
    lineHeight?: string;
    padding?: string;
  }[] = [];

  const classMap = new Map();

  // Go to URL and wait for load
  // await gotoURL(url);
  await getPage().waitForLoadState('networkidle');
  // Extract font and image details
  const details = await extractFontDetailsWithHighlight(getPage());
  const imageDetails = await extractImageDetails(getPage());

  details.forEach((detail: any) => {
    const key = `${detail.tag}-${detail.class}-${detail.parentClass}`;
    if (classMap.has(key)) {
      const existingDetail = classMap.get(key);
      const isDifferent = existingDetail.fontFamily !== detail.fontFamily ||
        existingDetail.fontSize !== detail.fontSize ||
        existingDetail.fontStyle !== detail.fontStyle ||
        existingDetail.padding !== detail.padding ||
        existingDetail.lineHeight !== detail.lineHeight ||
        existingDetail.fontWeight !== detail.fontWeight;

      if (isDifferent) {
        console.log(`Difference found for class "${detail.class}" in tag "${detail.tag}":`, {
          existingDetail,
          newDetail: detail
        });
      }
    }
    classMap.set(key, detail);
    fontDetails.push(detail);
  });

  imageDetails.forEach((imageDetail) => {
    const key = `${imageDetail.tag}-${imageDetail.class}-${imageDetail.parentClass}`;
    classMap.set(key, imageDetail);
    fontDetails.push(imageDetail);
  });

  // Screenshot
  const screenshotPath = path.join(extractedDir, 'screenshot.png');
  await getPage().screenshot({ path: screenshotPath, fullPage: true });
  attachFileToReport(screenshotPath, 'Master Page Screenshot');
  
  // Sort and save
  fontDetails.sort((a, b) => a.class.localeCompare(b.class));
  saveFontDetailsToJson(extractedDir, fontDetails,url);
  
}
