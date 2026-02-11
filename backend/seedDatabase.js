import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import Department from './models/Department.js';
import Appointment from './models/Appointment.js';
import MedicalRecord from './models/MedicalRecord.js';
import Billing from './models/Billing.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Billing.deleteMany({});
    console.log('✅ Cleared all collections');

    // Create Departments
    console.log('\n🏥 Creating departments...');
    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart and cardiovascular system care', location: 'Building A, Floor 3', headOfDepartment: 'Dr. Priya Sharma' },
      { name: 'Neurology', description: 'Brain and nervous system disorders', location: 'Building B, Floor 2', headOfDepartment: 'Dr. Rajesh Kumar' },
      { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents', location: 'Building C, Floor 1', headOfDepartment: 'Dr. Anjali Patel' },
      { name: 'Orthopedics', description: 'Musculoskeletal system treatment', location: 'Building A, Floor 2', headOfDepartment: 'Dr. Vikram Singh' },
      { name: 'Dermatology', description: 'Skin, hair, and nail conditions', location: 'Building B, Floor 1', headOfDepartment: 'Dr. Kavita Reddy' },
      { name: 'Emergency', description: '24/7 emergency medical services', location: 'Building A, Ground Floor', headOfDepartment: 'Dr. Arun Mehta' },
      { name: 'Radiology', description: 'Medical imaging and diagnostics', location: 'Building C, Floor 2', headOfDepartment: 'Dr. Sneha Iyer' },
      { name: 'Laboratory', description: 'Clinical laboratory services', location: 'Building B, Ground Floor', headOfDepartment: 'Dr. Amit Desai' }
    ]);
    console.log(`✅ Created ${departments.length} departments`);

    // Create Admin
    console.log('\n👨‍💼 Creating admin user...');
    const adminUser = await User.create({
      email: 'admin@hospital.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin'
    });
    console.log('✅ Admin created');

    // Create Doctors
    console.log('\n👨‍⚕️ Creating doctors...');
    const doctorsData = [
      {
        email: 'dr.priya@hospital.com', password: 'password123', firstName: 'Priya', lastName: 'Sharma', phone: '+919876543210',
        specialization: 'Cardiology', qualification: 'MBBS, MD (Cardiology), DM', experience: 15, licenseNumber: 'DOC-2024-001',
        consultationFee: 1500, department: departments[0]._id, bio: 'Board-certified cardiologist with 15 years of experience in interventional cardiology and heart disease prevention.'
      },
      {
        email: 'dr.rajesh@hospital.com', password: 'password123', firstName: 'Rajesh', lastName: 'Kumar', phone: '+919876543211',
        specialization: 'Neurology', qualification: 'MBBS, MD (Neurology), DM', experience: 12, licenseNumber: 'DOC-2024-002',
        consultationFee: 1200, department: departments[1]._id, bio: 'Neurologist specializing in stroke, epilepsy, and neurodegenerative diseases with extensive research background.'
      },
      {
        email: 'dr.anjali@hospital.com', password: 'password123', firstName: 'Anjali', lastName: 'Patel', phone: '+919876543212',
        specialization: 'Pediatrics', qualification: 'MBBS, MD (Pediatrics), DCH', experience: 10, licenseNumber: 'DOC-2024-003',
        consultationFee: 1000, department: departments[2]._id, bio: 'Compassionate pediatrician dedicated to child health, development, and preventive care.'
      },
      {
        email: 'dr.vikram@hospital.com', password: 'password123', firstName: 'Vikram', lastName: 'Singh', phone: '+919876543213',
        specialization: 'Orthopedics', qualification: 'MBBS, MS (Orthopedics), DNB', experience: 18, licenseNumber: 'DOC-2024-004',
        consultationFee: 1800, department: departments[3]._id, bio: 'Expert orthopedic surgeon specializing in joint replacement, sports injuries, and spine surgery.'
      },
      {
        email: 'dr.kavita@hospital.com', password: 'password123', firstName: 'Kavita', lastName: 'Reddy', phone: '+919876543214',
        specialization: 'Dermatology', qualification: 'MBBS, MD (Dermatology), DDV', experience: 8, licenseNumber: 'DOC-2024-005',
        consultationFee: 1100, department: departments[4]._id, bio: 'Dermatologist expert in medical and cosmetic dermatology, skin cancer treatment, and laser procedures.'
      },
      {
        email: 'dr.arun@hospital.com', password: 'password123', firstName: 'Arun', lastName: 'Mehta', phone: '+919876543215',
        specialization: 'Emergency Medicine', qualification: 'MBBS, MD (Emergency Medicine)', experience: 14, licenseNumber: 'DOC-2024-006',
        consultationFee: 2000, department: departments[5]._id, bio: 'Emergency medicine specialist with expertise in trauma care and critical care management.'
      },
      {
        email: 'dr.sneha@hospital.com', password: 'password123', firstName: 'Sneha', lastName: 'Iyer', phone: '+919876543216',
        specialization: 'Radiology', qualification: 'MBBS, MD (Radiology), DMRD', experience: 11, licenseNumber: 'DOC-2024-007',
        consultationFee: 1300, department: departments[6]._id, bio: 'Radiologist specializing in diagnostic imaging, CT, MRI, and interventional radiology.'
      },
      {
        email: 'dr.amit@hospital.com', password: 'password123', firstName: 'Amit', lastName: 'Desai', phone: '+919876543217',
        specialization: 'Pathology', qualification: 'MBBS, MD (Pathology), FRCPath', experience: 13, licenseNumber: 'DOC-2024-008',
        consultationFee: 900, department: departments[7]._id, bio: 'Clinical pathologist with expertise in laboratory diagnostics and disease detection.'
      }
    ];

    const doctors = [];
    for (const docData of doctorsData) {
      const { email, password, firstName, lastName, phone, ...doctorInfo } = docData;
      const user = await User.create({ email, password, firstName, lastName, phone, role: 'doctor' });
      const doctor = await Doctor.create({
        user: user._id,
        ...doctorInfo,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '17:00' }
        ]
      });
      doctors.push(doctor);
    }
    console.log(`✅ Created ${doctors.length} doctors`);

    // Create Patients
    console.log('\n👥 Creating patients...');
    const patientsData = [
      { email: 'patient@test.com', password: 'password123', firstName: 'Rahul', lastName: 'Verma', phone: '+919876543220', bloodGroup: 'O+', dateOfBirth: '1990-05-15', address: '123 MG Road, Mumbai, Maharashtra 400001', emergencyContact: '+919876543221' },
      { email: 'neha.gupta@email.com', password: 'password123', firstName: 'Neha', lastName: 'Gupta', phone: '+919876543222', bloodGroup: 'A+', dateOfBirth: '1985-08-22', address: '456 Park Street, Kolkata, West Bengal 700016', emergencyContact: '+919876543223' },
      { email: 'arjun.nair@email.com', password: 'password123', firstName: 'Arjun', lastName: 'Nair', phone: '+919876543224', bloodGroup: 'B+', dateOfBirth: '1992-03-10', address: '789 Brigade Road, Bangalore, Karnataka 560001', emergencyContact: '+919876543225' },
      { email: 'pooja.shah@email.com', password: 'password123', firstName: 'Pooja', lastName: 'Shah', phone: '+919876543226', bloodGroup: 'AB+', dateOfBirth: '1988-11-30', address: '321 Anna Salai, Chennai, Tamil Nadu 600002', emergencyContact: '+919876543227' },
      { email: 'karan.malhotra@email.com', password: 'password123', firstName: 'Karan', lastName: 'Malhotra', phone: '+919876543228', bloodGroup: 'O-', dateOfBirth: '1995-07-18', address: '654 Connaught Place, New Delhi, Delhi 110001', emergencyContact: '+919876543229' }
    ];

    const patients = [];
    for (const patData of patientsData) {
      const { email, password, firstName, lastName, phone, ...patientInfo } = patData;
      const user = await User.create({ email, password, firstName, lastName, phone, role: 'patient' });
      const patient = await Patient.create({ user: user._id, ...patientInfo });
      patients.push(patient);
    }
    console.log(`✅ Created ${patients.length} patients`);

    // Create Appointments
    console.log('\n📅 Creating appointments...');
    const today = new Date();
    const appointmentsData = [
      {
        patient: patients[0]._id, doctor: doctors[0]._id, appointmentDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        appointmentTime: '10:00', status: 'scheduled', type: 'consultation', reason: 'Chest pain and shortness of breath',
        symptoms: ['chest pain', 'shortness of breath', 'fatigue']
      },
      {
        patient: patients[1]._id, doctor: doctors[2]._id, appointmentDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
        appointmentTime: '14:00', status: 'confirmed', type: 'routine-checkup', reason: 'Annual pediatric checkup for child',
        symptoms: []
      },
      {
        patient: patients[2]._id, doctor: doctors[3]._id, appointmentDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        appointmentTime: '11:30', status: 'completed', type: 'follow-up', reason: 'Follow-up after knee surgery',
        symptoms: ['knee pain', 'swelling'], diagnosis: 'Post-operative recovery progressing well',
        notes: 'Patient recovering well. Continue physiotherapy.'
      },
      {
        patient: patients[3]._id, doctor: doctors[1]._id, appointmentDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        appointmentTime: '15:30', status: 'scheduled', type: 'consultation', reason: 'Severe headaches and dizziness',
        symptoms: ['headache', 'dizziness', 'nausea']
      },
      {
        patient: patients[4]._id, doctor: doctors[4]._id, appointmentDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
        appointmentTime: '09:00', status: 'confirmed', type: 'consultation', reason: 'Skin rash and itching',
        symptoms: ['rash', 'itching', 'redness']
      }
    ];
    
    const appointments = [];
    for (const aptData of appointmentsData) {
      const appointment = await Appointment.create(aptData);
      appointments.push(appointment);
    }
    console.log(`✅ Created ${appointments.length} appointments`);

    // Create Medical Records
    console.log('\n📋 Creating medical records...');
    const recordsData = [
      {
        patient: patients[0]._id, doctor: doctors[0]._id, appointment: appointments[0]._id,
        recordType: 'diagnosis', title: 'Hypertension Diagnosis',
        diagnosis: 'Essential Hypertension', description: 'Patient presents with elevated blood pressure',
        treatment: 'Prescribed beta-blockers and lifestyle modifications',
        labResults: [
          { testName: 'Blood Pressure', result: '145/95', normalRange: '120/80', unit: 'mmHg' },
          { testName: 'Cholesterol', result: '220', normalRange: '<200', unit: 'mg/dL' }
        ],
        vitals: { bloodPressure: '145/95', heartRate: 82, temperature: 98.6, weight: 180, height: 70 }
      },
      {
        patient: patients[2]._id, doctor: doctors[3]._id, appointment: appointments[2]._id,
        recordType: 'diagnosis', title: 'Post-operative Knee Recovery',
        diagnosis: 'Post-operative knee recovery', description: 'Follow-up after knee arthroscopy',
        treatment: 'Physiotherapy and pain management',
        labResults: [
          { testName: 'X-Ray', result: 'Proper healing', normalRange: 'N/A', unit: '' }
        ],
        vitals: { bloodPressure: '120/80', heartRate: 75, temperature: 98.4, weight: 165, height: 68 }
      }
    ];
    
    const records = [];
    for (const recData of recordsData) {
      const record = await MedicalRecord.create(recData);
      records.push(record);
    }
    console.log(`✅ Created ${records.length} medical records`);

    // Create Billing Records
    console.log('\n💰 Creating billing records...');
    const billingsData = [
      {
        patient: patients[0]._id, appointment: appointments[0]._id,
        items: [
          { description: 'Consultation Fee - Cardiology', quantity: 1, unitPrice: 200, amount: 200 },
          { description: 'ECG Test', quantity: 1, unitPrice: 80, amount: 80 },
          { description: 'Blood Pressure Monitoring', quantity: 1, unitPrice: 30, amount: 30 }
        ],
        subtotal: 310, tax: 31, discount: 0, totalAmount: 341, paymentStatus: 'paid', paymentMethod: 'card', paidAmount: 341
      },
      {
        patient: patients[2]._id, appointment: appointments[2]._id,
        items: [
          { description: 'Follow-up Consultation - Orthopedics', quantity: 1, unitPrice: 220, amount: 220 },
          { description: 'X-Ray', quantity: 1, unitPrice: 150, amount: 150 },
          { description: 'Physiotherapy Session', quantity: 1, unitPrice: 100, amount: 100 }
        ],
        subtotal: 470, tax: 47, discount: 20, totalAmount: 497, paymentStatus: 'paid', paymentMethod: 'insurance', paidAmount: 497
      },
      {
        patient: patients[1]._id, appointment: appointments[1]._id,
        items: [
          { description: 'Pediatric Checkup', quantity: 1, unitPrice: 150, amount: 150 },
          { description: 'Vaccination', quantity: 2, unitPrice: 50, amount: 100 }
        ],
        subtotal: 250, tax: 25, discount: 0, totalAmount: 275, paymentStatus: 'pending', paymentMethod: 'cash', paidAmount: 0
      }
    ];
    
    const billings = [];
    for (const billData of billingsData) {
      const billing = await Billing.create(billData);
      billings.push(billing);
    }
    console.log(`✅ Created ${billings.length} billing records`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Doctors: ${doctors.length}`);
    console.log(`   Patients: ${patients.length}`);
    console.log(`   Appointments: ${appointments.length}`);
    console.log(`   Medical Records: ${records.length}`);
    console.log(`   Billing Records: ${billings.length}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@hospital.com / admin123');
    console.log('   Patient: patient@test.com / password123');
    console.log('   Doctor: dr.priya@hospital.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
