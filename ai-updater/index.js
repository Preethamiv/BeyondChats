/**
 * Phase 2 – AI Article Updater
 */

require("dotenv").config();

const axios = require("axios");
const puppeteer = require("puppeteer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini setup 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

// Step 1: fetch pending articles 
const fetchPendingArticles = async () => {
  const res = await axios.get("http://localhost:5000/api/articles");
  return res.data.filter((a) => a.isUpdated === false);
};

// Step 2: DuckDuckGo search 
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

// Step 3: scrape reference articles 
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

// Step 4: build Gemini prompt 
const buildGeminiPrompt = (originalContent, referenceArticles) => `
You are a professional content editor.

TASK:
Rewrite and improve the ORIGINAL ARTICLE using insights from the REFERENCE ARTICLES.

RULES:
- Do NOT copy sentences from references.
- Do NOT plagiarize.
- Improve structure, clarity, flow, and depth.
- Output MUST be valid HTML.
- Use headings and paragraphs.
- Add a "References" section at the end with links.

ORIGINAL ARTICLE:
"""
${originalContent}
"""

REFERENCE ARTICLE 1:
"""
${referenceArticles[0].content}
"""

REFERENCE ARTICLE 2:
"""
${referenceArticles[1].content}
"""

OUTPUT:
- HTML only
- End with:
<h3>References</h3>
<ul>
  <li><a href="${referenceArticles[0].url}">${referenceArticles[0].url}</a></li>
  <li><a href="${referenceArticles[1].url}">${referenceArticles[1].url}</a></li>
</ul>
`;

// Step 5: Gemini rewrite 
const rewriteWithGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Safety check: remove markdown code blocks if Gemini wraps the HTML
    return text.replace(/```html|```/g, "").trim();
  } catch (error) {
    console.error("❌ Gemini API Call Failed:", error.message);
    throw error;
  }
};

// Step 6: publish updated article 
const publishUpdatedArticle = async (articleId, html, referenceUrls) => {
  await axios.put(`http://localhost:5000/api/articles/${articleId}`, {
    updatedContent: html,
    references: referenceUrls,
  });

  console.log("✅ Updated article published");
};

//MAIN PIPELINE 
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

    const prompt = buildGeminiPrompt(
      article.originalContent,
      referenceArticles
    );

    console.log("\n🤖 Calling Gemini...");
    const updatedHtml = await rewriteWithGemini(prompt);

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
