import { IsString, IsOptional, IsArray, IsObject, IsUUID, IsInt } from 'class-validator';

export class CreateApplicationDto {
    @IsUUID()
    leadId: string;

    @IsObject()
    answers: any;

    @IsOptional()
    @IsArray()
    interests?: string[];

    @IsOptional()
    @IsInt()
    budgetFormation?: number;

    @IsOptional()
    @IsInt()
    capitalTrading?: number;
}
