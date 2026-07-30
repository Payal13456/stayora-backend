const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Property = require("../models/Property");

const router = express.Router();

router.post("/verify-user", async (req, res) => {
  try {
    const { userId } = req.body;

    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const data = Student.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );

    res.json({
      success: true,
      message: "Student verified successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/verify-property", async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    Property.findByIdAndUpdate(
      propertyId,
      { verified: true },
      { new: true },
      (err, updatedProperty) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Server error",
          });
        }

        res.json({
          success: true,
          message: "Property verified successfully",
          data: updatedProperty,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/mark-premium-property", async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    Property.findByIdAndUpdate(
      propertyId,
      { isPremium: true },
      { new: true },
      (err, updatedProperty) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Server error",
          });
        }

        res.json({
          success: true,
          message: "Property marked as premium successfully",
          data: updatedProperty,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
