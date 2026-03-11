/* This file contains the essential function required to extract details for the comparison page.
 The function is utilized in the typography-compare-execute.ts utils file */
import { Page } from '@playwright/test';

export const extractFontDetailsWithHighlightCompare = async (page: Page) => {

    return await page.evaluate(() => {
        const generateUniqueId = () => `id-${Math.random().toString(36).substr(2, 16)}`;

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

            const uniqueId = generateUniqueId();
            element.setAttribute('data-id', uniqueId);

            const detail = {
                id: uniqueId,
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

};

export const extractImageDetailsCompare = async (page: Page) => {
    return await page.evaluate(() => {
        const generateUniqueId = () => `id-${Math.random().toString(36).substr(2, 16)}`;

        const images = document.querySelectorAll('img');
        return Array.from(images).map((img) => {
            const style = window.getComputedStyle(img);
            const uniqueId = generateUniqueId();
            img.setAttribute('data-id', uniqueId);
            return {
                id: uniqueId,
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

};