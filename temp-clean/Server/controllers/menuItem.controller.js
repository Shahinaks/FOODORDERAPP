import { MenuItem } from '../models/MenuItem.model.js';


export const createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body); 
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllMenuItems = async (req, res) => {
  try {
    const { vegType } = req.query;
    const query = {};

    if (vegType === 'Veg') query.isVeg = true;
    if (vegType === 'Non-Veg') query.isVeg = false;

    const items = await MenuItem.find(query).populate('restaurant', 'name address');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item' });
  }
};
export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'MenuItem not found' });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
