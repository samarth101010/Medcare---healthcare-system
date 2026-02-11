import express from 'express';
import { getMyProfile, getAllPatients, getPatientById, updatePatient, deletePatient } from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-profile', protect, authorize('patient'), getMyProfile);
router.get('/', protect, authorize('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, getPatientById);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

export default router;
