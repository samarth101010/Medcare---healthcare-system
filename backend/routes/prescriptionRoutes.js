import express from 'express';
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.post('/', protect, authorize('doctor', 'admin'), createPrescription);
router.put('/:id', protect, authorize('doctor', 'admin'), updatePrescription);
router.delete('/:id', protect, authorize('doctor', 'admin'), deletePrescription);

export default router;
