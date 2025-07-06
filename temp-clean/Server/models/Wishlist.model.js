import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user: { type: String, required: true }, 
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
