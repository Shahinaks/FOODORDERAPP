import Delivery from '../models/Delivery.model.js';

export const assignDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ message: 'Assignment failed', error: err.message });
  }
};

export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('order');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
};
export const getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('order');
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching delivery by ID' });
  }
};
export const deleteDelivery = async (req, res) => {
  try {
    const deleted = await Delivery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Delivery not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting delivery' });
  }
};
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, deliveredAt } = req.body;
    const updated = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status, deliveredAt },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Delivery not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
};

