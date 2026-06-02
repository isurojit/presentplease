const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const morgan = require("morgan");

const attendanceRoutes = require("./routes/attendance");

const userRoutes = require("./routes/user");

const todoRoutes = require("./routes/todo");

const app = express();

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| MongoDB
|--------------------------------------------------------------------------
*/

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:");

    console.error(err);
  });

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/attendance", attendanceRoutes);

app.use("/api/user", userRoutes);

app.use("/api/todos", todoRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "PresentPlease server running 🚀",
  });
});

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
