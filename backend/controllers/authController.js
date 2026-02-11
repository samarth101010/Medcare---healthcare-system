import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

export const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, ...otherData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    const user = await User.create({ email, password, role, firstName, lastName, phone, ...otherData });

    // Create role-specific profile
    if (role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (role === 'doctor') {
      // Create basic doctor profile with default values
      await Doctor.create({ 
        user: user._id,
        specialization: otherData.specialization || 'General Practice',
        qualification: otherData.qualification || 'MBBS',
        experience: otherData.experience || 0,
        licenseNumber: otherData.licenseNumber || `LIC-${Date.now()}`,
        consultationFee: otherData.consultationFee || 500,
        bio: otherData.bio || 'Experienced medical professional'
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({ status: 'success', data: { user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, token } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ status: 'success', data: { user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, token } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
