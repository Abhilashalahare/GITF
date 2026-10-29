import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import AdminUser from './models/AdminUser.js';

// Load the .env variables (so we can connect to the database)
dotenv.config();

const createFirstAdmin = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    const adminEmail = 'a@gmail.com';
    const adminPassword = '12345678'; 

    // 2. Check if an admin already exists so we don't accidentally make duplicates
    const adminExists = await AdminUser.findOne({ email: adminEmail });
    if (adminExists) {
      console.log('⚠️ An admin with this email already exists!');
      process.exit();
    }

    // 3. Create the new admin
    // Our AdminUser.js model will automatically scramble the password before saving!
    const admin = await AdminUser.create({
      email: adminEmail,
      password: adminPassword, 
    });

    console.log(`✅ Success! Admin created: ${admin.email}`);
    process.exit(); // Stop the script

  } catch (error) {
    console.error(`❌ Error creating admin: ${error.message}`);
    process.exit(1);
  }
};


createFirstAdmin();