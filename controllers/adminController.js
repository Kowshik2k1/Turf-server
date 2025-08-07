// controllers/adminController.js
import User from '../models/User.js';
import Turf from '../models/Turf.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.role = req.body.role || user.role;
  await user.save();
  res.json({ message: 'User role updated' });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

export const getAllTurfs = async (req, res) => {
  const turfs = await Turf.find({}).populate('manager', 'name email');
  res.json(turfs);
};

export const createTurf = async (req, res) => {
  const turf = new Turf(req.body);
  await turf.save();
  res.status(201).json(turf);
};

export const updateTurf = async (req, res) => {
  const updated = await Turf.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteTurf = async (req, res) => {
  await Turf.findByIdAndDelete(req.params.id);
  res.json({ message: 'Turf deleted' });
};
