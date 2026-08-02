const express = require("express");
const cors = require("cors");

const agentRoutes = require("./src/routes/agentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        app: "NEXORA AI OS",
        version: "1.0.0"
    });
});

app.use("/api/agent", agentRoutes);

module.exports = app;