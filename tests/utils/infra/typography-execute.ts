/* This is a main utils file which contains the master and compare functions. The typographyTesting
   Can be used in any page after checking the page stability and visibility.  */

import path from 'path';
import fs from 'fs';
import { extractMasterDetails } from '../utils/typography-master-execute';
import { compareExtractedWithMaster } from '../utils/typography-compare-execute';
import { getPage } from '../../src/utils/page-utils';
import { attachFileToReport } from '../utils/reportAttach'

export async function typographyTesting() {
  
  const page = getPage(); 
  
  // Clear cookies and cache
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  const masterURL = page.url(); 
  // Include the testing URL in the report as a string
  const description = `Testing URL: ${masterURL}`;
  attachFileToReport('', description);
  await extractMasterDetails(masterURL);

  const cleanedUrl = masterURL.replace('https://', '').replace('aem-', '');

  // Sanitize URL to determine directory path
  const sanitizedUrl = cleanedUrl.replace(/[:/\\?%*|"<>]/g, '.');
  const directoryPath = path.join(process.cwd(), 'results', 'master', `${sanitizedUrl}`);
  let latestMasterFile = null;

  try {
    const files = fs.readdirSync(directoryPath);

    // Filter the files to find ones that match "master_*.json"
    const masterFiles = files.filter(file => file.startsWith('master_') && file.endsWith('.json'));

    if (masterFiles.length > 0) {
      // Sort files by timestamp to get the latest one; assuming they are named correctly
      latestMasterFile = masterFiles.sort().reverse()[0];
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }

  if (latestMasterFile) {
    const referenceJsonPath = path.join(directoryPath, latestMasterFile);
    await compareExtractedWithMaster(page, referenceJsonPath);
  } else {
    console.log('No Master file found.');
  }
}
