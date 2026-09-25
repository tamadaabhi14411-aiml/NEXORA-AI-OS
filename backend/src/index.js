import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
import express from "express";
import cors from "cors";

// AI Client
import "./ai/aiClient.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillProofRoutes from "./routes/skillProofRoutes.js";

// Fix MongoDB Atlas SRV DNS issue
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const app = express();

// =========================
// Middleware
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);

app.use(express.json());

// =========================
// Connect MongoDB
// =========================

connectDB();

// =========================
// Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/agent", agentRoutes);

app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);

app.use("/api/resume", resumeRoutes);
app.use("/api/follow", followRoutes);

app.use("/api/community", communityRoutes);
app.use("/api/communities", communityRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skills", skillProofRoutes);
app.use("/api/projects", projectRoutes);

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
    database: "Connected"
  });
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`🌐 Network access enabled on port ${PORT}`);
});