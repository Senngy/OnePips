// hooks/useLeads.ts
import { useEffect, useState } from "react";
import { getLeads, GetLeadsParams } from "@/lib/services/leads.service";

export function useLeads(params: GetLeadsParams = {}) {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getLeads(params)
            .then((data) => {
                // Guard: ensure we always set an array
                setLeads(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("[useLeads] fetch error:", err);
                setError(err);
                setLeads([]);
            })
            .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    return { leads, isLoading, error };
}