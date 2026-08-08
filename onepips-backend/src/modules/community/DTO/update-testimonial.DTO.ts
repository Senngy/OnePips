import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateTestimonialDto {
  name?: string;
  email?: string;
}
