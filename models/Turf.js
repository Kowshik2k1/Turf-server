import mongoose from 'mongoose';

// Schema for individual reviews
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
}, { timestamps: true });

// Schema for each venue
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Main turf schema
const turfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  sport: { type: String, enum: ['Badminton', 'Cricket'], required: true },
  image: { type: String },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  venues: [venueSchema],
  reviews: [reviewSchema],
  numReviews: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Turf', turfSchema);
