import puppeteer from "puppeteer";

export interface ScrapedImage {
  src: string;
  alt: string;
}

export interface ScrapedData {
  title: string;
  images: ScrapedImage[];
}

export async function scrapeInstagramPublic(url: string, maxScrolls = 3): Promise<ScrapedData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=VizDisplayCompositor",
    ],
  });

  const page = await browser.newPage();

  // Set realistic headers and viewport
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 800 });

  try {
    // Navigate with longer timeout
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for initial content to load
    await page.waitForSelector('article, div[role="main"]', { timeout: 15000 });

    // Additional wait for dynamic content
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Enhanced scrolling with better waiting
    for (let i = 0; i < maxScrolls; i++) {
      const previousImageCount = await page.evaluate(() => document.querySelectorAll('img[src*="scontent"]').length);

      // Scroll down
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for new content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Wait for new images to appear or timeout
      try {
        await page.waitForFunction(
          (prevCount) => document.querySelectorAll('img[src*="scontent"]').length > prevCount,
          { timeout: 1000 },
          previousImageCount
        );
      } catch (e) {
        // Continue if no new images load
        console.log(`Scroll ${i + 1}: No new images detected`);
      }

      // Additional buffer time
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Final wait for all images to fully load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Wait for images to have proper src attributes
    await page
      .waitForFunction(
        () => {
          const images = Array.from(document.querySelectorAll("img"));
          return images.some(
            (img) => img.src && (img.src.includes("scontent") || img.currentSrc?.includes("scontent"))
          );
        },
        { timeout: 10000 }
      )
      .catch(() => {
        console.log("Timeout waiting for images with scontent");
      });

    // Extract title and images
    const scrapedData = await page.evaluate(() => {
      // Extract title using the specific selector
      const titleElement =
        document.querySelector("header section:nth-of-type(4) span") ||
        document.querySelector("header section:nth-of-type(1) div:nth-of-type(2) span");

      const title = titleElement?.textContent?.trim() || "";

      // Extract images with better selectors
      const selectors = [
        "div.xg7h5cd.x1n2onr6 img",
        "article img",
        'div[role="main"] img',
        'img[src*="scontent"]',
        "img",
      ];

      let allImages: Array<{ src: string; alt: string }> = [];

      for (const selector of selectors) {
        try {
          const imgs = Array.from(document.querySelectorAll(selector));
          const extractedImages = imgs
            .map((img) => {
              const element = img as HTMLImageElement;
              return {
                src:
                  element.currentSrc ||
                  element.src ||
                  element.getAttribute("src") ||
                  element.getAttribute("data-src") ||
                  "",
                alt: element.getAttribute("alt") || "",
              };
            })
            .filter((img) => img.src && img.src.includes("scontent"));

          if (extractedImages.length > 0) {
            allImages = [...allImages, ...extractedImages];
            break; // Use the first selector that finds images
          }
        } catch (e) {
          console.log(`Selector ${selector} failed:`, e);
        }
      }

      return { title, images: allImages };
    });

    // Filter and deduplicate images
    const filtered = scrapedData.images.filter(
      (img) => img.src && img.src.includes("scontent") && img.src.startsWith("http")
    );
    const deduplicated = Array.from(new Map(filtered.map((img) => [img.src, img])).values());

    console.log(`Found title: "${scrapedData.title}"`);
    console.log(`Found ${deduplicated.length} unique images`);

    return {
      title: scrapedData.title,
      images: deduplicated,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
