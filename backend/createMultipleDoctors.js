import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

const doctors = [
  {
    email: 'dr.sarah@hospital.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1234567891',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 10,
    licenseNumber: 'DOC-2024-001',
    consultationFee: 150,
    bio: 'Experienced cardiologist specializing in heart disease prevention and treatment'
  },
  {
    email: 'dr.michael@hospital.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Chen',
    phone: '+1234567892',
    specialization: 'Neurology',
    qualification: 'MBBS, MD (Neurology)',
    experience: 8,
    licenseNumber: 'DOC-2024-002',
    consultationFee: 180,
    bio: 'Neurologist with expertise in brain and nervous system disorders'
  },
  {
    email: 'dr.emily@hospital.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '+1234567893',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 12,
    licenseNumber: 'DOC-2024-003',
    consultationFee: 120,
    bio: 'Pediatrician dedicated to child healthcare and development'
  },
  {
    email: 'dr.james@hospital.com',
    password: 'password123',
    firstName: 'James',
    lastName: 'Wilson',
    phone: '+1234567894',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 15,
    licenseNumber: 'DOC-2024-004',
    consultationFee: 200,
    bio: 'Orthopedic surgeon specializing in bone and joint treatments'
  },
  {
    email: 'dr.lisa@hospital.com',
    password: 'password123',
    firstName: 'Lisa',
    lastName: 'Martinez',
    phone: '+1234567895',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 7,
    licenseNumber: 'DOC-2024-005',
    consultationFee: 130,
    bio: 'Dermatologist expert in skin, hair, and nail conditions'
  }
];

const createDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    let created = 0;
    let existing = 0;

    for (const doctorData of doctors) {
      const existingUser = await User.findOne({ email: doctorData.email });
      
      if (existingUser) {
        existing++;
        continue;
      }

      const user = await User.create({
        email: doctorData.email,
        password: doctorData.password,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        phone: doctorData.phone,
        role: 'doctor'
      });

      await Doctor.create({
        user: user._id,
        specialization: doctorData.specialization,
        qualification: doctorData.qualification,
        experience: doctorData.experience,
        licenseNumber: doctorData.licenseNumber,
        consultationFee: doctorData.consultationFee,
        bio: doctorData.bio,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '17:00' }
        ]
      });

      created++;
      console.log(`✅ Created: Dr. ${doctorData.firstName} ${doctorData.lastName} (${doctorData.specialization})`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} doctors`);
    console.log(`   Already existed: ${existing} doctors`);
    console.log(`   Total: ${created + existing} doctors`);
    console.log(`\n🎉 All doctors are ready!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createDoctors();
