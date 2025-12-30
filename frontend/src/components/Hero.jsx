import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="ambient one"></div>
      <div className="ambient two"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ textAlign: "center", padding: "120px 20px", position: "relative" }}
      >
        <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="animated-title"
>
  BeyondChats Intelligence
</motion.h1>


        <p style={{ maxWidth: 700, margin: "20px auto", color: "#94a3b8" }}>
          Enhancing legacy blog content using AI-powered competitive analysis and
          structured rewriting.
        </p>
      </motion.div>
    </div>
  );
}
