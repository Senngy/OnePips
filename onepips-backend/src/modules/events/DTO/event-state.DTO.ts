import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class EventStateDto {
  @IsBoolean()
  hasEvent: boolean = false;

  @IsOptional()
  @IsObject()
  nextEvent?: any;
}
