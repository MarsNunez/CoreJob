import express from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const router = express.Router();

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: "Error fetching users", error: e.message });
  }
});

// GET ONE BY ID
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// CREATE NEW USER
router.post("/", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await UserModel.exists({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ ...req.body, password: hashedPassword });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
});

// UPDATE USER BY ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    const userObj = updated.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
});

// DELETE USER BY ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

const userRoutes = router;
export default userRoutes;
