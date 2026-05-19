import { api } from "../api-client";

// --- DTOs ---

// Result Models
export interface ResultDto {
    id: string;
    title: string;
    image: string;
    gain: number;
    pair: string;
    description?: string;
    date: string;
    isVisible: boolean;
    createdAt: string;
}

export interface CreateResultDto {
    title: string;
    image: string;
    gain: number;
    pair: string;
    description?: string;
    date: string;
    isVisible?: boolean;
}

export interface UpdateResultDto {
    title?: string;
    image?: string;
    gain?: number;
    pair?: string;
    description?: string;
    date?: string;
    isVisible?: boolean;
}

// Testimonial Models
export interface TestimonialDto {
    id: string;
    name: string;
    role: string;
    rating: number;
    content: string;
    isVisible: boolean;
    createdAt: string;
}

export interface CreateTestimonialDto {
    name: string;
    role: string;
    rating: number;
    content: string;
    isVisible?: boolean;
}

export interface UpdateTestimonialDto {
    name?: string;
    role?: string;
    rating?: number;
    content?: string;
    isVisible?: boolean;
}

// CommunityStat Models
export interface CommunityStatDto {
    id: string;
    label: string;
    value: number;
}

export interface UpdateCommunityStatDto {
    label?: string;
    value?: number;
}

// --- API Calls ---

// Results
export const getResults = async (): Promise<ResultDto[]> => {
    return api("/community/results");
};

export const createResult = async (data: CreateResultDto): Promise<ResultDto> => {
    return api("/community/results", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateResult = async (id: string, data: UpdateResultDto): Promise<ResultDto> => {
    return api(`/community/results/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const deleteResult = async (id: string): Promise<void> => {
    return api(`/community/results/${id}`, {
        method: "DELETE",
    });
};

// Testimonials
export const getTestimonials = async (): Promise<TestimonialDto[]> => {
    return api("/community/testimonials");
};

export const createTestimonial = async (data: CreateTestimonialDto): Promise<TestimonialDto> => {
    return api("/community/testimonials", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const updateTestimonial = async (id: string, data: UpdateTestimonialDto): Promise<TestimonialDto> => {
    return api(`/community/testimonials/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    return api(`/community/testimonials/${id}`, {
        method: "DELETE",
    });
};

// Community Stats
export const getCommunityStats = async (): Promise<CommunityStatDto[]> => {
    return api("/community/stats");
};

export const updateCommunityStat = async (id: string, data: UpdateCommunityStatDto): Promise<CommunityStatDto> => {
    return api(`/community/stats/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};
