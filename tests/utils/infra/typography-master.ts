/* This master extract file includes functions designed to extract master details from the page.
These functions will be utilized within the typography-master-execute.ts utils file. */

const fs = require('fs');
const path = require('path');
import { Page } from '@playwright/test';
import { attachFileToReport } from '../utils/reportAttach'

export function createDirectories(baseDir: any, subDirectories: any) {
  subDirectories.forEach((subDir: any) => {
    const dirPath = path.join(baseDir, subDir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

export function readLinksFromCSV(filename: string): string[] {
  return fs.readFileSync(filename)
    .toString()
    .split('\n')
    .map((e: string) => e.trim())  // Explicitly typing 'e' as 'string'
    .filter(Boolean); // Remove empty lines
}

export async function extractFontDetailsWithHighlight(page: Page) {
  return await page.evaluate(() => {
    const selectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'span', 'div', 'td'];
    const details: any = [];
    const seenElements = new Set();

    const walkDOM = (node: any, func: any) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        func(node);
        let child = node.firstChild;
        while (child) {
          walkDOM(child, func);
          child = child.nextSibling;
        }
      }
    };

    const getTextWithBr = (element: Element): string =>
      Array.from(element.childNodes)
        .map((child) => {
          if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName.toLowerCase() === 'br') {
            return '\n';
          } else if (child.textContent) {
            return child.textContent.trim().replace(/\s+/g, ' ');
          }
          return '';
        })
        .join('');

    const addFontDetails = (element: any) => {
      const style = window.getComputedStyle(element);
      const tag = element.tagName.toLowerCase();
      const className = element.className.trim();
      const parentClass = element.parentElement ? element.parentElement.className.trim() : '';
      const text = getTextWithBr(element).trim();

      if (seenElements.has(element) || !text || (tag === 'td' && !className)) return;

      if (tag === 'p' && (!className && !element.style.cssText)) return;

      seenElements.add(element);
      element.style.border = "white";

      const detail = {
        tag,
        class: className,
        parentClass,
        text,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontStyle: style.fontStyle,
        padding: style.padding !== "0px" ? style.padding : undefined,
        lineHeight: style.lineHeight !== "normal" ? style.lineHeight : undefined,
        fontWeight: style.fontWeight !== "normal" ? style.fontWeight : undefined,
      };

      details.push(detail);
    };

    walkDOM(document.body, (node: Node) => {
      if (node instanceof Element && selectors.includes(node.tagName.toLowerCase())) {
        addFontDetails(node);
      }
    });

    return details;
  });
}

export async function extractImageDetails(page: Page) {
  return await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    return Array.from(images).map((img) => {
      const style = window.getComputedStyle(img);

      if (img.hasAttribute('data-src') && img.src === '') {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.src = dataSrc;
        }
      }


      img.style.border = "white";

      return {
        tag: 'img',
        class: img.className.trim(),
        parentClass: img.parentElement ? img.parentElement.className.trim() : '',
        src: img.src,
        alt: img.alt.trim(),
        width: style.width !== 'auto' ? style.width : `${img.width}px`,
        height: style.height !== 'auto' ? style.height : `${img.height}px`
      };
    });
  });
}

export function saveFontDetailsToJson(extractedDir: string, fontDetails: any, url: string) {
  // Create a timestamp with time first and a more readable format
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false }).replace(/:/g, '');
  const formattedDate = now.toLocaleDateString('en-GB').replace(/\//g, '-');
  const timestamp = `${formattedTime}_${formattedDate}`;

  // Construct the new filename using the formatted timestamp
  const jsonFilePath = path.join(extractedDir, `master_${timestamp}.json`);

  let existingData = [];

  if (fs.existsSync(jsonFilePath)) {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    existingData = JSON.parse(fileContent);
  }

  existingData.push(...fontDetails);

  fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
  attachFileToReport(jsonFilePath, `Master Font Details master_${timestamp}`);
}
