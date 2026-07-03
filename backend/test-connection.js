import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('📡 Using SRV connection');

const uri = process.env.MONGODB_URI;

async function test() {
  try {
    console.log('⏳ Connecting...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔌 Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔍 Check:');
    console.log('1. Your internet connection');
    console.log('2. Cluster name in .env');
    console.log('3. MongoDB Atlas status');
    process.exit(1);
  }
}

test();