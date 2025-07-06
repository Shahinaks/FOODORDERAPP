import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String, 
  image: String,
  isVeg: { type: Boolean, required: true }, 
  isAvailable: { type: Boolean, default: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, { timestamps: true });


export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
