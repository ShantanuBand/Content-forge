import express from "express";
import { generateAIContent } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateAIContent);

export default router;
