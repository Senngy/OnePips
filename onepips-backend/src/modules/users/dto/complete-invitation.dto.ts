import { IsOptional, IsString, MinLength } from 'class-validator';

export class CompleteInvitationDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
