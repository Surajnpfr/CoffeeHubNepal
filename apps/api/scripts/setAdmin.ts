/**
 * Script to set a user to admin role
 * 
 * Usage:
 * 1. Make sure your .env file is configured
 * 2. Run: npm run set-admin <user-email>
 * 
 * Example:
 * npm run set-admin admin@coffeehubnepal.com
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from '../src/models/User.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npm run set-admin <user-email>');
  process.exit(1);
}

async function setAdmin() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables');
      console.error('   Make sure you have a .env file with MONGO_URI set');
      process.exit(1);
    }

    console.log('🔌 Connecting to database...');
    await mongoose.connect(mongoUri, {
      autoCreate: false // Important for Azure Cosmos DB
    });
    console.log('✅ Connected to database');

    // Find and update user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`📋 Found user: ${user.email}`);
    console.log(`   Current role: ${user.role}`);

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully set user "${user.email}" to admin role`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Role: ${user.role}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

setAdmin();
