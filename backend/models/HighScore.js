const mongoose = require('mongoose');
//Create Score schema
const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  timestamp: {
    year: Number,
    month: Number,
    day: Number,
    hour: Number,
    minute: Number,
    second: Number
  }
});

module.exports = mongoose.model('Score', ScoreSchema);
