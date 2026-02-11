import express from 'express';
import {
  getAllInventory,
  getInventoryById,
  getLowStockItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'doctor'), getAllInventory);
router.get('/low-stock', protect, authorize('admin'), getLowStockItems);
router.get('/:id', protect, authorize('admin', 'doctor'), getInventoryById);
router.post('/', protect, authorize('admin'), createInventoryItem);
router.put('/:id', protect, authorize('admin'), updateInventoryItem);
router.delete('/:id', protect, authorize('admin'), deleteInventoryItem);

export default router;
