const mongoose = require("mongoose");

const registrationTermsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["owner_registration"],
      unique: true,
      default: "owner_registration",
    },
    title: {
      type: String,
      default: "Owner Registration Terms and Conditions",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegistrationTerms", registrationTermsSchema);