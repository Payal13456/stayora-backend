const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    college: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    activityLogs: [
      {
        action: String,
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    type: {
      type: String,
      enum: ["student", "admin", "owner"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
