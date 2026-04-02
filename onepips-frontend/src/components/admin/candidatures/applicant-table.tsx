"use client";
import { useApplicants } from "@/lib/hooks/useApplicants";
import { ApplicationDto } from "@/lib/services/applications.service";
import { useState } from "react";

export default function ApplicantTable() {
    const { applicants, isLoading, error } = useApplicants();
    const [selectedApplicant, setSelectedApplicant] = useState<ApplicationDto | null>(null);

    console.log("[applicant-table] applicants list", applicants);


    const isActive = (applicant: ApplicationDto) => {
        const classNameActive = "bg-surface-container border-l-4 border-primary p-4 cursor-pointer transition-all duration-200";
        const classNameInactive = "bg-surface-container-low hover:bg-surface-container p-4 cursor-pointer transition-all duration-200 border-l-4 border-transparent";
        return selectedApplicant?.id === applicant.id ? classNameActive : classNameInactive;
    }

    return (
        <>

            {/* Application List */}
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {isLoading && <div className="text-center py-8">Chargement des candidats...</div>}
                {error && <div className="text-center py-8 text-error">Erreur de chargement</div>}
                {!applicants && (
                    <div className="text-center py-8 text-outline">
                        Aucun candidat trouvé
                    </div>
                )}
                {/* Active Card */}
                {applicants?.map((applicant) => (
                    <div key={applicant.id} className={isActive(applicant)} onClick={() => setSelectedApplicant(applicant)}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary-container/20 px-2 py-0.5 rounded">Score: {applicant.score ?? 0}</span>
                            <span className="text-[10px] text-outline">{applicant.createdAt}</span>
                        </div>
                        <h3 className="font-headline font-semibold text-on-surface text-lg">{applicant.name}</h3>
                        <p className="text-outline text-xs truncate">
                            {applicant.tradingYears
                                ? `${applicant.tradingYears} ans d'expérience`
                                : "N/A"}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{applicant.status}</span>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}