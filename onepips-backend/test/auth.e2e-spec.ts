import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('Auth guards (e2e)', () => {
  let app: INestApplication;
  let prismaMock: any;

  beforeEach(async () => {
    // Ensure required env vars for ConfigModule validation
    process.env.BETTER_AUTH_SECRET =
      process.env.BETTER_AUTH_SECRET || 'test-secret';
    process.env.DATABASE_URL =
      process.env.DATABASE_URL || 'postgresql://localhost/test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'jwt-test-secret';

    prismaMock = {
      session: {
        findUnique: jest.fn(),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /users without cookie -> 401', async () => {
    const res = await request(app.getHttpServer()).get('/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/users with USER session -> 403', async () => {
    prismaMock.session.findUnique.mockResolvedValueOnce({
      token: 'token-user',
      expiresAt: new Date(Date.now() + 10000),
      user: { id: 'u1', role: 'USER' },
    });

    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', 'better-auth.session_token=token-user');

    expect(res.status).toBe(403);
  });

  it('GET /api/users with ADMIN session -> 200', async () => {
    prismaMock.session.findUnique.mockResolvedValueOnce({
      token: 'token-admin',
      expiresAt: new Date(Date.now() + 10000),
      user: { id: 'u2', role: 'ADMIN' },
    });

    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Cookie', 'better-auth.session_token=token-admin');

    expect(res.status).toBe(200);
  });
});
