import { Page } from 'playwright';

export interface Link {
  href: string;
  text: string;
}

export interface LinkStatus {
  href: string;
  text: string;
  status: number | 'error';
  valid: boolean;
  errorMessage: string;
}

export const checkBrokenLinks = async (page: Page): Promise<{ allLinksWithStatus: LinkStatus[], brokenLinks: LinkStatus[] }> => {
  const context = page.context().request;

  // Adjust target attribute of links opening in new tab
  await page.evaluate(() => {
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach(link => {
      link.removeAttribute('target');
    });
  });

  // Extract links from the page
  const links: Link[] = await page.$$eval('a', anchors => 
    anchors.map(anchor => {
      const element = anchor as HTMLAnchorElement;
      const href = element.href;
      const text = (element.textContent || '').trim();
      return { href, text };
    })
  );

  console.log(`Total links found: ${links.length}`);

  // Define specific links to remove
  const specificLinksToRemove = ['https://undefined/'];
  // Filter specific and non-HTTP links
  const filteredLinks = removeSpecificLinks(links, specificLinksToRemove);
  const validLinks = filterNonHttpLinks(filteredLinks);

  console.log(`Links after removing specific ones and filtering non-HTTP: ${validLinks.length}`);

  // Check the validity of each link
  const checkLinkPromises = validLinks.map(link => checkLink(context, link.href, link.text));
  const results = await Promise.allSettled(checkLinkPromises);

  // Map results to LinkStatus type
  const allLinksWithStatus: LinkStatus[] = results.map((result: any) => {
    if (result.status === 'fulfilled') {
      return {
        href: result.value.link,
        text: result.value.text,
        status: result.value.status,
        valid: result.value.valid,
        errorMessage: result.value.valid ? '' : 'Invalid status'
      };
    } else {
      return {
        href: '',
        text: '',
        status: 'error',
        valid: false,
        errorMessage: 'Error in checking link'
      };
    }
  });

  // Filter to find broken links
  const brokenLinks = allLinksWithStatus.filter(link => !link.valid);

  // Log broken links
  logBrokenLinks(page.url(), brokenLinks.map(link => `${link.href} (${link.text}): ${link.errorMessage}`));

  // Return all links with status and broken links
  return {
    allLinksWithStatus,
    brokenLinks,
  };
};

// Function to check the status of a link
const checkLink = async (request: any, link: string, text: string): Promise<{ link: string; text: string; status: number | 'error'; valid: boolean }> => {
  try {
    const response = await request.get(link);
    const status = response.status();

    if ((status >= 200 && status < 400) || status === 403) {
      console.log(`Valid link: ${link} with status: ${status}`);
      return { link, text, status, valid: true };
    } else {
      console.error(`Broken link found: ${link} with status: ${status}`);
      return { link, text, status, valid: false };
    }
  } catch (error: any) {
    console.error(`Error checking link: ${link}`, error.message);
    return { link, text, status: 'error', valid: false };
  }
};

// Function to remove specific links
const removeSpecificLinks = (links: Link[], specificLinksToRemove: string[]): Link[] => {
  return links.filter(link => !specificLinksToRemove.includes(link.href));
};

// Function to filter only HTTP and HTTPS links
const filterNonHttpLinks = (links: Link[]): Link[] => {
  return links.filter(link => link.href.startsWith('http'));
};

// Logging function for broken links
const logBrokenLinks = (url: string, brokenLinks: string[]): void => {
  if (brokenLinks.length > 0) {
    console.error(`\nBroken links for ${url}:`);
    brokenLinks.forEach(link => console.error(link));
  }
};
