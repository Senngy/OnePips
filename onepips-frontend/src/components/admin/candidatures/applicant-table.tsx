"use client";
import { ApplicationDto } from "@/lib/services/applications.service";
import { formatRelativeDate } from "@/lib/helpers/formatData";

interface ApplicantTableProps {
    applicants: ApplicationDto[] | undefined;
    isLoading: boolean;
    error: Error | null;
    selectedApplicant: ApplicationDto | null;
    onSelectApplicant: (applicant: ApplicationDto) => void;
}

export default function ApplicantTable({
    applicants,
    isLoading,
    error,
    selectedApplicant,
    onSelectApplicant
}: ApplicantTableProps) {
    const isActive = (applicant: ApplicationDto) => {
        const classNameActive = "bg-surface-container border-l-4 border-primary p-4 cursor-pointer transition-all duration-200";
        const classNameInactive = "bg-surface-container-low hover:bg-surface-container p-4 cursor-pointer transition-all duration-200 border-l-4 border-transparent";
        return selectedApplicant?.id === applicant.id ? classNameActive : classNameInactive;
    }

    return (
        <>
            {/* Filters & Controls Grid 
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="col-span-1 md:col-span-2 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                    <input
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline/50"
                        placeholder="Search name, email, or institutional tag..." type="text" />
                </div>
                <div>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 cursor-pointer">
                        <option value="">Tri par statut</option>
                        <option value="HOT">Hot (Ready)</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="COLD">Cold (Archived)</option>
                    </select>
                </div>
                <div>
                    <select
                        name="minScore"
                        value={filters.minScore}
                        onChange={handleFilterChange}
                        className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 cursor-pointer">
                        <option value="">Tri par score</option>
                        <option value="90"> Elite (Score {'>'} 90)</option>
                        <option value="70"> Bon (Score {'>'} 70)</option>
                        <option value="50"> Moyen (Score {'>'} 50)</option>
                    </select>
                </div>
            </div>
            */}
            {/* Application List */}
            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {isLoading && <div className="text-center py-8">Chargement des candidats...</div>}
                {error && <div className="text-center py-8 text-error">Erreur de chargement</div>}
                {!isLoading && !error && (!applicants || applicants.length === 0) && (
                    <div className="text-center py-8 text-outline">
                        Aucun candidat trouvé
                    </div>
                )}

                {/* Cards */}
                {!isLoading && !error && applicants && applicants.length > 0 && (
                    applicants?.map((applicant) => (
                        <div
                            key={applicant.id}
                            className={isActive(applicant)}
                            onClick={() => onSelectApplicant(applicant)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary-container/20 px-2 py-0.5 rounded">Score: {applicant.score ?? 0}</span>
                                <span className="text-[10px] text-outline">{formatRelativeDate(applicant.createdAt || "")}</span>
                            </div>
                            <h3 className="font-headline font-semibold text-on-surface text-lg">{applicant.answers?.name || 'Utilisateur Anonyme'}</h3>
                            <p className="text-outline text-xs truncate">
                                {applicant.answers?.tradingYears
                                    ? `${applicant.answers?.tradingYears} ans d'expérience`
                                    : "N/A"}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{applicant.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div >
        </>
    );
}