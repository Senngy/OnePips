import { api } from "../api-client";

export interface EventStateDto {
    hasEvent: boolean;
    nextEvent: {
        id: string;
        name?: string;
        description?: string;
        startsAt: string;
    } | null;
}

export const getEventState = async (): Promise<EventStateDto> => {
    return api("/events/state");
};

