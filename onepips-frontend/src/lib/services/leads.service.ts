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

export type UpdateLeadDto = {
    name?: string;
    phone?: string;
    interests?: string[];
    tradingYears?: number;
    budgetFormation?: number;
    budgetTrading?: number;
    markets?: string[];
    accountType?: string[];
};

export type GetLeadsParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    score?: string;
    interest?: string;
    tradingYears?: string;
    createdAt?: string;
    minScore?: string;
    maxScore?: string;
};

export const createLead = async (data: CreateLeadDto) =>
    api("/leads", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateLead = async (id: string, data: UpdateLeadDto) =>
    api(`/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });

export const getLeads = async (params: GetLeadsParams = {}) => {
    // Filter out undefined/empty values before building query string
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null)
    );
    const query = new URLSearchParams(cleanParams as Record<string, string>).toString();
    const res = await api(`/leads${query ? `?${query}` : ""}`);
    const leads = res.data;
    return leads;
};

export const getLeadById = async (id: string) => api(`/leads/${id}`);

