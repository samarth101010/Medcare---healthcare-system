import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  facilities: [{ type: String }],
  contactNumber: { type: String },
  location: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

departmentSchema.index({ name: 1 });
export default mongoose.model('Department', departmentSchema);
