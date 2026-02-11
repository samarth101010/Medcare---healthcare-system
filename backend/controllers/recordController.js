import MedicalRecord from '../models/MedicalRecord.js';

export const getAllRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find().populate('patient').populate('doctor').populate('appointment');
    res.json({ status: 'success', data: { records } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate('patient').populate('doctor');
    if (!record) return res.status(404).json({ status: 'error', message: 'Record not found' });
    res.json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ status: 'error', message: 'Record not found' });
    res.json({ status: 'success', data: { record } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ status: 'error', message: 'Record not found' });
    res.json({ status: 'success', message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
