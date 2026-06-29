import { api } from "../api-client";


export type LeadDto = {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
    interests?: string[];
    tradingYears?: number;
    budgetFormation?: number;
    budgetTrading?: number;
    markets?: string[];
    accountType?: string[];
    createdAt?: string;
    updatedAt?: string;
    _count?: {
        applications: number;
        bookings: number;
        payments: number;
        events: number;
    };
}

export type CreateLeadDto = {
    name: string;
    email: string;
    phone?: string;
    source?: string;
    cfTurnstileToken?: string;
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

export const createLead = async (data: CreateLeadDto) => {
    console.log("[Leads Service] Lead created (data sent):", data);
    const apiCall = await api("/leads", {
        method: "POST",
        body: JSON.stringify(data),
    });
    console.log("[Leads Service] Lead created:", apiCall);
    
    return apiCall;
};

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
    const total = res.meta.total;
    const page = res.meta.page;
    const lastPage = res.meta.lastPage;
    return { leads, total, page, lastPage };
};

export const getLeadById = async (id: string) => api(`/leads/${id}`);

export const updateLeadStatus = async (id: string, status: string) =>
    api(`/leads/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const deleteLead = async (id: string) =>
    api(`/leads/${id}`, {
        method: "DELETE",
    });

export const deleteBulkLeads = async (ids: string[]) =>
    api("/leads/bulk", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
    });

