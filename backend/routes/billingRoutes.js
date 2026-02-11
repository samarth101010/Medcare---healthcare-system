import express from 'express';
import { getAllBillings, getBillingById, createBilling, updateBilling, deleteBilling } from '../controllers/billingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllBillings);
router.get('/:id', protect, getBillingById);
router.post('/', protect, authorize('admin'), createBilling);
router.put('/:id', protect, authorize('admin'), updateBilling);
router.delete('/:id', protect, authorize('admin'), deleteBilling);

export default router;
