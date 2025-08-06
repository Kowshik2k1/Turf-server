import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';

export const createBooking = async (req, res) => {
  const { turfId, slot, date } = req.body;
  const userId = req.user._id;

  // Prevent duplicate booking
  const existing = await Booking.findOne({ turf: turfId, slot, date, status: 'Booked' });
  if (existing) return res.status(400).json({ message: 'Slot already booked.' });

  const booking = await Booking.create({
    user: userId,
    turf: turfId,
    slot,
    date,
  });

  res.status(201).json(booking);
};

export const getUserBookings = async (req, res) => {
  const userId = req.user._id;

  const bookings = await Booking.find({ user: userId })
    .populate('turf', 'name location')
    .sort({ createdAt: -1 });

  res.json(bookings);
};

export const getManagerBookings = async (req, res) => {
  // Find turfs assigned to this manager
  const turfs = await Turf.find({ manager: req.user._id }).select('_id');
  const turfIds = turfs.map(t => t._id);

  // Get bookings for those turfs
  const bookings = await Booking.find({ turf: { $in: turfIds } })
    .populate('user', 'name email')
    .populate('turf', 'name location');

  res.json(bookings);
};
