import Department from '../models/Department.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head');
    res.json({ status: 'success', data: { departments } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('head');
    if (!department) return res.status(404).json({ status: 'error', message: 'Department not found' });
    res.json({ status: 'success', data: { department } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ status: 'success', data: { department } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ status: 'error', message: 'Department not found' });
    res.json({ status: 'success', data: { department } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ status: 'error', message: 'Department not found' });
    res.json({ status: 'success', message: 'Department deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
