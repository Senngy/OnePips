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

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    const hasAll = await this.permissionsService.hasPermissions(
      user.id,
      requiredPermissions,
    );

    if (!hasAll) {
      throw new ForbiddenException('Permission insuffisante');
    }

    return true;
  }
}
