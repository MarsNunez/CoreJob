import express from "express";
import { NotificationModel } from "../models/notification.js";

const router = express.Router();

// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const notifications = await NotificationModel.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
});

// GET NOTIFICATION BY ID
router.get("/:id", async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notification",
      error: error.message,
    });
  }
});

// CREATE NEW NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const { user_id, message, date } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const notification = new NotificationModel({
      ...req.body,
      date: date ?? undefined,
    });
    await notification.save();

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({
      message: "Error creating notification",
      error: error.message,
    });
  }
});

// UPDATE NOTIFICATION BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await NotificationModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res.status(400).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
});

// DELETE NOTIFICATION BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NotificationModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting notification",
      error: error.message,
    });
  }
});

const notificationRoutes = router;
export default notificationRoutes;
