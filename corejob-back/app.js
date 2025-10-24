import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/categories", categoryRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Backend server is up...");
});

export default app;
