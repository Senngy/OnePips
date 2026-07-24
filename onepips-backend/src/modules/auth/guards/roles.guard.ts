import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { Role } from '../../../../generated/prisma/client.js';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
  ) { }


  canActivate(
    context: ExecutionContext,
  ): boolean {


    /*
    |--------------------------------------------------------------------------
    | 1. Récupération des rôles requis par la route
    |--------------------------------------------------------------------------
    */

    const requiredRoles =
      this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );


    /*
    |--------------------------------------------------------------------------
    | 2. Si aucun rôle n'est demandé
    |--------------------------------------------------------------------------
    |
    | Exemple :
    |
    | @Get()
    |
    | Sans @Roles(...)
    |
    */

    if (
      !requiredRoles ||
      requiredRoles.length === 0
    ) {

      return true;

    }


    /*
    |--------------------------------------------------------------------------
    | 3. Récupération de l'utilisateur
    |--------------------------------------------------------------------------
    |
    | AuthGuard doit obligatoirement être exécuté avant ce guard.
    |
    */

    const request =
      context
        .switchToHttp()
        .getRequest();

    const user =
      request.user;


    if (!user) {

      throw new ForbiddenException(
        'Utilisateur non authentifié',
      );

    }


    /*
    |--------------------------------------------------------------------------
    | 4. SUPER_ADMIN = accès global
    |--------------------------------------------------------------------------
    */

    if (
      user.role === Role.SUPER_ADMIN
    ) {

      return true;

    }


    /*
    |--------------------------------------------------------------------------
    | 5. Vérification du rôle
    |--------------------------------------------------------------------------
    */

    const hasRequiredRole =
      requiredRoles.includes(user.role);


    if (!hasRequiredRole) {

      throw new ForbiddenException(
        'Permissions insuffisantes',
      );

    }


    return true;

  }

}
