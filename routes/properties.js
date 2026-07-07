const express = require('express');
const Property = require('../models/Property');
const ScheduledVisit = require('../models/ScheduleVisit');
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET ALL PROPERTIES
 * Filters:
 * ?city=id
 * ?type=PG
 * ?genderPreference=Female
 * ?minPrice=5000
 * ?maxPrice=10000
 */
router.get('/', async (req, res) => {
    try {
        const {
            city,
            type,
            genderPreference,
            minPrice,
            maxPrice
        } = req.query;

        const filter = {};

        if (city) filter.city = city;
        if (type) filter.type = type;
        if (genderPreference)
            filter.genderPreference = genderPreference;

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice)
                filter.price.$gte = Number(minPrice);

            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }

        const properties = await Property.find(filter)
            .populate('city', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



/**
 * CREATE PROPERTY
 */
router.post('/add', async (req, res) => {
    try {

        const property = await Property.create(req.body);

        const populatedProperty = await Property.findById(property._id)
            .populate('city', 'name image');

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: populatedProperty
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


/**
 * UPDATE PROPERTY
 */
router.put('/:id', async (req, res) => {
    try {

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('city', 'name image');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: property
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


/**
 * DELETE PROPERTY
 */
router.delete('/:id', async (req, res) => {
    try {

        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/schedule-visit', async (req, res) => {
    try {
        const { propertyId, userId, date , time } = req.body;

        const property = await ScheduledVisit.find({ property_id: propertyId, requester_id: userId, date , time });

        if (property.length > 0) {
            console.log("Already scheduled visit found:", property);
            return res.status(400).json({
                success: false,
                message: 'You have already scheduled a visit for this property on this date and time'
            });
        }

        new ScheduledVisit({
            property_id: propertyId,
            requester_id: userId,
            date ,
            time,   
        }).save();

        res.status(200).json({
            success: true,
            message: 'Visit scheduled successfully',
            data: {
                propertyId,
                userId,
                date
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/schedule-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const scheduledVisits = await ScheduledVisit.find({ requester_id: userId })
        .populate('property_id', 'name address price images')

    res.status(200).json({
      success: true,
      data: scheduledVisits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


/**
 * GET PROPERTY DETAILS
 */
router.get('/:id', async (req, res) => {
    try {

        const property = await Property.findById(req.params.id)
            .populate('city', 'name image');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;