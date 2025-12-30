export default function CompareView({ original, updated }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <h3>Original</h3>
        <div dangerouslySetInnerHTML={{ __html: original }} />
      </div>
      <div>
        <h3>AI Updated</h3>
        <div dangerouslySetInnerHTML={{ __html: updated }} />
      </div>
    </div>
  );
}
