import express from "express";
import { CategoryModel } from "../models/Category.js";

const router = express.Router();

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
});

// GET CATEGORY BY ID
router.get("/:id", async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
});

// CREATE NEW CATEGORY
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const category = new CategoryModel({ ...req.body });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating category", error: error.message });
  }
});

// UPDATE CATEGORY BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await CategoryModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating category", error: error.message });
  }
});

// DELETE CATEGORY BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
});

const categoryRoutes = router;
export default categoryRoutes;
