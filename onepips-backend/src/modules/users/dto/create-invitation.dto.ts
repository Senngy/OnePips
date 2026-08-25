import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../../../generated/prisma/client.js';

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(Role)
  role: Role;
}
