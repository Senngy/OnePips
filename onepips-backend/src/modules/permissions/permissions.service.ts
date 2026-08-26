import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Permission, Role } from '../../../generated/prisma/client.js';
import type { User, UserPermission } from '../../../generated/prisma/client.js';
import { ROLE_PERMISSIONS } from './role-permissions.js';

type PermissionOverride = {
  permission: Permission;
  granted: boolean;
};

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  getRolePermissions(role: Role): Permission[] {
    return ROLE_PERMISSIONS[role] ?? [];
  }

  async getUserOverrides(userId: string): Promise<UserPermission[]> {
    return this.prisma.userPermission.findMany({
      where: { userId },
    });
  }

  async getEffectivePermissions(userId: string): Promise<Permission[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.SUPER_ADMIN) {
      return Object.values(Permission);
    }

    const rolePermissions = new Set(this.getRolePermissions(user.role));

    const overrides = await this.getUserOverrides(userId);

    for (const override of overrides) {
      if (override.granted) {
        rolePermissions.add(override.permission);
      } else {
        rolePermissions.delete(override.permission);
      }
    }

    return [...rolePermissions];
  }

  validatePermissionDependencies(
    permissions: Set<Permission>,
  ): void {
    const dependencies: Array<
      [Permission, Permission]
    > = [
      // Leads
      [Permission.LEADS_WRITE, Permission.LEADS_READ],
      [Permission.LEADS_DELETE, Permission.LEADS_READ],

      // Applications
      [Permission.APPLICATIONS_WRITE, Permission.APPLICATIONS_READ],

      // Bookings
      [Permission.BOOKINGS_WRITE, Permission.BOOKINGS_READ],

      // Payments
      [Permission.PAYMENTS_WRITE, Permission.PAYMENTS_READ],

      // Events
      [Permission.EVENTS_WRITE, Permission.EVENTS_READ],
      [Permission.EVENTS_DELETE, Permission.EVENTS_READ],

      // Community
      [Permission.COMMUNITY_WRITE, Permission.COMMUNITY_READ],
    ];

    for (const [permission, requiredPermission] of dependencies) {
      if (
        permissions.has(permission) &&
        !permissions.has(requiredPermission)
      ) {
        throw new BadRequestException({
          code: 'PERMISSION_DEPENDENCY_VIOLATION',
          message: `La permission ${permission} nécessite ${requiredPermission}.`,
          details: {
            permission,
            requiredPermission,
          },
        });
      }
    }
  }

  buildCandidateEffectivePermissions(
    user: User,
    currentOverrides: UserPermission[],
    requestedOverrides: PermissionOverride[],
  ): Set<Permission> {
    const effectivePermissions = new Set(
      this.getRolePermissions(user.role),
    );

    // État actuel des overrides
    for (const override of currentOverrides) {
      if (override.granted) {
        effectivePermissions.add(override.permission);
      } else {
        effectivePermissions.delete(override.permission);
      }
    }

    // État demandé
    for (const override of requestedOverrides) {
      if (override.granted) {
        effectivePermissions.add(override.permission);
      } else {
        effectivePermissions.delete(override.permission);
      }
    }

    return effectivePermissions;
  }

  async hasPermission(
    userId: string,
    permission: Permission,
  ): Promise<boolean> {
    const permissions = await this.getEffectivePermissions(userId);
    return permissions.includes(permission);
  }

  async hasPermissions(
    userId: string,
    permissions: Permission[],
  ): Promise<boolean> {
    const effectivePermissions = await this.getEffectivePermissions(userId);
    return permissions.every((p) => effectivePermissions.includes(p));
  }
}
