import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB connection...');

const uri = process.env.MONGODB_URI;

async function testConnection() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔌 Connection State:', mongoose.connection.readyState);
    
    // Try to list collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check IP whitelist in MongoDB Atlas');
    console.log('2. Verify connection string in .env');
    console.log('3. Make sure cluster is not paused');
    process.exit(1);
  }
}

testConnection();