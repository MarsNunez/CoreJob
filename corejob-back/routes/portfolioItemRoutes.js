import express from "express";
import { PortfolioItemModel } from "../models/PortfolioItem.js";

const router = express.Router();

// GET ALL PORTFOLIO ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await PortfolioItemModel.find({});
    res.status(200).json(items);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching portfolio items", error: error.message });
  }
});

// GET PORTFOLIO ITEM BY ID
router.get("/:id", async (req, res) => {
  try {
    const item = await PortfolioItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }
    res.json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching portfolio item", error: error.message });
  }
});

// CREATE NEW PORTFOLIO ITEM
router.post("/", async (req, res) => {
  try {
    const item = new PortfolioItemModel({ ...req.body });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating portfolio item", error: error.message });
  }
});

// UPDATE PORTFOLIO ITEM BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await PortfolioItemModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating portfolio item", error: error.message });
  }
});

// DELETE PORTFOLIO ITEM BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PortfolioItemModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting portfolio item", error: error.message });
  }
});

const portfolioItemRoutes = router;
export default portfolioItemRoutes;

