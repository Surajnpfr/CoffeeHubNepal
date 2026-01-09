import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    console.log(`MongoDB database: ${mongoose.connection.db?.databaseName}`);
    return;
  }
  try {
    await mongoose.connect(env.mongoUri, {
      // Azure Cosmos DB specific options
      retryWrites: false,
      // Don't create collections automatically with high throughput
      // Collections should be created manually in Azure Portal first
    });
    console.log('MongoDB connected successfully');
    const dbName = mongoose.connection.db?.databaseName;
    console.log(`MongoDB database: ${dbName || 'NOT SET - Check connection string!'}`);
    console.log(`MongoDB connection string: ${env.mongoUri.substring(0, 80)}...`);
    
    // Check if database name is in connection string
    if (dbName === 'test' || !dbName) {
      console.error('⚠️  ERROR: Connected to wrong database!');
      console.error('   Current database:', dbName || 'NOT SET');
      console.error('   Expected database: coffeehubnepal');
      console.error('   FIX: Update MONGO_URI in .env file to include database name');
      console.error('   Format: mongodb://...@...:10255/coffeehubnepal?ssl=...');
      console.error('   Note: Add /coffeehubnepal BEFORE the ? in the connection string');
    } else if (dbName !== 'coffeehubnepal') {
      console.warn(`⚠️  WARNING: Connected to database "${dbName}" instead of "coffeehubnepal"`);
      console.warn('   Make sure this is the correct database name in Azure');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}
