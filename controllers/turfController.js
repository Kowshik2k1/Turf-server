import Turf from '../models/Turf.js';

export const createTurf = async (req, res) => {
  const { name, location, pricePerHour, slots, image, manager } = req.body;
  const turf = await Turf.create({ name, location, pricePerHour, slots, image, manager });
  res.status(201).json(turf);
};

export const getAllTurfs = async (req, res) => {
  const turfs = await Turf.find().populate('manager', 'name email');
  res.json(turfs);
};

export const updateTurf = async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: 'Turf not found' });

  const updates = req.body;
  Object.assign(turf, updates);
  await turf.save();
  res.json(turf);
};

export const deleteTurf = async (req, res) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) return res.status(404).json({ message: 'Turf not found' });

  await turf.remove();
  res.json({ message: 'Turf deleted' });
};

export const createTurfReview = async (req, res) => {
  const { rating, comment } = req.body;
  const turfId = req.params.id;

  try {
    const turf = await Turf.findById(turfId);

    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    const alreadyReviewed = turf.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this turf' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    turf.reviews.push(review);
    turf.numReviews = turf.reviews.length;
    turf.avgRating = turf.reviews.reduce((acc, r) => acc + r.rating, 0) / turf.reviews.length;

    await turf.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
};

export const searchTurfs = async (req, res) => {
  const { query = '', sport = '' } = req.query;

  try {
    const filters = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    };

    if (sport) {
      filters.sport = sport;
    }

    const turfs = await Turf.find(filters);
    res.json(turfs);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf);
  } catch (error) {
    console.error('Error fetching turf by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
