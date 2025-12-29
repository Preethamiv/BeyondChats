const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(cors());               // ✅ CORS FIRST
app.use(express.json());

app.use("/api/articles", articleRoutes);

module.exports = app;
