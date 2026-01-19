const express = require("express");
const router = express.Router();
const Checklist = require("../models/checklist.model");

// POST: Create a new checklist

router.post("/", async (req, res) => {
  try {
    const checklist = new Checklist(req.body);
    const savedChecklist = await checklist.save();
    res.status(201).json(savedChecklist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Get all checklists

router.get("/", async (req, res) => {
  try {
    const checklists = await Checklist.find().populate("tripId");
    res.status(200).json(checklists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get a specific checklist by ID
router.get("/:id", async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id).populate(
      "tripId"
    );
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }
    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add a new item to a checklist
router.post("/:checklistId/items", async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.checklistId,
      { $push: { items: req.body } }, // req.body should contain the { name: "...", isChecked: ... } object
      { new: true, runValidators: true }
    );
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }
    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH: Update the checked status of an item in a checklist
router.patch("/:checklistId/items/:itemId", async (req, res) => {
  try {
    const checklist = await Checklist.findOneAndUpdate(
      { _id: req.params.checklistId, "items._id": req.params.itemId },
      { $set: { "items.$.isChecked": req.body.isChecked } }, // req.body should contain { isChecked: true/false }
      { new: true, runValidators: true }
    );
    if (!checklist) {
      return res.status(404).json({ message: "Checklist or item not found" });
    }
    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete an item from a checklist
router.delete("/:checklistId/items/:itemId", async (req, res) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(
      req.params.checklistId,
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true }
    );
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }
    res.status(200).json({ message: "Item deleted successfully", checklist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE : delete a checklist

router.delete("/:id", async (req, res) => {
  try {
    const deletedChecklist = await Checklist.findByIdAndDelete(req.params.id);
    if (!deletedChecklist)
      return res.status(404).json({ message: "Checklist not found" });
    res.status(200).json(deletedChecklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
