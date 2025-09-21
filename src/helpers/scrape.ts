import puppeteer, { Browser, Page } from "puppeteer";

export interface ScrapedImage {
  src: string;
  alt: string;
}

export interface ScrapedData {
  title: string;
  images: ScrapedImage[];
}

export interface ScrapingOptions {
  maxScrolls?: number;
  scrollDelay?: number;
  maxWaitTime?: number;
  headless?: boolean;
}

export class InstagramScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(headless = true): Promise<void> {
    this.browser = await puppeteer.launch({
      headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--disable-extensions",
        "--disable-default-apps",
      ],
    });

    this.page = await this.browser.newPage();

    // Set realistic viewport and user agent
    await this.page.setViewport({ width: 1366, height: 768 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set additional headers to appear more legitimate
    await this.page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    });
  }

  async scrapeProfile(url: string, options: ScrapingOptions = {}): Promise<ScrapedData> {
    const { maxScrolls = 3, scrollDelay = 2000, maxWaitTime = 30000, headless = true } = options;

    if (!this.page) {
      await this.initialize(headless);
    }

    if (!this.page) {
      throw new Error("Failed to initialize page");
    }

    try {
      // Navigate with timeout and wait conditions
      await this.page.goto(url, {
        waitUntil: "networkidle2",
        timeout: maxWaitTime,
      });

      // Wait for main content to load with multiple fallback selectors
      await this.waitForContent();

      // Add random delay to appear more human-like
      await this.randomDelay(1000, 3000);

      // Extract profile title with multiple selector strategies
      const title = await this.extractTitle();

      // Perform scrolling to load more content
      await this.performScrolling(maxScrolls, scrollDelay);

      // Extract images with improved selectors
      const images = await this.extractImages();

      return {
        title,
        images: this.deduplicateImages(images),
      };
    } catch (error) {
      console.error("Scraping error:", error);
      throw error;
    }
  }

  private async waitForContent(): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    // Try multiple selectors for content detection
    const contentSelectors = [
      "article",
      "main",
      '[role="main"]',
      'div[style*="padding-bottom"]', // Instagram post containers
      'img[src*="scontent"]', // Instagram CDN images
    ];

    for (const selector of contentSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        console.log(`Content detected with selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    // Additional wait for dynamic content
    await this.randomDelay(2000, 4000);
  }

  private async extractTitle(): Promise<string> {
    if (!this.page) throw new Error("Page not initialized");

    const titleSelectors = [
      "h1",
      'h2[dir="auto"]',
      "header h2",
      '[data-testid="user-name"]',
      'span[dir="auto"]', // Generic span that might contain username
    ];

    for (const selector of titleSelectors) {
      try {
        const title = await this.page.$eval(selector, (el) => el.textContent?.trim() || "");
        if (title && title.length > 0) {
          console.log(`Title found with selector ${selector}: ${title}`);
          return title;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Fallback: extract from URL or page title
    const pageTitle = await this.page.title();
    return pageTitle.split("•")[0]?.trim() || "Unknown Profile";
  }

  private async performScrolling(maxScrolls: number, scrollDelay: number): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    for (let i = 0; i < maxScrolls; i++) {
      console.log(`Performing scroll ${i + 1}/${maxScrolls}`);

      // Get current image count
      const beforeCount = await this.page.evaluate(
        () => document.querySelectorAll('img[src*="scontent"], img[src*="fbcdn"]').length
      );

      // Scroll with human-like behavior
      await this.page.evaluate(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });

      // Wait for new content to load
      await this.randomDelay(scrollDelay, scrollDelay + 1000);

      // Check if new images loaded
      try {
        await this.page.waitForFunction(
          (prevCount) => {
            const currentCount = document.querySelectorAll('img[src*="scontent"], img[src*="fbcdn"]').length;
            return currentCount > prevCount;
          },
          { timeout: 3000 },
          beforeCount
        );
        console.log(`New content loaded after scroll ${i + 1}`);
      } catch (e) {
        console.log(`No new content after scroll ${i + 1}`);
      }
    }
  }

  private async extractImages(): Promise<ScrapedImage[]> {
    if (!this.page) throw new Error("Page not initialized");

    // Wait for images to fully load
    await this.page
      .waitForFunction(
        () => {
          const images = Array.from(document.querySelectorAll("img"));
          return images.some(
            (img) =>
              (img.src && img.src.includes("scontent")) || (img.currentSrc && img.currentSrc.includes("scontent"))
          );
        },
        { timeout: 10000 }
      )
      .catch(() => {
        console.log("Timeout waiting for Instagram images");
      });

    return await this.page.evaluate(() => {
      const images: Array<{ src: string; alt: string }> = [];

      // Multiple strategies for finding images
      const imageSelectors = [
        'img[src*="scontent"]',
        'img[src*="fbcdn"]',
        "article img",
        'div[role="button"] img',
        "a img", // Images inside links
      ];

      const foundImages = new Set<string>(); // To avoid duplicates during extraction

      imageSelectors.forEach((selector) => {
        const imgs = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>;

        imgs.forEach((img) => {
          const src = img.currentSrc || img.src || img.getAttribute("data-src") || "";
          const alt = img.getAttribute("alt") || "";

          // Filter for Instagram CDN images and avoid duplicates
          if (
            src &&
            (src.includes("scontent") || src.includes("fbcdn")) &&
            src.startsWith("http") &&
            !foundImages.has(src)
          ) {
            foundImages.add(src);
            images.push({ src, alt });
          }
        });
      });

      return images;
    });
  }

  private deduplicateImages(images: ScrapedImage[]): ScrapedImage[] {
    const seen = new Set<string>();
    return images.filter((img) => {
      if (seen.has(img.src)) return false;
      seen.add(img.src);
      return true;
    });
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Usage function with better error handling
export async function scrapeInstagramProfile(url: string, options: ScrapingOptions = {}): Promise<ScrapedData> {
  const scraper = new InstagramScraper();

  try {
    const result = await scraper.scrapeProfile(url, options);
    console.log(`Successfully scraped: ${result.title} with ${result.images.length} images`);
    return result;
  } finally {
    await scraper.close();
  }
}
