 express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Property = require("../models/Property");
const RegistrationTerms = require("../models/RegistrationTerms");

const router = express.Router();

router.post("/owner-registration-terms", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Terms and conditions content is required",
      });
    }

    const terms = await RegistrationTerms.findOneAndUpdate(
      { key: "owner_registration" },
      {
        key: "owner_registration",
        title: title?.trim() || undefined,
        content: content.trim(),
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Owner registration terms saved successfully",
      data: terms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

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

    const data = await Student.findByIdAndUpdate(
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

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { isVerified: true },
      { new: true }
    );

    res.json({
      success: true,
      message: "Property verified successfully",
      data: updatedProperty,
    });
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

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { isPremium: true },
      { new: true }
    );

    res.json({
      success: true,
      message: "Property marked as premium successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


module.exports = router;
