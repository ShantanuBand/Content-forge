import Draft from "../models/Draft.js";

export const getAllDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find().sort({ createdAt: -1 });
    res.json({ drafts });
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const getDraftById = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) return res.status(404).json({ message: "Not found" });
    res.json(draft);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

export const createDraft = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const draft = await Draft.create({
      title: title.trim(),
      content: content.trim()
    });

    res.status(201).json(draft);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create failed" });
  }
};

export const updateDraft = async (req, res) => {
  const updated = await Draft.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteDraft = async (req, res) => {
  await Draft.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
