import { api } from "../api-client";

export type CreateLeadDto = {
    name: string;
    email: string;
    phone?: string;
    source?: string;
    interests?: string[];
    tradingYears?: number;
    budgetFormation?: number;
    budgetTrading?: number;
    markets?: string[];
    accountType?: string[];
};

export const createLead = (data: CreateLeadDto) =>
    api("/leads", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getLeads = () => api("/leads");
export const getLeadById = (id: string) => api(`/leads/${id}`);
