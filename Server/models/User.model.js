import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  phoneNumber: String,
  address: String,
  profilePicture: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

