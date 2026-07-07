import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

console.log('🔍 Testing MongoDB connection...');

const uri = process.env.MONGODB_URI;

console.log('📡 Using:', uri.replace(/\/\/(.*?)@/, '//<hidden>@'));

// First, test DNS resolution
console.log('\n🔍 Testing DNS resolution...');
dns.resolve('cluster1.pdufeec.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('❌ DNS resolution failed:', err.message);
    console.log('\n💡 This is the problem! Your network cannot resolve MongoDB Atlas DNS.');
    console.log('   Use the shard hostname or IP address in your connection string.');
  } else {
    console.log('✅ DNS resolution successful:', addresses);
  }
});

async function test() {
  try {
    console.log('\n⏳ Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log('✅ Connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔍 Try:');
    console.log('1. Use shard hostnames instead of SRV');
    console.log('2. Change DNS to 8.8.8.8');
    console.log('3. Use mobile hotspot to test');
    process.exit(1);
  }
}

test();