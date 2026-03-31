import { api } from "../api-client";

export type ApplicationDto = {
    leadId: string;
    answers: any;
    interests?: string[];
    budgetFormation?: number;
    capitalTrading?: number;
};

export const createApplication = (data: ApplicationDto) =>
    api("/applications", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const getApplications = () => api("/applications");
