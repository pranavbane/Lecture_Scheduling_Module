import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

console.log('🔍 Seeding database...');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define schemas
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      phone: String,
      qualification: String,
      department: String,
      availability: String,
      isActive: Boolean,
      createdAt: { type: Date, default: Date.now },
    });

    const User = mongoose.model('User', userSchema);

    // Clear existing data
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany();
    console.log('✅ Users cleared');

    // Hash password
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create Admin
    console.log('👑 Creating Admin...');
    await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: await hashPassword('admin123'),
      role: 'admin',
      phone: '+1 234 567 890',
      isActive: true,
      qualification: 'PhD in Education',
      department: 'Administration',
      availability: 'available',
    });
    console.log('✅ Admin created');

    // Create Instructors
    console.log('👨‍🏫 Creating Instructors...');
    await User.create([
      {
        name: 'Dr. John Doe',
        email: 'john.doe@college.edu',
        password: await hashPassword('instructor123'),
        role: 'instructor',
        qualification: 'PhD in Computer Science',
        department: 'Computer Science',
        availability: 'available',
        phone: '+1 234 567 891',
        isActive: true,
      },
      {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@college.edu',
        password: await hashPassword('instructor123'),
        role: 'instructor',
        qualification: 'PhD in Mathematics',
        department: 'Mathematics',
        availability: 'available',
        phone: '+1 234 567 892',
        isActive: true,
      },
    ]);
    console.log('✅ Instructors created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin: admin@college.edu / admin123');
    console.log('👨‍🏫 John Doe: john.doe@college.edu / instructor123');
    console.log('👨‍🏫 Jane Smith: jane.smith@college.edu / instructor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();