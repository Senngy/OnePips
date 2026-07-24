import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import type { User, Role } from '../../../generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  /**
   * Mettre à jour le rôle d'un utilisateur
   * 
   * SÉCURITÉ CRITIQUE:
   * - Un ADMIN ne peut JAMAIS promouvoir quelqu'un en SUPER_ADMIN
   * - Seul un SUPER_ADMIN peut donner/retirer le rôle SUPER_ADMIN
   * 
   * @param targetUserId - L'utilisateur à modifier
   * @param newRole - Le nouveau rôle
   * @param currentUser - L'utilisateur qui effectue la modification
   */
  async updateRole(
    targetUserId: string,
    newRole: Role,
    currentUser: User,
  ): Promise<User> {
    // Vérification 1: L'utilisateur existe
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérification 2: On ne peut pas modifier son propre rôle
    if (currentUser.id === targetUserId) {
      throw new BadRequestException(
        'Vous ne pouvez pas modifier votre propre rôle',
      );
    }

    // Vérification 3 (CRITIQUE): Interdire la promotion vers SUPER_ADMIN
    if (newRole === 'SUPER_ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Seul un SUPER_ADMIN peut promouvoir en SUPER_ADMIN',
      );
    }

    // Vérification 4: Interdire la rétrogradation du SUPER_ADMIN
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
}}
