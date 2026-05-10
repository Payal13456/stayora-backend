const express = require('express');
const Property = require('../models/Property');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ properties });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;