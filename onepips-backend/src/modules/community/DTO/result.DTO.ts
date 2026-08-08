import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class ResultDto {
  @IsString()
  title: string = '';

  @IsString()
  image: string = '';

  @IsNumber({ maxDecimalPlaces: 2 })
  gain: number = 0;

  @IsString()
  pair: string = '';

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string = new Date().toISOString();

  @IsOptional()
  isVisible?: boolean;
}
