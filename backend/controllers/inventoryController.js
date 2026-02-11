import Inventory from '../models/Inventory.js';

export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    res.json({ status: 'success', data: { inventory } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Item not found' });
    res.json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      $or: [
        { status: 'low-stock' },
        { status: 'out-of-stock' }
      ]
    }).sort({ quantity: 1 });
    res.json({ status: 'success', data: { items } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ status: 'error', message: 'Item not found' });
    res.json({ status: 'success', data: { item } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Item not found' });
    res.json({ status: 'success', message: 'Item deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
