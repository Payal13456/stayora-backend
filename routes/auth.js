const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const IdDocument = require("../models/IdDocument");

const router = express.Router();

/**
 * Register Student
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const { name, email, phone, college, password } = req.body;

  if (!name || !email || !phone || !college || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, Email, Phone, College and Password are required",
    });
  }

  try {
    // Check if email or phone already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingStudent) {
      if(existingStudent.type == "owner"){
        return res.status(400).json({
          success: false,
          message: "Owner already exists with this email or phone",
        }); 
      } else {
        return res.status(400).json({
          success: false,
          message: "Student already exists",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      phone,
      college,
      password: hashedPassword,
      type: req.body.type || "student",
    });

    await student.save();

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const documents = await IdDocument.find({ studentId: student._id });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        college: student.college,
        documents: documents,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * Login Student
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, student.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const documents = await IdDocument.find({ studentId: student._id });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        college: student.college,
        documents: documents,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
