import User from '../models/User.model.js';
import { logActivity } from './adminActivity.controller.js';


export const getProfile = (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, profilePicture } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phoneNumber, address, profilePicture },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    await logActivity(req.user._id, 'DELETE_USER', `Deleted user with ID ${req.params.id}`);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
export const checkUser = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  res.json({
    isAuthenticated: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
