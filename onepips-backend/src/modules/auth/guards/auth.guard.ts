import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth.js';
import { PrismaService } from '../../../../prisma/prisma.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(
      '🔑 AuthGuard: Checking authentication for request:',
      req.method,
      req.originalUrl,
    );

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      console.error(
        '[API] auth/guards/auth.guard.ts | !session | 401 - Utilisateur non authentifié ❌ ', req.method, req.originalUrl, 'Headers:', req.headers,
      );
      throw new UnauthorizedException('[API] auth/guards/auth.guard.ts | 401 - Utilisateur non authentifié ❌');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      console.error(
        '[API] auth/guards/auth.guard.ts | 404 - Utilisateur non trouvé ❌',
        req.method,
        req.originalUrl,
        'Headers:',
        req.headers,
      );
      throw new UnauthorizedException('[API] auth/guards/auth.guard.ts | 404 - Utilisateur non trouvé ❌');
    }

    const now = new Date();

    // 🔐 Mettre à jour lastLoginAt pour tracker l'activité
    await this.prisma.session.update({
      where: { id: session.session.id },
      data: { lastLoginAt: now },
    });

    req.user = user;
    req.session = session.session;

    console.log('✅ AuthGuard: Authenticated user:', {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.session.id,
      sessionExpiresAt: session.session.expiresAt,
    });

    return true;
  }
}
