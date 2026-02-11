import express from 'express';
import { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/recordController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, getAllRecords);
router.get('/:id', protect, getRecordById);
router.post('/', protect, authorize('doctor', 'admin'), upload.array('files', 5), createRecord);
router.put('/:id', protect, authorize('doctor', 'admin'), updateRecord);
router.delete('/:id', protect, authorize('admin'), deleteRecord);

export default router;
