import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class TestimonialDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  role: string = 'Member';

  @IsOptional()
  @IsNumber()
  rating?: number = 0;

  @IsString()
  content?: string = '';

  @IsBoolean()
  isVisible?: boolean = true;
}
