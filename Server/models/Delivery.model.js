import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  deliveryPerson: { type: String, required: true },
  contactNumber: String,
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
  deliveredAt: Date,
}, { timestamps: true });

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
