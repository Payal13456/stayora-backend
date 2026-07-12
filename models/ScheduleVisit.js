const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScheduleVisitSchema = new Schema({
  requester_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  property_id: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected','cancelled'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ScheduleVisit', ScheduleVisitSchema);