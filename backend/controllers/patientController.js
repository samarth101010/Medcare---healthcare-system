import Patient from '../models/Patient.js';
import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('user', 'firstName lastName email phone dateOfBirth gender profileImage');
    if (!patient) return res.status(404).json({ status: 'error', message: 'Patient profile not found' });
    res.json({ status: 'success', data: { patient } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', 'firstName lastName email phone dateOfBirth gender profileImage');
    res.json({ status: 'success', data: { patients } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user');
    if (!patient) return res.status(404).json({ status: 'error', message: 'Patient not found' });
    res.json({ status: 'success', data: { patient } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ status: 'error', message: 'Patient not found' });
    res.json({ status: 'success', data: { patient } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ status: 'error', message: 'Patient not found' });
    await User.findByIdAndDelete(patient.user);
    res.json({ status: 'success', message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
