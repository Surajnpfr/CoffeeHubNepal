import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { env } from '../src/config/env.js';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { User } from '../src/models/User.js';

let mongo: MongoMemoryServer;
const app = createApp();

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  await connectDb();
});

afterAll(async () => {
  await disconnectDb();
  await mongo.stop();
});

describe('Auth routes', () => {
  it('rejects weak password on signup', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'weak' })
      .expect(400);
    expect(res.body.error).toBe('WEAK_PASSWORD');
  });

  it('signs up and logs in', async () => {
    const signup = await request(app)
      .post('/auth/signup')
      .send({ email: 'strong@example.com', password: 'Str0ngPass1' })
      .expect(201);
    expect(signup.body.token).toBeDefined();

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'strong@example.com', password: 'Str0ngPass1' })
      .expect(200);
    expect(login.body.token).toBeDefined();
  });

  it('locks after repeated failures', async () => {
    const email = 'lock@example.com';
    await request(app)
      .post('/auth/signup')
      .send({ email, password: 'Str0ngPass1' })
      .expect(201);

    for (let i = 0; i < env.lockoutThreshold; i++) {
      await request(app)
        .post('/auth/login')
        .send({ email, password: 'BadPass1' })
        .expect(401);
    }

    const locked = await request(app)
      .post('/auth/login')
      .send({ email, password: 'Str0ngPass1' })
      .expect(423);
    expect(locked.body.error).toBe('ACCOUNT_LOCKED');
  });

  it('enforces email validation', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: 'Str0ngPass1' })
      .expect(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });
});
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let app: ReturnType<any>;
let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  process.env.RATE_LIMIT_MAX = '6';
  process.env.LOCKOUT_THRESHOLD = '3';

  const { connectDb } = await import('../src/config/db');
  const { createApp } = await import('../src/app');

  await connectDb();
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Auth routes', () => {
  it('signs up a user with strong password', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'Str0ng!Pass' });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('rejects weak password on signup', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'weak@example.com', password: 'weakpass' });
    expect(res.status).toBe(400);
  });

  it('locks account after repeated bad logins', async () => {
    const email = 'lock@example.com';
    await request(app).post('/auth/signup').send({ email, password: 'Str0ng!Pass' });

    for (let i = 0; i < 3; i += 1) {
      await request(app).post('/auth/login').send({ email, password: 'Wrong!Pass1' });
    }

    const res = await request(app).post('/auth/login').send({ email, password: 'Wrong!Pass1' });
    expect(res.status).toBe(423);
    expect(res.body.error).toBe('account_locked');
  });
});

