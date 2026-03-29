import { api } from "../api-client";

export type CreateApplicationDto = {
    leadId: string;
    answers: any;
    interests?: string[];
    budgetFormation?: number;
    capitalTrading?: number;
};

export const createApplication = (data: CreateApplicationDto) =>
    api("/applications", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getApplications = () => api("/applications");
