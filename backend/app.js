import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import draftRoutes from "./routes/draftRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/drafts", draftRoutes);
app.use("/api/ai", aiRoutes);

// ---------- FRONTEND SERVING ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vite build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

export default app;
