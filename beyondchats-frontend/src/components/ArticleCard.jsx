export default function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <div className="article-header">
        <h2>{article.title}</h2>
        {article.isUpdated && <span className="badge">AI Updated</span>}
      </div>

      <p className="meta">
        Status: {article.isUpdated ? "Updated by AI" : "Original"}
      </p>

      <div className="article-grid">
        <div className="article-panel">
          <h3 className="label original">Original</h3>
          <div className="content">
            {article.originalContent || "No original content available"}
          </div>
        </div>

        <div className="article-panel updated">
          <h3 className="label updated">AI Updated</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: article.updatedContent || "<p>Not updated yet</p>",
            }}
          />
        </div>
      </div>

      {article.references?.length > 0 && (
        <div className="references">
          <h4>References</h4>
          <ul>
            {article.references.map((ref, idx) => (
              <li key={idx}>
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
