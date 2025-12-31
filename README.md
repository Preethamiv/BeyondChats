# BeyondChats Blog Intelligence Platform

This project is a full-stack system built as part of the BeyondChats technical assignment.  
The goal of the project is to **identify outdated blog content, enhance it using AI by
learning from top-ranking articles, and present both original and improved versions
through a clean, user-friendly interface**.

The system is implemented in three phases: scraping, AI-based enhancement, and frontend visualization.

---

## 🧠 Problem Statement

Blogs often become outdated over time, both in terms of content quality and SEO performance.
Manually revisiting and improving older articles is time-consuming and inconsistent.

This project demonstrates how:
- Older blog posts can be programmatically identified
- High-ranking reference articles can be analyzed
- AI can be used to rewrite and improve existing content
- The improvements can be clearly presented and compared

---

## 🏗️ Project Architecture

BeyondChats/
│
├── backend/ # Node.js + Express + MongoDB (APIs & Scraper)
│
├── ai-updater/ # AI pipeline for content enhancement
│
└── frontend/ # React.js UI for viewing & comparing articles


---

## ⚙️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Puppeteer (web scraping)

### AI Pipeline
- Node.js
- Puppeteer
- Google Gemini API (Flash / 2.5 Flash)

### Frontend
- React.js (Vite)
- CSS (custom styling)
- Framer Motion (subtle animations)

---

## 🔹 Phase 1: Blog Scraping & Storage

**Objective:**  
Fetch the *oldest* blog articles from the BeyondChats blog and store them in a database.

**What was done:**
- Used Puppeteer to navigate to the last page of the BeyondChats blogs
- Extracted the 5 oldest articles
- Scraped the full HTML content of each article
- Stored article data (title, slug, original content) in MongoDB
- Built complete CRUD APIs for articles

**Why this matters:**  
Older articles are more likely to be outdated and benefit the most from AI-based improvements.

---

## 🔹 Phase 2: AI-Based Article Enhancement

**Objective:**  
Improve original blog articles by learning from high-ranking reference articles.

**Workflow:**
1. Fetch pending (not yet updated) articles from backend APIs
2. Search the article title on DuckDuckGo
3. Select the top 2 valid reference articles
4. Scrape main content from those references
5. Use Gemini AI to rewrite and improve the original article
6. Preserve structure, readability, and originality
7. Add a references section for transparency
8. Save the updated article back via APIs

**Key focus:**
- No plagiarism
- Better structure and clarity
- SEO-friendly formatting
- Proper attribution

---

## 🔹 Phase 3: Frontend Visualization

**Objective:**  
Provide a clean, intuitive UI to view original and AI-updated articles.

**Features:**
- Animated hero section with subtle gradient motion
- Card-based layout for articles
- Status indication (Original / AI Updated)
- Modal views for:
  - Original article
  - Updated article
  - Side-by-side comparison
- Hover interactions and depth effects for better UX

**Design philosophy:**
- Minimal but polished
- Focus on readability
- Clear value demonstration
- No unnecessary animations

---

## ▶️ How to Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
