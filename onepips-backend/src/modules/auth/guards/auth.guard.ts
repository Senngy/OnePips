import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth.js';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import { UserStatus } from '../../../../generated/prisma/client.js';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly prisma: PrismaService,) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const requestId = req.requestId ?? 'req_unknown';

    this.logger.debug({
      message: '🔑 AuthGuard: Auth Check for request:',
      reqId: requestId,
      method: req.method,
      path: req.originalUrl,
    });

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      this.logger.warn({
        message: '❌ AuthGuard: No session found for request:',
        reqId: requestId,
        method: req.method,
        path: req.originalUrl,
      });
      throw new UnauthorizedException('[API] auth/guards/auth.guard.ts | 401 - Utilisateur non authentifié ❌');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      this.logger.warn({
        message: '❌ AuthGuard: User not found for session:',
        reqId: requestId,
        method: req.method,
        path: req.originalUrl,
      });
      throw new UnauthorizedException('[API] auth/guards/auth.guard.ts | 404 - Utilisateur non trouvé ❌');
      }
      
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.warn({
          message: 'Inactive user attempted authenticated request',
          requestId,
          userId: user.id,
          status: user.status,
        });

        throw new UnauthorizedException(
          'Utilisateur non autorisé.',
        );
      }

    const now = new Date();

    // 🔐 Mettre à jour lastLoginAt pour tracker l'activité
    await this.prisma.session.update({
      where: { id: session.session.id },
      data: { lastLoginAt: now },
    });

    req.user = user;
    req.session = session.session;

    this.logger.debug({
      message: '✅ AuthGuard: Authenticated user:',
      reqId: requestId,
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.session.id,
      sessionExpiresAt: session.session.expiresAt,
    });

    return true;
  }
}
