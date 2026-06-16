// Run: node server/seedDb.js
require('dotenv').config();
const mongoose = require('mongoose');
const Subject = require('./models/subjectModel');

async function seed() {
  try {
    const rawUri = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI;
    const mongoUri = rawUri
      ? rawUri.trim().replace(/^['"]|['"]$/g, '')
      : 'mongodb://localhost:27017/elearning';
    const source = process.env.MONGO_URI ? 'MONGO_URI' : process.env.DATABASE_URL ? 'DATABASE_URL' : process.env.MONGODB_URI ? 'MONGODB_URI' : 'default local URI';
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB connection string scheme. It must start with "mongodb://" or "mongodb+srv://".');
    }
    await mongoose.connect(mongoUri);
    console.log(`✅ Connected to MongoDB (${source})`);

    // Clear existing subjects to avoid duplicates if re-seeding
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');

    const subjectsToInsert = [];

    // S1 & S2 subjects (classId is used as grade here, class 1 & 2)
    const coreSubjects = ['English','Mathematics','Biology','Chemistry','Physics','Geography','History','Citizenship','Computer Studies','CRE','Fine Art','Accounting','English Literature','Agriculture','Economics'];
    for (const grade of [1, 2]) {
      for (const name of coreSubjects) {
        subjectsToInsert.push({ name, classId: grade, gradeId: grade, streamId: null, icon: '📘' });
      }
    }

    // S3 & S4 Natural Sciences (streamId: 1)
    const natural = ['English','Mathematics','Physics','Chemistry','Biology','Agriculture','CRE','Additional Mathematics'];
    for (const grade of [3, 4]) {
      for (const name of natural) {
        subjectsToInsert.push({ name, classId: grade, gradeId: grade, streamId: 1, icon: '📗' });
      }
    }

    // S3 & S4 Social Sciences (streamId: 2)
    const social = ['English','History','Geography','Economics','Mathematics','Fine Art','Accounting','English Literature','CRE'];
    for (const grade of [3, 4]) {
      for (const name of social) {
        subjectsToInsert.push({ name, classId: grade, gradeId: grade, streamId: 2, icon: '📙' });
      }
    }

    await Subject.insertMany(subjectsToInsert);
    console.log('✅ All subjects seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
