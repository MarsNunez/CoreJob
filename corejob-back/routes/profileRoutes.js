import express from "express";
import { ProfileModel } from "../models/Profile.js";

const router = express.Router();

// GET ALL PROFILES
router.get("/", async (req, res) => {
  try {
    const profiles = await ProfileModel.find({});
    res.status(200).json(profiles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profiles", error: error.message });
  }
});

// GET PROFILE BY ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await ProfileModel.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// CREATE NEW PROFILE
router.post("/", async (req, res) => {
  try {
    const profile = new ProfileModel({ ...req.body });
    await profile.save();

    res.status(201).json(profile);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating profile", error: error.message });
  }
});

// UPDATE PROFILE BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await ProfileModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// DELETE PROFILE BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProfileModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting profile", error: error.message });
  }
});

const profileRoutes = router;
export default profileRoutes;
