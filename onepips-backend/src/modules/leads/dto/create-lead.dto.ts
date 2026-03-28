import { IsEmail, IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsArray()
    interests?: ('COURS' | 'SIGNAUX' | 'ACCOMPAGNEMENT' | 'ONE_TO_ONE')[];

    @IsOptional()
    @IsInt()
    tradingYears?: number;

    @IsOptional()
    @IsInt()
    budgetFormation?: number;

    @IsOptional()
    @IsInt()
    budgetTrading?: number;

    @IsOptional()
    @IsArray()
    markets?: ('CFD' | 'CRYPTO' | 'FUTURES')[];

    @IsOptional()
    @IsArray()
    accountType?: ('PERSONAL' | 'DEMO' | 'PROPFIRM')[];
}