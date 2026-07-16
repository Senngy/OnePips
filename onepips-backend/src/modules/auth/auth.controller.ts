import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const betterAuthHandler = toNodeHandler(auth as any);

@Controller('auth')
export class AuthController {
  @All('*')
  async handle(@Req() req: Request, @Res() res: Response) {
    try {
      await betterAuthHandler(req as any, res as any);
    } catch (e) {
      try {
        res.status(500).end();
      } catch {}
    }
  }
}
