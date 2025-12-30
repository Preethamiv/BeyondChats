import { useEffect, useState } from "react";
import { api } from "./api";
import Hero from "./components/Hero";
import ArticleCard from "./components/ArticleCard";

export default function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    api.get("/articles").then((res) => setArticles(res.data));
  }, []);

  return (
    <>
      <Hero />

      <div className="container">
        <div className="grid">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      </div>
    </>
  );
}
