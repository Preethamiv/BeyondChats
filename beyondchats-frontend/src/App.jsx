import { useEffect, useState } from "react";
import ArticleCard from "./components/ArticleCard";
import "./App.css";

const API_URL = "http://localhost:5000/api/articles";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load articles");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status">Loading articles...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="app-container">
      <header className="page-header">
        <h1>BeyondChats Content Upgrader</h1>
        <p>
          AI-powered system to compare original blog articles with updated
          versions generated using external references
        </p>
      </header>

      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
