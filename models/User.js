// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: {type: String, required: true },
  submissions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission'
    }
  ],
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);