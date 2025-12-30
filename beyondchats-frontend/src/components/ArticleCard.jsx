function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h2 className="article-title">{article.title}</h2>

      <div className="article-sections">
        <div className="article-box">
          <h3>Original Article</h3>
          <div className="content-box">
            {article.originalContent || "No original content"}
          </div>
        </div>

        <div className="article-box updated">
          <h3>Updated Article (AI)</h3>
          <div
            className="content-box"
            dangerouslySetInnerHTML={{
              __html: article.updatedContent || "<p>Not updated yet</p>",
            }}
          />
        </div>
      </div>

      {article.references && article.references.length > 0 && (
        <div className="references">
          <h4>References</h4>
          <ul>
            {article.references.map((ref, index) => (
              <li key={index}>
                <a href={ref} target="_blank" rel="noreferrer">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ArticleCard;
