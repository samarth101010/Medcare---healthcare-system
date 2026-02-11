import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    unique: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [{
    type: String
  }],
  chronicDiseases: [{
    type: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    validUntil: Date
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }]
}, {
  timestamps: true
});

// Auto-generate patient ID before validation
patientSchema.pre('validate', async function(next) {
  if (!this.patientId) {
    const count = await this.constructor.countDocuments();
    this.patientId = `PAT${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Indexes
patientSchema.index({ user: 1 });
patientSchema.index({ patientId: 1 });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
