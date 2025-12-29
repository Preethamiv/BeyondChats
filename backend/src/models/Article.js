const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    originalContent: {
      type: String,
      required: true,
    },

    updatedContent: {
      type: String,
      default: null,
    },

    references: {
      type: [String], // URLs of Google articles
      default: [],
    },

    isUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Article", articleSchema);
