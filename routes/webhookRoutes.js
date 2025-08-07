import express from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import User from '../models/User.js';
import { sendBookingConfirmation } from '../utils/sendEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const router = express.Router();

// Stripe requires raw body for signature verification
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const metadata = event.data.object.metadata;

    try {
      const existing = await Booking.findOne({
        turf: metadata.turfId,
        venue: metadata.venue,
        date: metadata.date,
        slot: metadata.slot,
      });

      if (existing) {
        console.warn('Duplicate booking detected. Skipping creation.');
        return res.status(200).send('Duplicate booking');
      }

      const booking = new Booking({
        user: metadata.userId,
        turf: metadata.turfId,
        venue: metadata.venue,
        date: metadata.date,
        slot: metadata.slot,
      });

      await booking.save();

      const user = await User.findById(metadata.userId);
      const turf = await Turf.findById(metadata.turfId);
      await sendBookingConfirmation(user.email, {
        turfName: turf.name,
        date: metadata.date,
        slot: metadata.slot,
      });

      res.status(200).send('Booking created');
    } catch (err) {
      console.error('Webhook booking creation error:', err);
      res.status(500).send('Booking creation failed');
    }
  } else {
    res.status(200).send('Unhandled event');
  }
});

export default router;
