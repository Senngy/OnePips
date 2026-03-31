"use client";
import { useState, useEffect } from "react";
import { getApplications } from "@/lib/services/applications.service";

export default function ApplicantTable() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await getApplications();
                setApplicants(response);
            } catch (e) {
                console.error(e);
                setError(e as any);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);
    return (
        <div>
            <h1>Applicant Table</h1>
        </div>
    );
}