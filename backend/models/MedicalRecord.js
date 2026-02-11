import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  recordId: { type: String, unique: true, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  recordType: { type: String, enum: ['diagnosis', 'lab-report', 'prescription', 'imaging', 'other'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  diagnosis: { type: String },
  treatment: { type: String },
  files: [{ fileName: String, fileUrl: String, fileType: String, uploadDate: Date }],
  labResults: [{ testName: String, result: String, normalRange: String, unit: String }],
  vitals: { bloodPressure: String, heartRate: Number, temperature: Number, weight: Number, height: Number },
  isConfidential: { type: Boolean, default: false }
}, { timestamps: true });

medicalRecordSchema.pre('validate', async function(next) {
  if (!this.recordId) {
    const count = await mongoose.model('MedicalRecord').countDocuments();
    this.recordId = `REC${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

medicalRecordSchema.index({ patient: 1, createdAt: -1 });
export default mongoose.model('MedicalRecord', medicalRecordSchema);
