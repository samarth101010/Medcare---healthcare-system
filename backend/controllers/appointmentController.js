import Appointment from '../models/Appointment.js';

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient').populate('doctor');
    res.json({ status: 'success', data: { appointments } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient').populate('doctor');
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    res.json({ status: 'success', data: { appointment } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({ status: 'success', data: { appointment } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    res.json({ status: 'success', data: { appointment } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    res.json({ status: 'success', message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
