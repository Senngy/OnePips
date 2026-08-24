import { api } from "../api-client";
import type { Lead } from "./leads.service";

export type DirectApplicationPayload = {
    name: string;
    email: string;
    phone?: string;
    tradingYears?: number;
    interests?: string[];
    budgetFormation?: number;
    budgetTrading?: number;
    markets?: string[];
    accountType?: string[];
    source?: string;
    cfTurnstileToken?: string;
};

export type ApplicationAnswers = {
    name: string;
    email: string;
    phone?: string;
    tradingYears?: number;
    interests?: string[];
    budgetFormation?: number;
    budgetTrading?: number;
    markets?: string[];
    accountType?: string[];
};

export type ApplicationDto = {
    leadId: string;
    answers: ApplicationAnswers;
    interests?: string[];
    budgetFormation?: number;
    capitalTrading?: number;
    tradingYears?: number;
    status?: string;
    score?: number;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
    lead?: any;
    name?: string;
    email?: string;
};

export const createApplication = (data: ApplicationDto) =>
    api<ApplicationDto>("/applications", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getApplications = () => api<ApplicationDto[]>("/applications");

export const updateApplicationStatus = (id: string, status: string) =>
    api<ApplicationDto>(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const createDirectApplication = (data: DirectApplicationPayload) =>
    api<{ lead: Lead; application: ApplicationDto }>("/applications/direct", {
        method: "POST",
        body: JSON.stringify(data),
    });
