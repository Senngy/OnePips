import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../../../generated/prisma/client.js';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
