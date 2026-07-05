const mongoose = require('mongoose');

// Notification schema
const NotificationSchema = new mongoose.Schema({
  description: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' }
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;