const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['farmer', 'laborer'],
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Profile specific info stored inside one object
  profile: {
    // Laborer specific
    skills: [String],
    experience: Number, // Years of experience
    availability: { type: Boolean, default: true },
    
    // Farmer specific
    farmSize: Number, // In acres
    cropTypes: [String],
    
    // Common
    location: {
      address: String,
      city: String,
      state: String,
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
