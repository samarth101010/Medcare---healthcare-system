import Prescription from '../models/Prescription.js';

export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient')
      .populate('doctor')
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json({ status: 'success', data: { prescriptions } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');
    if (!prescription) return res.status(404).json({ status: 'error', message: 'Prescription not found' });
    res.json({ status: 'success', data: { prescription } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.create(req.body);
    res.status(201).json({ status: 'success', data: { prescription } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!prescription) return res.status(404).json({ status: 'error', message: 'Prescription not found' });
    res.json({ status: 'success', data: { prescription } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ status: 'error', message: 'Prescription not found' });
    res.json({ status: 'success', message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
