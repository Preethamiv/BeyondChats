const puppeteer = require("puppeteer");
const axios = require("axios");

/**
 * Phase 1 – Blog Scraper
 * ---------------------
 * This script is responsible for collecting the oldest blog articles
 * from BeyondChats and storing them in the database.
 *
 * The idea is to fetch content that is most likely outdated, so it can
 * later be improved using an AI pipeline in Phase 2.
 *
 * This script is intended to be run once (or occasionally), not as a
 * continuously running service.
 */


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrapeAndStoreOldestArticles = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // 1. Open blogs page
  await page.goto("https://beyondchats.com/blogs/", {
    waitUntil: "domcontentloaded",
  });
  await delay(2000);

  // 2. Find last page
  const pageLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll("a").forEach((a) => {
      const text = a.innerText?.trim();
      const href = a.href;
      if (text && /^\d+$/.test(text) && href) {
        links.push({ text, href });
      }
    });
    return links;
  });

  const lastPage = pageLinks.reduce((max, curr) =>
    Number(curr.text) > Number(max.text) ? curr : max
  );

  // 3. Go to last page
  await page.goto(lastPage.href, {
    waitUntil: "domcontentloaded",
  });
  await delay(2000);

  // 4. Get 5 oldest articles
  const articles = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    document.querySelectorAll("a").forEach((a) => {
      const href = a.href;
      const title = a.innerText?.trim();

      if (
        href &&
        href.startsWith("https://beyondchats.com/blogs/") &&
        !href.endsWith("/blogs/") &&
        title &&
        title.length > 10 &&
        !seen.has(href)
      ) {
        seen.add(href);
        results.push({ title, url: href });
      }
    });

    return results.slice(0, 5);
  });

  // 5. Scrape each article & store
  for (const article of articles) {
    await page.goto(article.url, {
      waitUntil: "domcontentloaded",
    });
    await delay(2000);

    const content = await page.evaluate(() => {
      const articleTag = document.querySelector("article");
      return articleTag ? articleTag.innerHTML : "";
    });

    const slug = article.url.split("/blogs/")[1].replace("/", "");

    try {
      await axios.post("http://localhost:5000/api/articles", {
        title: article.title,
        slug,
        originalContent: content,
      });

      console.log("✅ Stored:", article.title);
    } catch (error) {
      console.log("⚠️ Skipped (maybe duplicate):", article.title);
    }
  }

  await browser.close();
  console.log("🎉 Phase 1 scraping & storage complete");
};

scrapeAndStoreOldestArticles();