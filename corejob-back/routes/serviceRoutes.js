import express from "express";
import { ServiceModel } from "../models/Service.js";

const router = express.Router();

// GET ALL SERVICES
router.get("/", async (req, res) => {
  try {
    const services = await ServiceModel.find({});
    res.status(200).json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
});

// GET SERVICE BY ID
router.get("/:id", async (req, res) => {
  try {
    const service = await ServiceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
});

// CREATE NEW SERVICE
router.post("/", async (req, res) => {
  try {
    const service = new ServiceModel({ ...req.body });
    await service.save();

    res.status(201).json(service);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating service", error: error.message });
  }
});

// UPDATE SERVICE BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await ServiceModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating service", error: error.message });
  }
});

// DELETE SERVICE BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
});

const serviceRoutes = router;
export default serviceRoutes;
