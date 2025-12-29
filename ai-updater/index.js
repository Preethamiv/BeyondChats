/**
 * Phase 2 – AI Article Updater
 */

require("dotenv").config();

const axios = require("axios");
const puppeteer = require("puppeteer");

/* -------------------- helpers -------------------- */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const decodeDuckDuckGoUrl = (url) => {
  try {
    const parsed = new URL(url);
    const encoded = parsed.searchParams.get("uddg");
    return encoded ? decodeURIComponent(encoded) : url;
  } catch {
    return url;
  }
};

const isValidArticleLink = (url) => {
  const blocked = [
    "youtube",
    "linkedin",
    "twitter",
    "facebook",
    ".pdf",
    "duckduckgo.com",
  ];

  if (!url.startsWith("http")) return false;
  if (blocked.some((b) => url.includes(b))) return false;

  try {
    return new URL(url).pathname.split("/").length > 2;
  } catch {
    return false;
  }
};

/* -------------------- Step 1: fetch pending articles -------------------- */
const fetchPendingArticles = async () => {
  const res = await axios.get("http://localhost:5000/api/articles");
  return res.data.filter((a) => a.isUpdated === false);
};

/* -------------------- Step 2: DuckDuckGo search -------------------- */
const searchDuckDuckGo = async (query) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(
    query
  )}`;

  console.log("\n🔍 Searching DuckDuckGo for:", query);

  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await delay(2000);

  const rawLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll("a.result__a").forEach((a) => {
      if (a.href) links.push(a.href);
    });
    return links;
  });

  await browser.close();

  const cleanLinks = rawLinks
    .map(decodeDuckDuckGoUrl)
    .filter(isValidArticleLink)
    .slice(0, 2);

  console.log("✅ Top 2 reference article links:");
  console.log(cleanLinks);

  return cleanLinks;
};

/* -------------------- Step 3: scrape reference articles -------------------- */
const scrapeReferenceArticles = async (urls) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const scraped = [];

  for (const url of urls) {
    console.log("\n📄 Opening reference article:", url);

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(3000);

    const content = await page.evaluate(() => {
      const article = document.querySelector("article");
      if (article) return article.innerText;

      const main = document.querySelector("main");
      if (main) return main.innerText;

      const divs = Array.from(document.querySelectorAll("div"));
      let largest = "";
      divs.forEach((d) => {
        if (d.innerText.length > largest.length) {
          largest = d.innerText;
        }
      });
      return largest;
    });

    scraped.push({
      url,
      content: content.slice(0, 3000),
    });
  }

  await browser.close();
  return scraped;
};


/* -------------------- MAIN PIPELINE -------------------- */
(async () => {
  try {
    const pendingArticles = await fetchPendingArticles();

    if (pendingArticles.length === 0) {
      console.log("🎉 No pending articles to update");
      return;
    }

    // Process ONE article (safe & controlled)
    const article = pendingArticles[0];

    console.log("\n📝 Selected article:", {
      id: article._id,
      title: article.title,
    });

    const referenceUrls = await searchDuckDuckGo(article.title);
    if (referenceUrls.length < 2) {
      console.log("❌ Not enough reference articles found");
      return;
    }

    const referenceArticles = await scrapeReferenceArticles(referenceUrls);

    

    await publishUpdatedArticle(
      article._id,
      updatedHtml,
      referenceUrls
    );

    console.log("🎉 Phase 2 complete for this article");
  }
  
  catch (error) {
  console.error("❌ Phase 2 failed FULL ERROR:");
  console.error(error);
}


})();
