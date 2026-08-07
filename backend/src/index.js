import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
import express from "express";
import cors from "cors";

// ✅ Temporary import to verify AI Client
import "./ai/aiClient.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Fix MongoDB Atlas SRV DNS issue
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/user", userRoutes);

// =========================
// Root Route
// =========================
app.get("/", (req, res) => {
  res.send("🚀 NEXORA AI OS Backend is Running");
});

// =========================
// Health Check
// =========================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NEXORA Backend is Healthy",
    database: "Connected",
  });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});