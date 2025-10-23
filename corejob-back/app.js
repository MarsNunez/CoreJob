import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Backend server is up...");
});

export default app;
