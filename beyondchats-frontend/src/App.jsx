import { useEffect, useState } from "react";
import ArticleCard from "./components/ArticleCard";
import "./App.css";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch articles");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status">Loading articles...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="app-container">
      <h1>BeyondChats Articles</h1>

      {articles.map((article) => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}

export default App;
