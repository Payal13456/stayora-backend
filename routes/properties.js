const express = require('express');
const Property = require('../models/Property');
const ScheduledVisit = require('../models/ScheduleVisit');
const Notification = require('../models/Notification');
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
            maxPrice,
            user_id
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

        if (user_id) filter.user_id = user_id;

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

router.get('/request-by-property/:propertyId', async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        
        const scheduledVisits = await ScheduledVisit.find({ property_id: propertyId });

        res.status(200).json({
            success: true,
            data: scheduledVisits
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/reschedule-visit', async (req, res) => {
    try {
        const { visitId, newDate, newTime } = req.body;
        
        const scheduledVisit = await ScheduledVisit.findById(visitId);

        if (!scheduledVisit) {
            return res.status(404).json({
                success: false,
                message: 'Scheduled visit not found'
            });
        }
        
        scheduledVisit.date = newDate;
        scheduledVisit.time = newTime;
        await scheduledVisit.save();
        
        res.status(200).json({
            success: true,
            message: 'Scheduled visit rescheduled successfully',
            data: scheduledVisit
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/cancel-visit', async (req, res) => {
    try {
        const { visitId } = req.body;

        const scheduledVisit = await ScheduledVisit.findById(visitId);
        
        if (!scheduledVisit) {
            return res.status(404).json({
                success: false,
                message: 'Scheduled visit not found'
            });
        }
        
        scheduledVisit.status = 'cancelled';
        await scheduledVisit.save();

        res.status(200).json({
            success: true,
            message: 'Scheduled visit cancelled successfully',
            data: scheduledVisit
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/schedule-visit', async (req, res) => {
    try {
        const { propertyId, userId, date , time } = req.body;

        const property = await ScheduledVisit.find({ property_id: propertyId, requester_id: userId , status: "pending" });

        if (property.length > 0) {
            console.log("Already scheduled visit found:", property);
            return res.status(400).json({
                success: false,
                message: 'You already have a pending visit request for this property. Please wait for the owner to respond.'
            });
        }

        const propertyDetails = await Property.findById(propertyId);

        if (!propertyDetails) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        new ScheduledVisit({
            property_id: propertyId,
            requester_id: userId,
            date ,
            time,   
        }).save();

        

        // Create notification for property owner
        await Notification.create({
            description: `A user has requested to visit your property on ${date} at ${time}. Please review the request.`,
            sender: userId,
            receiver: propertyDetails.user_id, // Replace with your owner field
            status: "unread",
        });

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

router.get('/owner-schedule-requests', auth, async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const properties = await Property.find({ user_id: userId }).select('_id');
        const propertyIds = properties.map(p => p._id);
        const scheduledVisits = await ScheduledVisit.find({ property_id: { $in: propertyIds } })
            .populate('requester_id', 'name email phone')
            .populate('property_id', 'name address price images');

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

router.post('/schedule-requests/:id/accept', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const scheduledVisit = await ScheduledVisit.findById(requestId);

        if (!scheduledVisit) {
            return res.status(404).json({
                success: false,
                message: 'Scheduled visit request not found'
            });
        }

        scheduledVisit.status = 'accepted';
        await scheduledVisit.save();

        Notification.create({
            description: `Your visit request for property ${scheduledVisit.property_id} has been accepted.`,
            sender: req.user.id,
            receiver: scheduledVisit.requester_id,
            status: "unread",
        });

        res.status(200).json({
            success: true,
            message: 'Scheduled visit request accepted',
            data: scheduledVisit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/schedule-requests/:id/reject', auth, async (req, res) => {
    try {
        const requestId = req.params.id;
        const scheduledVisit = await ScheduledVisit.findById(requestId);

        if (!scheduledVisit) {
            return res.status(404).json({
                success: false,
                message: 'Scheduled visit request not found'
            });
        }

        scheduledVisit.status = 'rejected';
        await scheduledVisit.save();

        Notification.create({
            description: `Your visit request for the property on ${scheduledVisit.date} at ${scheduledVisit.time} has been rejected.`,
            sender: req.user.id, // Assuming the owner is rejecting the request
            receiver: scheduledVisit.requester_id,
            status: "unread",
        });

        res.status(200).json({
            success: true,
            message: 'Scheduled visit request rejected',
            data: scheduledVisit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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