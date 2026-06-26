const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/student
 * Fetch logged-in student's profile
 */
router.get("/", auth, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("savedProperties")
      .select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
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
 * PUT /api/student
 * Update logged-in student's profile
 */
router.put("/", auth, async (req, res) => {
  try {
    const { name, phone, college } = req.body;

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (college) student.college = college;

    await student.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        college: student.college,
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
