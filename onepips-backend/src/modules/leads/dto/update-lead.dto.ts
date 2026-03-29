import { IsOptional, IsArray, IsInt, IsString } from 'class-validator';

export class UpdateLeadDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsArray()
    interests?: ('PRIVATE_COACHING' | 'SIGNALS' | 'LIVES_SUBSCRIPTION' | 'ONE_TO_ONE')[];

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
