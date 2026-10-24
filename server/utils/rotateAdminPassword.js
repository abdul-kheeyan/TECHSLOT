import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const rotateAdminPassword = async () => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Admin password rotation requires NODE_ENV=production.');
  }

  const { ADMIN_EMAIL, NEW_ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !NEW_ADMIN_PASSWORD || NEW_ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_EMAIL and a NEW_ADMIN_PASSWORD of at least 12 characters.');
  }

  await connectDB();
  const user = await User.findOne({ email: ADMIN_EMAIL.trim().toLowerCase(), role: 'admin' });
  if (!user) {
    throw new Error('No administrator exists for ADMIN_EMAIL.');
  }

  user.password = NEW_ADMIN_PASSWORD;
  await user.save();
  console.log(`[Admin password rotation] Updated password for ${user.email}`);
};

rotateAdminPassword()
  .catch((error) => {
    console.error(`[Admin password rotation] ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
