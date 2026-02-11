import WaitingQueue from '../models/WaitingQueue.js';

export const getAllQueues = async (req, res) => {
  try {
    const queues = await WaitingQueue.find()
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .sort({ checkInTime: 1 });
    res.json({ status: 'success', data: { queues } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getActiveQueues = async (req, res) => {
  try {
    const queues = await WaitingQueue.find({
      status: { $in: ['waiting', 'in-progress'] }
    })
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .sort({ priority: -1, checkInTime: 1 });
    res.json({ status: 'success', data: { queues } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getQueueById = async (req, res) => {
  try {
    const queue = await WaitingQueue.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('department');
    if (!queue) return res.status(404).json({ status: 'error', message: 'Queue entry not found' });
    res.json({ status: 'success', data: { queue } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const createQueue = async (req, res) => {
  try {
    // Calculate estimated wait time based on current queue
    const waitingCount = await WaitingQueue.countDocuments({
      status: 'waiting',
      doctor: req.body.doctor
    });
    const estimatedWaitTime = waitingCount * 15; // 15 minutes per patient

    const queue = await WaitingQueue.create({
      ...req.body,
      estimatedWaitTime
    });
    res.status(201).json({ status: 'success', data: { queue } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const updateQueue = async (req, res) => {
  try {
    const queue = await WaitingQueue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!queue) return res.status(404).json({ status: 'error', message: 'Queue entry not found' });
    res.json({ status: 'success', data: { queue } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const callNextPatient = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const nextQueue = await WaitingQueue.findOneAndUpdate(
      { doctor: doctorId, status: 'waiting' },
      { status: 'in-progress', calledTime: new Date() },
      { new: true, sort: { priority: -1, checkInTime: 1 } }
    ).populate('patient');
    
    if (!nextQueue) {
      return res.status(404).json({ status: 'error', message: 'No patients in queue' });
    }
    
    res.json({ status: 'success', data: { queue: nextQueue } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const completeQueue = async (req, res) => {
  try {
    const queue = await WaitingQueue.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedTime: new Date() },
      { new: true }
    );
    if (!queue) return res.status(404).json({ status: 'error', message: 'Queue entry not found' });
    res.json({ status: 'success', data: { queue } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const deleteQueue = async (req, res) => {
  try {
    const queue = await WaitingQueue.findByIdAndDelete(req.params.id);
    if (!queue) return res.status(404).json({ status: 'error', message: 'Queue entry not found' });
    res.json({ status: 'success', message: 'Queue entry deleted successfully' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
