import { useState, useEffect } from "react";
import { ApplicationDto, getApplications } from "../services/applications.service";

export const useApplicants = () => {
    const [applicants, setApplicants] = useState<ApplicationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await getApplications();
                console.log("[applicants service getApplicants, res: ", res);
                setApplicants(res);
                console.log("[applicants service getApplicants, applicants: ", applicants);
            } catch (error) {
                console.error("applicants service getApplicants, error: ", error);
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    return { applicants, isLoading, error };
}