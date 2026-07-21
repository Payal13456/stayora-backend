const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cities',
        required: true
    },

    type: {
        type: String,
        enum: ['PG', 'HOSTEL', 'ROOM'],
        required: true
    },

    genderPreference: {
        type: String,
        enum: ['Male', 'Female', 'Any'],
        default: 'Any'
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    latitude: {
        type: Number,
        default: null
    },

    longitude: {
        type: Number,
        default: null
    },

    images: [{
        type: String
    }],

    videos: [{
        type: String
    }],

    amenities: [{
        type: String
    }],

    ownerName: {
        type: String,
        required: true
    },

    ownerPhone: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);