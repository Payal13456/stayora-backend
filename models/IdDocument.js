const mongoose = require("mongoose");

const idDocumentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  documentType: {
    type: String,
    enum: ["photo", "doc", "pdf"],
    required: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const IdDocument = mongoose.model("IdDocument", idDocumentSchema);

module.exports = IdDocument;
