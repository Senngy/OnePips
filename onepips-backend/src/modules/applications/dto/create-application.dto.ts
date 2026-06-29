import { IsString, IsOptional, IsArray, IsObject, IsUUID, IsInt } from 'class-validator';
import { InterestType } from '../../../../prisma/index.js';

export class CreateApplicationDto {
    @IsUUID()
    leadId: string;

    @IsObject()
    answers: any;

    @IsOptional()
    @IsArray()
    interests?: InterestType[];

    @IsOptional()
    @IsInt()
    budgetFormation?: number;

    @IsOptional()
    @IsInt()
    capitalTrading?: number;
}
