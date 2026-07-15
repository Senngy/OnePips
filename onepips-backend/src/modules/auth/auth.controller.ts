import { Controller, Post, Body, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const betterAuthHandler = toNodeHandler(auth as any);

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('auth/register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @All('auth/*')
  async proxyBetterAuth(@Req() req: Request, @Res() res: Response) {
    try {
      await betterAuthHandler(req as any, res as any);
    } catch (e) {
      try {
        res.status(500).end();
      } catch {}
    }
  }
}
