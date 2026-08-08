import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class EventCreateDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsBoolean()
  isCanceled?: boolean;
}
