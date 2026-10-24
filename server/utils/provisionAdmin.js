import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const provisionAdmin = async () => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Initial production admin provisioning requires NODE_ENV=production.');
  }

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.');
  }

  await connectDB();
  if (await User.exists({})) {
    throw new Error('Users already exist; refusing to provision an initial administrator.');
  }

  const user = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  });
  console.log(`[Admin provisioning] Created initial administrator: ${user.email}`);
};

provisionAdmin()
  .catch((error) => {
    console.error(`[Admin provisioning] ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
