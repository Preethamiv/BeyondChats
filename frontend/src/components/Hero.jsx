export default function Hero() {
  return (
    <section className="hero-section">
      {/* 3D floating objects */}
      <div className="hero-objects">
        <span className="one"></span>
        <span className="two"></span>
        <span className="three"></span>
        <span className="four"></span>
        <span className="five"></span>
      </div>

      <h1 className="animated-title">BeyondChats Intelligence</h1>

      <p style={{ maxWidth: 700, margin: "20px auto", color: "#94a3b8" }}>
        Enhancing legacy blog content using AI-powered competitive analysis and
        structured rewriting.
      </p>
    </section>
  );
}
