import { api } from "../api-client";
import { LeadDto } from "./leads.service";

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
    _count?: {
        participants: number;
    };
}

// The payload sent when creating a new event
export interface CreateEventDto {
    title: string;
    description?: string;
    startsAt: string;
}

export interface UpdateEventDto {
    id: string;
    title?: string;
    description?: string;
    startsAt?: string;
    isPublished?: boolean;
    isCanceled?: boolean;
}

// The response shape of /events/state
export interface EventStateDto {
    hasEvent: boolean;
    nextEvent: EventDto | null;
}

export class AddParticipantDto {
    name?: string;
    email?: string;
    phone?: string;
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

export const getEventParticipants = async (eventId: string): Promise<LeadDto[]> => {
    return api(`/events/${eventId}/participants`);
}

export const createEvent = async (event: CreateEventDto): Promise<EventDto> => {
    return api("/events", {
        method: "POST",
        body: JSON.stringify(event),
    });
};

export const updateEvent = async (event: UpdateEventDto): Promise<EventDto> => {
    return api(`/events/${event.id}`, {
        method: "PATCH",
        body: JSON.stringify(event),
    });
}

export const addParticipantToEvent = async (eventId: string, participant: AddParticipantDto) => {
    return api(`/events/${eventId}/register`, {
        method: "POST",
        body: JSON.stringify(participant),
    });
}

export const cancelEvent = async (eventId: string): Promise<EventDto> => {
    return api(`/events/${eventId}/cancel`, {
        method: "PATCH",
    });
}

export const publishEvent = async (eventId: string): Promise<EventDto> => {
    return api(`/events/${eventId}/publish`, {
        method: "PATCH",
    });
}






