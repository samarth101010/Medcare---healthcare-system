import Doctor from '../models/Doctor.js';
import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'firstName lastName email phone profileImage').populate('department');
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor profile not found' });
    res.json({ status: 'success', data: { doctor } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'firstName lastName email phone profileImage').populate('department');
    res.json({ status: 'success', data: { doctors } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user').populate('department');
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    res.json({ status: 'success', data: { doctor } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, ...doctorData } = req.body;
    
    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }
    
    // Create user account
    const user = await User.create({ email, password, firstName, lastName, phone, role: 'doctor' });
    
    // Create doctor profile
    const doctor = await Doctor.create({ user: user._id, ...doctorData });
    
    // Populate user data before sending response
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('department');
    
    res.status(201).json({ status: 'success', data: { doctor: populatedDoctor } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    res.json({ status: 'success', data: { doctor } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    await User.findByIdAndDelete(doctor.user);
    res.json({ status: 'success', message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
