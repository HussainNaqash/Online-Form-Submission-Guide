import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";

dotenv.config({ path: "../.env" });

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Mount auth routes
app.use("/api/auth", authRoutes);

// serve uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
