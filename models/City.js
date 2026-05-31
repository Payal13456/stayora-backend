const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image : {
    type : String,
    required : false,
    nullable : true
  }
});

module.exports = mongoose.model('cities', citySchema);