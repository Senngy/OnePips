import { IsString, IsOptional, IsArray, IsObject, IsInt } from 'class-validator';

export class UpdateApplicationDto {
    @IsOptional()
    @IsObject()
    answers?: any;

    @IsOptional()
    @IsArray()
    interests?: string[];

    @IsOptional()
    @IsInt()
    budgetFormation?: number;

    @IsOptional()
    @IsInt()
    capitalTrading?: number;

    @IsOptional()
    @IsInt()
    tradingYears?: number;
}
