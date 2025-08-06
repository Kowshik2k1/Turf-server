import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  venue: { type: String, required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
