import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class EventUpdateDto {
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startsAt?: string;

}