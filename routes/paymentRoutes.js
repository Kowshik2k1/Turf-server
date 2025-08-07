import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middlewares/authMiddleware.js';
import Turf from '../models/Turf.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/checkout-session
router.post('/checkout-session', protect, async (req, res) => {
  const { turfId, date, slot, venue } = req.body;

  try {
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Verify venue
    const venueObj = turf.venues.find((v) => v._id.toString() === venue);
    if (!venueObj) {
      return res.status(400).json({ message: 'Invalid venue' });
    }

    const amount = turf.pricePerHour;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Turf Booking: ${turf.name}`,
              description: `Venue: ${venueObj.name} | Date: ${date} | Slot: ${slot}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/search?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
        turfId: turfId,
        venue,
        date,
        slot,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
});

export default router;
