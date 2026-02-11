import Billing from '../models/Billing.js';

export const getAllBillings = async (req, res) => {
  try {
    const billings = await Billing.find().populate('patient').populate('appointment');
    res.json({ status: 'success', data: { billings } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id).populate('patient').populate('appointment');
    if (!billing) return res.status(404).json({ status: 'error', message: 'Billing not found' });
    res.json({ status: 'success', data: { billing } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createBilling = async (req, res) => {
  try {
    const billing = await Billing.create(req.body);
    res.status(201).json({ status: 'success', data: { billing } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!billing) return res.status(404).json({ status: 'error', message: 'Billing not found' });
    res.json({ status: 'success', data: { billing } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) return res.status(404).json({ status: 'error', message: 'Billing not found' });
    res.json({ status: 'success', message: 'Billing deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
