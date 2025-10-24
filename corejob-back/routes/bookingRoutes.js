import express from "express";
import { BookingModel } from "../models/Booking.js";

const router = express.Router();

// GET ALL BOOKINGS
router.get("/", async (req, res) => {
  try {
    const bookings = await BookingModel.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

// GET BOOKING BY ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: error.message });
  }
});

// CREATE NEW BOOKING
router.post("/", async (req, res) => {
  try {
    const booking = new BookingModel({
      ...req.body,
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating booking", error: error.message });
  }
});

// UPDATE BOOKING BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await BookingModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(201).json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating booking", error: error.message });
  }
});

// DELETE BOOKING BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookingModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
});

const bookingRoutes = router;
export default bookingRoutes;
