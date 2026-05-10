const express = require('express');
const City = require('../models/City');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cities = await City.find({}, 'name');
    const cityNames = cities.map(city => city.name);
    res.json({ cities: cityNames });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;