import { Global, Module } from '@nestjs/common';
import { EmailService, emailService } from './email.service.js';

@Global()
@Module({
  providers: [{ provide: EmailService, useValue: emailService }],
  exports: [EmailService],
})
export class EmailModule {}
