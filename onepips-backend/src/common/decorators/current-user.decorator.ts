import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '../../../generated/prisma/client.js';

/**
 * Décorateur pour récupérer l'utilisateur courant
 * depuis la requête (attaché par AuthGuard)
 * 
 * Usage:
 * @Get()
 * @UseGuards(AuthGuard)
 * async getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
