import { useState } from "react";
import Modal from "./Modal";
import CompareView from "./CompareView";

export default function ArticleCard({ article }) {
  const [view, setView] = useState(null);

  return (
    <>
      <div className="card">
        <span
          className={`badge ${
            article.updatedContent ? "updated" : "original"
          }`}
        >
          {article.updatedContent ? "AI Updated" : "Original"}
        </span>

        <h3>{article.title}</h3>

        <div className="actions">
          <button
            className="secondary"
            onClick={() => setView("original")}
          >
            View Original
          </button>

          {article.updatedContent && (
            <>
              <button
                className="primary"
                onClick={() => setView("updated")}
              >
                View Updated
              </button>

              <button
                className="compare"
                onClick={() => setView("compare")}
              >
                Compare
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---------- MODAL ---------- */}
      {view && (
        <Modal onClose={() => setView(null)}>
          {/* Close button INSIDE modal */}
          <button
            className="modal-close"
            onClick={() => setView(null)}
          >
            ✕ Close
          </button>

          {/* Scroll-safe container */}
          <div className="modal-content">
            {view === "original" && (
              <div
                className="article-html"
                dangerouslySetInnerHTML={{
                  __html: article.originalContent,
                }}
              />
            )}

            {view === "updated" && (
              <div
                className="article-html"
                dangerouslySetInnerHTML={{
                  __html: article.updatedContent,
                }}
              />
            )}

            {view === "compare" && (
              <CompareView
                original={article.originalContent}
                updated={article.updatedContent}
              />
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
