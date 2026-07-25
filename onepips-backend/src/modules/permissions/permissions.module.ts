import { Global, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service.js';
import { PermissionsGuard } from './guards/permissions.guard.js';

@Global()
@Module({
  providers: [
    PermissionsService,
    PermissionsGuard,
  ],
  exports: [
    PermissionsService,
    PermissionsGuard,
  ],
})
export class PermissionsModule {}
