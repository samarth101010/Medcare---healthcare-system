import mongoose from 'mongoose';

const waitingQueueSchema = new mongoose.Schema({
  queueNumber: {
    type: String,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'emergency'],
    default: 'normal'
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'waiting'
  },
  estimatedWaitTime: Number, // in minutes
  checkInTime: {
    type: Date,
    default: Date.now
  },
  calledTime: Date,
  completedTime: Date
}, {
  timestamps: true
});

// Auto-generate queueNumber
waitingQueueSchema.pre('validate', async function(next) {
  if (!this.queueNumber) {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await mongoose.model('WaitingQueue').countDocuments({
      checkInTime: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    this.queueNumber = `Q${today}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('WaitingQueue', waitingQueueSchema);
