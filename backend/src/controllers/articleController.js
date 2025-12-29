const Article = require("../models/Article");

// GET /api/articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch articles",
      error: error.message,
    });
  }
};

// POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, slug, originalContent } = req.body;

    // basic validation
    if (!title || !slug || !originalContent) {
      return res.status(400).json({
        message: "title, slug and originalContent are required",
      });
    }

    const article = await Article.create({
      title,
      slug,
      originalContent,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create article",
      error: error.message,
    });
  }
};

// GET /api/articles/:id
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch article",
      error: error.message,
    });
  }
};

// PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const { updatedContent, references } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (updatedContent) {
      article.updatedContent = updatedContent;
      article.isUpdated = true;
    }

    if (references) {
      article.references = references;
    }

    await article.save();

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update article",
      error: error.message,
    });
  }
};

// DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete article",
      error: error.message,
    });
  }
};


module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
};



