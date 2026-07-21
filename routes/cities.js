const express = require('express');
const City = require('../models/City');

const router = express.Router();

/**
 * GET ALL CITIES
 */
router.get('/', async (req, res) => {
  try {
    const cities = await City.find();

    res.status(200).json({
      success: true,
      data: cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

/**
 * GET SINGLE CITY
 */
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

/**
 * CREATE CITY
 */
router.post('/add', async (req, res) => {
  try {
    const { name, image } = req.body;
    // add slug generation logic here if needed
    const slug = name.toLowerCase().replace(/ /g, '-');

    const existingCity = await City.findOne({ name });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: 'City already exists'
      });
    }

    const city = new City({
      name,
      image,
      slug
    });

    await city.save();

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: city
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

/**
 * UPDATE CITY
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, image , slug } = req.body;

    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    city.name = name || city.name;
    city.image = image || city.image;
    city.slug = slug || city.slug;
    await city.save();

    res.status(200).json({
      success: true,
      message: 'City updated successfully',
      data: city
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

/**
 * DELETE CITY
 */
router.delete('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    await City.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'City deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;