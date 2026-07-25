import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { User, Role } from '../../../generated/prisma/client.js';
import { PermissionsService } from '../permissions/permissions.service.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private permissionsService: PermissionsService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAllWithPermissions() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          select: {
            permission: true,
            granted: true,
          },
        },
      },
    });

    return Promise.all(
      users.map(async (user) => ({
        ...user,
        effectivePermissions: await this.permissionsService.getEffectivePermissions(user.id),
      })),
    );
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(
    targetUserId: string,
    newRole: Role,
    currentUser: User,
  ): Promise<User> {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (currentUser.id === targetUserId) {
      throw new BadRequestException(
        'Vous ne pouvez pas modifier votre propre rôle',
      );
    }

    if (newRole === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Seul un SUPER_ADMIN peut promouvoir en SUPER_ADMIN',
      );
    }

    if (
      targetUser.role === 'SUPER_ADMIN' &&
      newRole !== 'SUPER_ADMIN' &&
      currentUser.role !== 'SUPER_ADMIN'
    ) {
      throw new ForbiddenException(
        'Seul un SUPER_ADMIN peut rétrograder le SUPER_ADMIN',
      );
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updatePermissions(
    userId: string,
    overrides: { permission: string; granted: boolean }[],
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    for (const override of overrides) {
      await this.prisma.userPermission.upsert({
        where: {
          userId_permission: {
            userId,
            permission: override.permission as any,
          },
        },
        update: { granted: override.granted },
        create: {
          userId,
          permission: override.permission as any,
          granted: override.granted,
        },
      });
    }

    return { success: true };
  }

  async resetPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.userPermission.deleteMany({
      where: { userId },
    });

    return { success: true };
  }
}
