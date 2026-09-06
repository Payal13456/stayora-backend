require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const citiesRoutes = require("./routes/cities");
const propertiesRoutes = require("./routes/properties");
const roommateRoutes = require("./routes/roommate");
const studentRoutes = require("./routes/student");
const notificationsRoutes = require("./routes/notifications");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => { 
      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/(www\.)?myhomivo\.com$/,
      ];

      if (!origin || allowedOrigins.some((pattern) => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Student Management System API");
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/cities", citiesRoutes);
app.use("/properties", propertiesRoutes);
app.use("/roommate", roommateRoutes);
app.use("/student", studentRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/ai", require("./routes/aisearch"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
