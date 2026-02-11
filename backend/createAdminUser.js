import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@hospital.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@hospital.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: 'admin@hospital.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@hospital.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdminUser();
