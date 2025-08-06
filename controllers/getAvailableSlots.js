import Turf from '../models/Turf.js';
import Booking from '../models/Booking.js';

const generateAllSlots = () => {
  const slots = [];
  for (let hour = 7; hour < 23; hour++) {
    const start = hour.toString().padStart(2, '0') + ':00';
    const end = (hour + 1).toString().padStart(2, '0') + ':00';
    slots.push(`${start}–${end}`);
  }
  return slots;
};

export const getAvailableSlots = async (req, res) => {
  const { turfId } = req.params;
  const { date, venue } = req.query;

  if (!date || !venue) {
    return res.status(400).json({ message: 'Date and venue are required' });
  }

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    const allSlots = generateAllSlots();

    const bookings = await Booking.find({ turf: turfId, date, venue });
    const bookedSlots = bookings.map(b => b.slot);

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (err) {
    console.error('Slot fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
