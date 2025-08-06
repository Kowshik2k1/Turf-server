import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';

export const createBooking = async (req, res) => {
  try {
    const { turfId, date, slot, venue } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!turfId || !date || !slot || !venue || !userId) {
      return res.status(400).json({ message: 'Missing required booking details' });
    }

    // Check if turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Check if selected venue belongs to the turf
    const isValidVenue = turf.venues.some((v) => v._id.toString() === venue);
    if (!isValidVenue) {
      return res.status(400).json({ message: 'Selected venue is not valid for this turf' });
    }

    // Check if the slot is already booked for this turf, venue, and date
    const existing = await Booking.findOne({ turf: turfId, date, slot, venue });
    if (existing) {
      return res.status(400).json({ message: 'Slot already booked at this venue' });
    }

    // Create booking
    const booking = new Booking({
      user: userId,
      turf: turfId,
      venue,
      date,
      slot,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: 'Server error during booking' });
  }
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

export const updateBooking = async (req, res) => {
  const { date, slot, venue } = req.body;
  const bookingId = req.params.id;
  const userId = req.user._id;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    // Optional: block editing past bookings
    const now = new Date();
    if (new Date(booking.date) < now)
      return res.status(400).json({ message: 'Cannot modify past bookings' });

    // Prevent double-booking
    const existing = await Booking.findOne({
      _id: { $ne: bookingId },
      turf: booking.turf,
      venue,
      date,
      slot,
    });

    if (existing) return res.status(400).json({ message: 'Slot already booked' });

    booking.date = date;
    booking.slot = slot;
    booking.venue = venue;

    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update booking' });
  }
};

export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user._id;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== userId.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
};