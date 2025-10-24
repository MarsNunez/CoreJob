import express from "express";
import { ReviewModel } from "../models/Review.js";

const router = express.Router();

// GET ALL REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await ReviewModel.find({});
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
});

// GET REVIEW BY ID
router.get("/:id", async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching review", error: error.message });
  }
});

// CREATE NEW REVIEW
router.post("/", async (req, res) => {
  try {
    const review = new ReviewModel({ ...req.body });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating review", error: error.message });
  }
});

// UPDATE REVIEW BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await ReviewModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating review", error: error.message });
  }
});

// DELETE REVIEW BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ReviewModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
});

const reviewRoutes = router;
export default reviewRoutes;

