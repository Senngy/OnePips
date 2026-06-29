import { IsEmail, IsOptional, IsString, IsArray, IsInt } from 'class-validator';
import { InterestType, MarketType, AccountType } from '../../../../prisma/index.js';

export class CreateDirectApplicationDto {
    @IsOptional()
    @IsString()
    cfTurnstileToken?: string;

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
    @IsInt()
    tradingYears?: number;

    @IsOptional()
    @IsArray()
    interests?: InterestType[];

    @IsOptional()
    @IsInt()
    budgetFormation?: number;

    @IsOptional()
    @IsInt()
    budgetTrading?: number;

    @IsOptional()
    @IsArray()
    markets?: MarketType[];

    @IsOptional()
    @IsArray()
    accountType?: AccountType[];
}
