import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Patient from './models/Patient.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const addCustomUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('=== Add Custom User ===\n');
    
    const email = await question('Email: ');
    const password = await question('Password: ');
    const firstName = await question('First Name: ');
    const lastName = await question('Last Name: ');
    const phone = await question('Phone: ');
    const role = await question('Role (admin/patient/doctor): ');

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n❌ User with this email already exists!');
      rl.close();
      process.exit(1);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role.toLowerCase()
    });

    // If patient, create patient record
    if (role.toLowerCase() === 'patient') {
      await Patient.create({
        user: user._id,
        bloodGroup: 'O+' // Default, can be updated later
      });
    }

    console.log('\n✅ User created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log('\nYou can now login with these credentials.');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

addCustomUser();
