require("dotenv").config();


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables FIRST
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ----------------
app.use("/api", resumeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "ATS Resume Checker API (Gemini-powered) is running" });
});

// ---------------- ERROR HANDLER ----------------
app.use(errorHandler);

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
