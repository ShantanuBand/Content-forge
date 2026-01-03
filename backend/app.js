import express from "express";
import cors from "cors";
import draftRoutes from "./routes/draftRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/api/drafts", draftRoutes);
app.use("/api/ai", aiRoutes);

export default app;
