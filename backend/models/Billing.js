import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  invoiceId: { type: String, unique: true, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  items: [{ description: String, quantity: Number, unitPrice: Number, amount: Number }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partially-paid', 'overdue'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'insurance', 'online'], default: 'cash' },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  paymentDate: { type: Date },
  dueDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

billingSchema.pre('validate', async function(next) {
  if (!this.invoiceId) {
    const count = await mongoose.model('Billing').countDocuments();
    this.invoiceId = `INV${String(count + 1).padStart(6, '0')}`;
  }
  this.dueAmount = this.totalAmount - this.paidAmount;
  next();
});

billingSchema.index({ patient: 1 });
export default mongoose.model('Billing', billingSchema);
