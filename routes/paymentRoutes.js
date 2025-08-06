import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/checkout-session
router.post('/checkout-session', protect, async (req, res) => {
  const { turf, bookingDate, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Booking - ${turf.name}`,
            description: `Turf at ${turf.location} for ${bookingDate}`,
          },
          unit_amount: amount * 100, // in paise
        },
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/search?canceled=true`,
      metadata: {
        userId: req.user._id.toString(),
        turfId: turf._id,
        bookingDate,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe session error' });
  }
});

export default router;
