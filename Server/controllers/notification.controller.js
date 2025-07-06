import Notification from '../models/Notification.model.js';
import { io } from '../socket.js';

export const createNotification = async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      title,
      message,
      type,
      createdBy: req.user._id,
    });

    io.emit('notification', notification);

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (err) {
    console.error('❌ Create Notification Error:', err);
    res.status(500).json({
      message: 'Failed to create notification',
      error: err.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Notification Error:', err);
    res.status(500).json({
      message: 'Failed to delete notification',
      error: err.message,
    });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role');

    res.json(notifications);
  } catch (err) {
    console.error('❌ Fetch Notifications Error:', err);
    res.status(500).json({
      message: 'Failed to fetch notifications',
      error: err.message,
    });
  }
};
