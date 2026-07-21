const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },

    occupationType: {
        type: String,
        enum: ['Student', 'Working Professional'],
        required: true
    },

    occupation: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        default: null
    },

    bio: {
        type: String,
        required: true
    },

    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cities',
        required: true
    },

    preferredGender: {
        type: String,
        enum: ['Male', 'Female', 'Any'],
        default: 'Any'
    },

    budget: {
        type: Number,
        required: true
    },

    tags: [{
        type: String
    }],

    phone: {
        type: String,
        required: true
    },

    whatsapp: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },
    slug : {
        type : String,
        required : true,
        unique : true
    },
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Roommate', roommateSchema);