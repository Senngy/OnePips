import {
  All,
  Controller,
  ForbiddenException,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const betterAuthHandler = toNodeHandler(auth);



@Controller('auth')
export class AuthController {
  @All('*')
  async handle(@Req() req: Request, @Res() res: Response) {
    const pathname = req.originalUrl.split('?')[0];
    const PUBLIC_SIGNUP_PATH = '/auth/sign-up/email';

    if (pathname.endsWith(PUBLIC_SIGNUP_PATH)) { // Disable public sign-up
      throw new ForbiddenException({
        code: 'SIGNUP_DISABLED',
        message: 'La création de compte public est désactivée.',
      });
    }
    try {
      await betterAuthHandler(req as any, res as any);
    } catch (e) {
      try {
        res.status(500).end();
      } catch { }
    }
  }
}
