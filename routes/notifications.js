const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/notification');

router.post('/', async (req, res) => {
  try {
    const { description, sender, receiver, status } = req.body;
    const n = new Notification({ description, sender, receiver, status });
    await n.save();
    res.status(201).json(n);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/list', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
    if(!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notifications found",
      });
    } 
    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: items
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
