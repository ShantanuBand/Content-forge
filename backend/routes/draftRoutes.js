import express from "express";
import {
  getAllDrafts,
  getDraftById,
  createDraft,
  updateDraft,
  deleteDraft
} from "../controllers/draftController.js";

const router = express.Router();

router.get("/", getAllDrafts);
router.get("/:id", getDraftById);
router.post("/", createDraft);
router.put("/:id", updateDraft);
router.delete("/:id", deleteDraft);

export default router;
