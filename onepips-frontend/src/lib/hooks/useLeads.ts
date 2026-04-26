// hooks/useLeads.ts
import { useEffect, useState } from "react";
import { getLeads, GetLeadsParams } from "@/lib/services/leads.service";

export function useLeads(params: GetLeadsParams = {}) {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        console.log("[LOG] useLeads (useEffect) params:", params);

        getLeads(params)
            .then((data) => {
                console.log("[LOG] useLeads (useEffect) data:", data);
                // Guard: ensure we always set an array
                setLeads(Array.isArray(data.leads) ? data.leads : []);
                setTotal(data.total);
                setPage(data.page);
                setLastPage(data.lastPage);
            })
            .catch((err) => {
                console.error("[useLeads] fetch error:", err);
                setError(err);
                setLeads([]);
            })
            .finally(() => setIsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    console.log("[LOG] useLeads leads:", leads);
    console.log("[LOG] useLeads total:", total);
    console.log("[LOG] useLeads page:", page);
    console.log("[LOG] useLeads lastPage:", lastPage);

    return { leads, isLoading, error, total, page, lastPage };
}