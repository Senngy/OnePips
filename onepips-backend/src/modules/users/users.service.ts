import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomBytes, createHash } from 'node:crypto';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { Role } from '../../../generated/prisma/client.js';
import type { User, UserPermission } from '../../../generated/prisma/client.js';
import { PermissionsService } from '../permissions/permissions.service.js';
import { PermissionOverrideDto } from '../permissions/dto/permissions.dto.js';
import { auth } from '../auth/auth.js';
import { EmailService } from '../email/email.service.js';
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { CompleteInvitationDto } from './dto/complete-invitation.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private permissionsService: PermissionsService,
    private emailService: EmailService,
  ) { }

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
        effectivePermissions:
          await this.permissionsService.getEffectivePermissions(user.id),
      })),
    );
  }

  async findOne(id: string, currentUser: User) {
    const targetUser = await this.prisma.user.findUnique({
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

    if (!targetUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur non trouvé'
      });
    }

    if (
      targetUser?.role === Role.SUPER_ADMIN &&
      currentUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException({
        code: 'ADMIN_IS_NOT_AUTHORIZED',
        message: 'Vous nous pouvez pas accéder à cette requête'
      });
    }

    return targetUser;
  }

  async createInvitation(dto: CreateInvitationDto) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException({
        code: 'ADMIN_INVITATION_EMAIL_EXISTS',
        message: 'Un utilisateur avec cet email existe déjà.',
      });
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 heures

    // Le rôle est imposé par le backend : une invitation crée toujours un ADMIN.
    const invitation = await this.prisma.adminInvitation.create({
      data: {
        email: dto.email,
        role: Role.ADMIN,
        tokenHash,
        expiresAt,
      },
    });

    const invitationUrl = `${process.env.FRONT_URL || 'http://localhost:3000'}/admin/invitation?token=${token}`;
    void this.emailService
      .send({
        to: dto.email,
        subject: 'Invitation à rejoindre OnePips Admin',
        text: `Vous avez été invité à rejoindre l'espace admin OnePips. Définissez votre mot de passe ici : ${invitationUrl}`,
      })
      .catch(() => {
        // Envoi non bloquant : l'invitation reste valide même si l'email échoue.
        // Ne jamais logger le token ni les détails SMTP.
        console.error(
          "[invitation] Échec de l'envoi de l'email d'invitation.",
        );
      });

    return {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    };
  }

  async completeInvitation(token: string, dto: CompleteInvitationDto) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const invitation = await this.prisma.adminInvitation.findUnique({
      where: { tokenHash },
    });

    if (!invitation) {
      throw new NotFoundException({
        code: 'ADMIN_INVITATION_NOT_FOUND',
        message: 'Invitation introuvable.',
      });
    }

    if (invitation.consumedAt) {
      throw new BadRequestException({
        code: 'ADMIN_INVITATION_ALREADY_USED',
        message: 'Cette invitation a déjà été utilisée.',
      });
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'ADMIN_INVITATION_EXPIRED',
        message: "L'invitation a expiré.",
      });
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: invitation.email },
    });
    if (existingUser) {
      throw new ConflictException({
        code: 'ADMIN_INVITATION_EMAIL_EXISTS',
        message: 'Un utilisateur avec cet email existe déjà.',
      });
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        password: dto.password,
        name: dto.name ?? invitation.email,
      },
    });

    if (!result.user) {
      throw new InternalServerErrorException({
        code: 'ADMIN_INVITATION_CREATE_FAILED',
        message: 'Création du compte impossible.',
      });
    }

    const user = await this.prisma.user.update({
      where: { id: result.user.id },
      data: {
        role: invitation.role,
        // L'invitation, reçue par email, vaut validation de l'adresse.
        emailVerified: true,
      },
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

    await this.prisma.adminInvitation.update({
      where: { id: invitation.id },
      data: { consumedAt: new Date() },
    });

    return user;
  }

  async updateRole(
    targetUserId: string,
    newRole: Role,
    currentUser: User,
  ): Promise<User> {

    if (newRole === 'SUPER_ADMIN') {
      throw new ForbiddenException('Promotion non authorisé');
    }
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

    if (
      targetUser.role === 'SUPER_ADMIN' &&
      currentUser.role !== 'SUPER_ADMIN'
    ) {
      throw new ForbiddenException(
        'Vous ne pouvez pas modifier le rôle du SUPER_ADMIN.',
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
    requestedOverrides: PermissionOverrideDto[],
    currentUser: User,
  ) {
    const targetUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    if (targetUser.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException({
        code: 'USER_TARGET_FORBIDDEN',
        message: 'Les permissions d’un SUPER_ADMIN ne peuvent pas être modifiées.',
      });
    }

    if (targetUser.id === currentUser.id) {
      throw new ForbiddenException({
        code: 'SELF_PERMISSION_MODIFICATION_FORBIDDEN',
        message: 'Vous ne pouvez pas modifier vos propres permissions.',
      });
    }
    const currentOverrides = await this.permissionsService.getUserOverrides(targetUser.id);

    const candidate = this.permissionsService.buildCandidateEffectivePermissions(
      targetUser,
      currentOverrides,
      requestedOverrides,
    );

    this.permissionsService.validatePermissionDependencies(candidate);

    await this.prisma.$transaction(
      requestedOverrides.map((override) =>
        this.prisma.userPermission.upsert({
          where: {
            userId_permission: {
              userId,
              permission: override.permission,
            },
          },
          update: {
            granted: override.granted,
          },
          create: {
            userId,
            permission: override.permission,
            granted: override.granted,
          },
        }),
      ),
    );

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