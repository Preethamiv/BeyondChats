import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ textAlign: "center", padding: "120px 20px" }}
    >
      <motion.h1
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        style={{
          fontSize: "56px",
          background:
            "linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        BeyondChats Intelligence
      </motion.h1>

      <p style={{ maxWidth: 700, margin: "20px auto", color: "#94a3b8" }}>
        Enhancing legacy blog content using AI-powered competitive analysis and
        structured rewriting.
      </p>
    </motion.div>
  );
}
