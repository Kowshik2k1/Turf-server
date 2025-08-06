import User from '../models/User.js';

export const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('_id name email');
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers', error });
  }
};
