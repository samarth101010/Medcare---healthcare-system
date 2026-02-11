import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const createTestDoctor = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if doctor exists
    const existingUser = await User.findOne({ email: 'doctor@test.com' });
    if (existingUser) {
      console.log('✅ Test doctor already exists');
      console.log('Email: doctor@test.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create test doctor user
    const user = await User.create({
      email: 'doctor@test.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567890',
      role: 'doctor'
    });

    await Doctor.create({
      user: user._id,
      specialization: 'Cardiology',
      qualification: 'MBBS, MD',
      experience: 10,
      licenseNumber: 'DOC-2024-001',
      consultationFee: 150,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '17:00' }
      ],
      bio: 'Experienced cardiologist with 10 years of practice'
    });

    console.log('✅ Test doctor created successfully!');
    console.log('Email: doctor@test.com');
    console.log('Password: password123');
    console.log('Role: doctor');
    console.log('Specialization: Cardiology');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createTestDoctor();
