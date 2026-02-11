import express from 'express';
import { getMyProfile, getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-profile', protect, authorize('doctor'), getMyProfile);
router.get('/', protect, getAllDoctors);
router.get('/:id', protect, getDoctorById);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

export default router;
