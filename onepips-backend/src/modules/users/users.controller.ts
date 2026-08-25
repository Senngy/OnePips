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
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { CompleteInvitationDto } from './dto/complete-invitation.dto.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { PermissionsGuard } from '../permissions/guards/permissions.guard.js';
import { Permissions } from '../permissions/decorators/permissions.decorator.js';
import { Permission, Role } from '../../../generated/prisma/client.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { User } from '../../../generated/prisma/client.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_MANAGE)
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

  @Get('permissions')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_MANAGE)
  async findAllWithPermissions() {
    return this.usersService.findAllWithPermissions();
  }

  @Get(':id')
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.USERS_READ)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateRole(
    @Param('id') userId: string,
    @Body('role') newRole: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateRole(userId, newRole as any, currentUser);
  }

  @Patch(':id/permissions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updatePermissions(
    @Param('id') userId: string,
    @Body('permissions')
    permissions: { permission: string; granted: boolean }[],
  ) {
    return this.usersService.updatePermissions(userId, permissions);
  }

  @Delete(':id/permissions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async resetPermissions(@Param('id') userId: string) {
    return this.usersService.resetPermissions(userId);
  }
}
