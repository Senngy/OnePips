import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { PermissionsService } from '../permissions/permissions.service.js';
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { CompleteInvitationDto } from './dto/complete-invitation.dto.js';
import { UpdateUserStatusDto } from './dto/user-status.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission, Role, UserStatus } from '../../../generated/prisma/client.js';
import { UpdatePermissionsDto } from '../permissions/dto/permissions.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { User } from '../../../generated/prisma/client.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) { }

  @Get()
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.USERS_READ)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('invitations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createInvitation(@Body() dto: CreateInvitationDto) {
    return this.usersService.createInvitation(dto);
  }

  @Post('invitations/:token/complete')
  async completeInvitation(
    @Param('token') token: string,
    @Body() dto: CompleteInvitationDto,
  ) {
    return this.usersService.completeInvitation(token, dto);
  }

  // → gestion de tous les users + overrides
  // → utilisé par SUPER_ADMIN et ADMIN si autorisé dans Users
  @Get('permissions')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.ADMINS_MANAGE)
  async findAllWithPermissions() {
    return this.usersService.findAllWithPermissions();
  }

  // permissions effectives du current user
  // utilisé par usePermissions / navigation / actions
  @Get('me/permissions')
  @UseGuards(AuthGuard)
  async getMyPermissions(@CurrentUser() currentUser: User) {
    return {
      effectivePermissions:
        await this.permissionsService.getEffectivePermissions(currentUser.id),
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.ADMINS_MANAGE)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.findOne(id, currentUser);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.ROLES_MANAGE)
  async updateRole(
    @Param('id') userId: string,
    @Body('role') newRole: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateRole(userId, newRole as any, currentUser);
  }

  @Patch(':id/permissions')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.ADMINS_MANAGE)
  async updatePermissions(
    @Param('id') userId: string,
    @Body() dto: UpdatePermissionsDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updatePermissions(userId, dto.permissions, currentUser);
  }

  @Delete(':id/permissions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async resetPermissions(@Param('id') userId: string) {
    return this.usersService.resetPermissions(userId);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Permissions(Permission.ADMINS_MANAGE)
  async updateStatus(
    @Param('id') userId: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateStatus(
      userId,
      dto.status,
      currentUser,
    );
  }
}
