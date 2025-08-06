import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
}, { timestamps: true });

const turfSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  image: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviews: [reviewSchema],
  numReviews: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Turf', turfSchema);
