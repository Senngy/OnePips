import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    const cookieHeader: string | undefined = req.headers?.cookie;
    if (!cookieHeader) {
      throw new UnauthorizedException();
    }

    const cookies = Object.fromEntries(cookieHeader.split(';').map((c: string) => {
      const [k, ...v] = c.split('=');
      return [k.trim(), decodeURIComponent(v.join('='))];
    }));

    const token = cookies['better-auth.session_token'] || cookies['better-auth.sessionToken'] || cookies['session_token'] || cookies['sessionToken'];

    if (!token) {
      throw new UnauthorizedException();
    }

    const session = await this.prisma.session.findUnique({ where: { token }, include: { user: true } });
    if (!session) {
      throw new UnauthorizedException();
    }

    const now = new Date();
    if (session.expiresAt && session.expiresAt < now) {
      throw new UnauthorizedException();
    }

    // 🔐 Mettre à jour lastLoginAt pour tracker l'activité
    await this.prisma.user    .update({
      where: { id: session.userId },
      data: { lastLoginAt: now },
    });

    req.user = session.user;
    req.session = session;
    return true;
  }
}
