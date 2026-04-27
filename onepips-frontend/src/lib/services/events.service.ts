import { api } from "../api-client";

// A single event entity returned by the API
export interface EventDto {
    id: string;
    title: string;
    description?: string;
    startsAt: string;
    isPublished?: boolean;
    isCanceled?: boolean;
    createdAt?: string;
    updatedAt?: string;
    participants?: string[];
}

// The payload sent when creating a new event
export interface CreateEventDto {
    title: string;
    description?: string;
    startsAt: string;
}

// The response shape of /events/state
export interface EventStateDto {
    hasEvent: boolean;
    nextEvent: EventDto | null;
}

export const getEvents = async (): Promise<EventDto[]> => {
    return api("/events");
};

export const getEventState = async (): Promise<EventStateDto> => {
    return api("/events/state");
};

export const getEventById = async (id: string): Promise<EventDto> => {
    return api(`/events/${id}`);
};

export const createEvent = async (event: CreateEventDto): Promise<EventDto> => {
    return api("/events", {
        method: "POST",
        body: JSON.stringify(event),
    });
};
