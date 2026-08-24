import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../../generated/prisma/client.js';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { PermissionsService } from '../permissions.service.js';
import type { Permission } from '../../../../generated/prisma/client.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(`[API] permissions/guards/.. | Required permissions for ${context.getClass().name}.${context.getHandler().name}:`, requiredPermissions,
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;
    console.log(
      `[API] permissions/guards/permissions.guard.ts | Request: ${request.method} ${request.originalUrl} | User: ${user?.name || 'Unknown'} | Required permissions: ${requiredPermissions}`,
    );
    console.log(
      `[API] permissions/guards/permissions.guard.ts | User ${user?.name || 'Unknown'} is attempting to access ${context.getClass().name}.${context.getHandler().name}`,
    );

    if (!user) {
      console.error(
        '[API] permissions/guards/permissions.guard.ts | 401 - ', request.user, 'Headers:', request.headers,
      );
      throw new UnauthorizedException('[API] permissions/guards/.. | 401 - Utilisateur non authentifié');
    }

    if(!user.role) {
      console.error(
        '[API] permissions/guards/permissions.guard.ts | 403 - ', request.user, 'Headers:', request.headers,
      );
      throw new ForbiddenException('[API] permissions/guards/.. | 403 - Utilisateur sans rôle défini');
    }

    if (user.role === Role.SUPER_ADMIN) {
      console.log(
        `[API] permissions/guards/permissions.guard.ts | User infos : ${user.name} is SUPER_ADMIN, granting access to ${context.getClass().name}.${context.getHandler().name}`,
      );
      return true;
    }

    const hasAll = await this.permissionsService.hasPermissions(
      user.id,
      requiredPermissions,
    );

    if (!hasAll) {
      console.error(
        `[API] permissions/guards/permissions.guard.ts | User infos : ${user.name} does not have all required permissions for ${context.getClass().name}.${context.getHandler().name}`,
      );
      throw new ForbiddenException('[API] permissions/guards/.. | 403 - Permission insuffisante');
    }

    console.log(
      `[API] permissions/guards/permissions.guard.ts | User infos : ${user.name} has all required permissions for ${context.getClass().name}.${context.getHandler().name}`,
    );

    return true;
  }
}

