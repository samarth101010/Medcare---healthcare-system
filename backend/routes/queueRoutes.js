import express from 'express';
import {
  getAllQueues,
  getActiveQueues,
  getQueueById,
  createQueue,
  updateQueue,
  callNextPatient,
  completeQueue,
  deleteQueue
} from '../controllers/queueController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllQueues);
router.get('/active', protect, getActiveQueues);
router.get('/:id', protect, getQueueById);
router.post('/', protect, createQueue);
router.post('/call-next', protect, authorize('doctor', 'admin'), callNextPatient);
router.put('/:id', protect, updateQueue);
router.put('/:id/complete', protect, authorize('doctor', 'admin'), completeQueue);
router.delete('/:id', protect, authorize('admin'), deleteQueue);

export default router;
