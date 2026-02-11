import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Patient from './models/Patient.js';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user exists
    const existingUser = await User.findOne({ email: 'patient@test.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Email: patient@test.com');
      console.log('Password: password123');
      process.exit(0);
    }

    // Create test patient user
    const user = await User.create({
      email: 'patient@test.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'patient'
    });

    await Patient.create({
      user: user._id,
      bloodGroup: 'O+'
    });

    console.log('✅ Test user created successfully!');
    console.log('Email: patient@test.com');
    console.log('Password: password123');
    console.log('Role: patient');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createTestUser();
