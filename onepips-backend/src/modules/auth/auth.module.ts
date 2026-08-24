import { Module } from '@nestjs/common';
import { AuthController } from './index.js';
/*import { AuthController } from './auth.controller.js';*/

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
