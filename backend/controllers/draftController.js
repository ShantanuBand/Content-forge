import mongoose from "mongoose";
import Draft from "../models/Draft.js";

// Helper to check if string is valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAllDrafts = async (req, res) => {
  try {
    // Limit to latest 6 drafts for a clean UI
    const drafts = await Draft.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json({ drafts });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ message: "Failed to fetch drafts" });
  }
};

export const getDraftById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Draft ID format" });
    }

    const draft = await Draft.findById(id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json(draft);
  } catch (error) {
    console.error("Error fetching draft by ID:", error);
    res.status(500).json({ message: "Error retrieving draft" });
  }
};

export const createDraft = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const draft = await Draft.create({
      title: title.trim(),
      content: content.trim()
    });

    res.status(201).json(draft);
  } catch (error) {
    console.error("Error creating draft:", error);
    res.status(500).json({ message: "Failed to create draft" });
  }
};

export const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Draft ID format" });
    }

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (content !== undefined && (!content || !content.trim())) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content.trim();

    const updated = await Draft.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Draft not found to update" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating draft:", error);
    res.status(500).json({ message: "Failed to update draft" });
  }
};

export const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Draft ID format" });
    }

    const deleted = await Draft.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Draft not found to delete" });
    }

    res.status(200).json({ message: "Draft deleted successfully", id });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({ message: "Failed to delete draft" });
  }
};
