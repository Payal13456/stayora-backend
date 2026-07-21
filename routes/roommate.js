const express = require('express');
const Roommate = require('../models/Roommate');

const router = express.Router();


/*
|--------------------------------------------------------------------------
| CREATE ROOMMATE
|--------------------------------------------------------------------------
*/

router.post('/add', async (req, res) => {
  try {
    // add slug and user_id 
    const slug = req.body.name.toLowerCase().replace(/ /g, '-');
    req.body.slug = slug;

    const roommate = await Roommate.create(req.body);

    const data = await Roommate.findById(roommate._id).populate(
      'city',
      'name image slug'
    );

    return res.status(201).json({
      success: true,
      message: 'Roommate profile created successfully',
      data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL ROOMMATES
|--------------------------------------------------------------------------
|
| Filters:
| ?city=
| ?gender=
| ?occupationType=
| ?preferredGender=
| ?minBudget=
| ?maxBudget=
|
*/

router.get('/', async (req, res) => {
  try {
    const {
      city,
      gender,
      occupationType,
      preferredGender,
      minBudget,
      maxBudget,
      slug
    } = req.query;

    const filter = {};

    if (city) filter.city = city;

    if (gender) filter.gender = gender;

    if (occupationType)
      filter.occupationType = occupationType;

    if (preferredGender)
      filter.preferredGender = preferredGender;

    if (minBudget || maxBudget) {
      filter.budget = {};

      if (minBudget)
        filter.budget.$gte = Number(minBudget);

      if (maxBudget)
        filter.budget.$lte = Number(maxBudget);

      if(slug)
        filter.slug = slug;
    }
    

    const roommates = await Roommate.find(filter)
      .populate('city', 'name image slug')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: roommates.length,
      data: roommates
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| SEARCH ROOMMATES
|--------------------------------------------------------------------------
|
| /search?q=rahul
|
*/

router.get('/search/list', async (req, res) => {
  try {
    const q = req.query.q || '';

    const roommates = await Roommate.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { occupation: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    }).populate('city', 'name image slug');

    return res.json({
      success: true,
      count: roommates.length,
      data: roommates
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ROOMMATE BY ID
|--------------------------------------------------------------------------
*/

router.get('/:id', async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id).populate(
      'city',
      'name image slug'
    );

    if (!roommate) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: roommate
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE ROOMMATE
|--------------------------------------------------------------------------
*/

router.put('/:id', async (req, res) => {
  try {
    const roommate = await Roommate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('city', 'name image slug');

    if (!roommate) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Roommate updated successfully',
      data: roommate
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE ROOMMATE
|--------------------------------------------------------------------------
*/

router.delete('/:id', async (req, res) => {
  try {
    const roommate = await Roommate.findByIdAndDelete(req.params.id);

    if (!roommate) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Roommate deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| TOGGLE ACTIVE STATUS
|--------------------------------------------------------------------------
*/

router.patch('/:id/status', async (req, res) => {
  try {
    const roommate = await Roommate.findById(req.params.id);

    if (!roommate) {
      return res.status(404).json({
        success: false,
        message: 'Roommate profile not found'
      });
    }

    roommate.isActive = !roommate.isActive;

    await roommate.save();

    return res.json({
      success: true,
      message: 'Status updated',
      data: roommate
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;