import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['medicine', 'equipment', 'supplies'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  price: {
    type: Number,
    required: true
  },
  expiryDate: Date,
  supplier: String,
  location: String,
  description: String,
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  }
}, {
  timestamps: true
});

// Auto-generate itemId
inventorySchema.pre('validate', async function(next) {
  if (!this.itemId) {
    const count = await mongoose.model('Inventory').countDocuments();
    this.itemId = `INV${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Auto-update status based on quantity
inventorySchema.pre('save', function(next) {
  if (this.quantity === 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.reorderLevel) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  next();
});

export default mongoose.model('Inventory', inventorySchema);
