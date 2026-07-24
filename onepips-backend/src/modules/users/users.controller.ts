import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { User } from '../../../generated/prisma/client.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Mettre à jour le rôle d'un utilisateur
   * 
   * SÉCURITÉ CRITIQUE:
   * - Seul un ADMIN peut accéder
   * - Un ADMIN ne peut JAMAIS promouvoir en SUPER_ADMIN
   * - Seul un SUPER_ADMIN peut promouvoir en SUPER_ADMIN
   * 
   * @route PATCH /api/users/:id
   * @body { role: "USER" | "ADMIN" | "SUPER_ADMIN" }
   * @returns user
   */
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRole(
    @Param('id') userId: string,
    @Body('role') newRole: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.usersService.updateRole(
      userId,
      newRole as any,
      currentUser,
    );
  }
}
