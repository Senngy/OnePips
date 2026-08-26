import {
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Permission } from '../../../../generated/prisma/client.js';

export class PermissionOverrideDto {
  @IsEnum(Permission)
  permission!: Permission;

  @IsBoolean()
  granted!: boolean;
}

export class UpdatePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionOverrideDto)
  permissions!: PermissionOverrideDto[];
}