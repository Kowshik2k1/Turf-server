// controllers/getAvailableSlots.js
import Turf from '../models/Turf.js';
import generateSlots from '../utils/slots.js';
import Booking from '../models/Booking.js';

export const getAvailableSlots = async (req, res) => {
  const { turfId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    const allSlots = generateSlots();
    const bookings = await Booking.find({ turf: turfId, date });

    const bookedSlots = bookings.map((b) => b.slot);
    const availableSlots = allSlots.filter((s) => !bookedSlots.includes(s));

    res.json(availableSlots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
