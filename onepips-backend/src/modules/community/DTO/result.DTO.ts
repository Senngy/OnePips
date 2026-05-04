import { IsString, IsNumber, IsOptional } from "class-validator";

export class ResultDto {

  @IsString()
  title: string = '';

  @IsString()
  image: string = '';

  @IsNumber({ maxDecimalPlaces: 2 })
  gain: number = 0;

  @IsString()
  content: string = '';

  @IsOptional()
  isVisible?: boolean;
}