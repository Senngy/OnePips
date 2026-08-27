import 'dotenv/config.js';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { emailService } from '../email/email.service.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        input: false,
        returned: true,
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60 * 1, // 1 hour
    freshAge: 60 * 30, // 30 minutes
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      void emailService.send({
        to: user.email,
        subject: 'Définissez votre mot de passe',
        text: `Définissez votre mot de passe : ${url}`,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void emailService.send({
        to: user.email,
        subject: 'Validez votre adresse email',
        text: `Validez votre adresse email : ${url}`,
      });
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [process.env.FRONT_URL || 'http://localhost:3000'],

  secret: process.env.BETTER_AUTH_SECRET,
});
