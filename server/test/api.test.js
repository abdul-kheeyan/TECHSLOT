import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getJwtSecret } from '../config/auth.js';
import generateToken from '../utils/generateToken.js';
import Contact from '../models/Contact.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'integration-test-jwt-secret-0123456789abcdef';

const appModule = await import('../app.js');
const app = appModule.default;
let mongo;
let server;
let baseUrl;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await mongoose.disconnect();
  await mongo?.stop();
});

test('secures setup, validates contacts, and paginates public projects and admin inquiries', async () => {
  const originalSecret = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  assert.throws(() => getJwtSecret(), /32 characters of varied random data/);
  process.env.JWT_SECRET = 'short-secret';
  assert.throws(() => getJwtSecret(), /32 characters of varied random data/);
  process.env.JWT_SECRET = 'x'.repeat(32);
  assert.throws(() => getJwtSecret(), /32 characters of varied random data/);
  process.env.JWT_SECRET = 'random-test-secret-0123456789abcdef';
  assert.equal(getJwtSecret(), 'random-test-secret-0123456789abcdef');
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;

  const setupResponse = await fetch(`${baseUrl}/auth/setup-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Attacker', email: 'attacker@example.com', password: 'password123456' }),
  });
  assert.equal(setupResponse.status, 404);
  assert.equal(await User.countDocuments(), 0);

  const invalidLoginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: { $gt: '' }, password: 'password' }),
  });
  assert.equal(invalidLoginResponse.status, 400);

  const invalidContactResponse = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'N'.repeat(101),
      email: 'person@example.com',
      projectType: 'Website',
      budget: 'Custom',
      timeline: 'Flexible',
      message: 'A valid message for this inquiry.',
    }),
  });
  assert.equal(invalidContactResponse.status, 400);
  assert.equal(await Contact.countDocuments(), 0);

  await Project.insertMany(
    ['First', 'Second', 'Third'].map((title, index) => ({
      title,
      slug: `project-${index}`,
      description: 'Project description',
      shortDescription: 'Project summary',
      image: 'https://example.com/project.png',
      technologies: ['React'],
      category: 'Full Stack',
    }))
  );
  const projectPage = await fetch(`${baseUrl}/projects?page=2&limit=2`);
  const projectPageBody = await projectPage.json();
  assert.equal(projectPage.status, 200);
  assert.equal(projectPageBody.data.length, 1);
  assert.equal(projectPageBody.pagination.total, 3);

  const literalSearch = await fetch(`${baseUrl}/projects?search=.*`);
  const literalSearchBody = await literalSearch.json();
  assert.equal(literalSearch.status, 200);
  assert.equal(literalSearchBody.pagination.total, 0);

  const admin = await User.create({
    name: 'Test Admin',
    email: 'admin@example.com',
    password: 'SecurePassword123!',
    role: 'admin',
  });
  const loginResponse = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ' ADMIN@EXAMPLE.COM ', password: 'SecurePassword123!' }),
  });
  assert.equal(loginResponse.status, 200);
  await Contact.insertMany(
    Array.from({ length: 25 }, (_, index) => ({
      name: `Contact ${index}`,
      email: `contact${index}@example.com`,
      projectType: 'Website',
      budget: 'Custom',
      timeline: 'Flexible',
      message: 'A valid inquiry message with enough detail.',
    }))
  );

  const inquiryPage = await fetch(`${baseUrl}/contact?page=2&limit=20`, {
    headers: { Authorization: `Bearer ${generateToken(admin._id)}` },
  });
  const inquiryBody = await inquiryPage.json();
  assert.equal(inquiryPage.status, 200);
  assert.equal(inquiryBody.data.length, 5);
  assert.deepEqual(inquiryBody.pagination, { page: 2, limit: 20, total: 25, pages: 2 });
});
