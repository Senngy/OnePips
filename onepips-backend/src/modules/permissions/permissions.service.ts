import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Permission, Role } from '../../../generated/prisma/client.js';
import type { UserPermission } from '../../../generated/prisma/client.js';
import { ROLE_PERMISSIONS } from './role-permissions.js';

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
