require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const citiesRoutes = require("./routes/cities");
const propertiesRoutes = require("./routes/properties");
const roommateRoutes = require("./routes/roommate");
const studentRoutes = require("./routes/student");

const app = express();

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
app.use("/cities", citiesRoutes);
app.use("/properties", propertiesRoutes);
app.use("/roommate", roommateRoutes);
app.use("/student", studentRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
