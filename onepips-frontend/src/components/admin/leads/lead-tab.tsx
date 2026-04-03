"use client";

import { useLeads } from "@/lib/hooks/useLeads";
import { useState } from "react";
import { formatDate, formatInterest, formatSource, formatStatus } from "@/lib/helpers/formatData";


export default function LeadTab() {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        status: "",
        minScore: "",
        maxScore: "",
    });

    const { leads, isLoading, error } = useLeads(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    return (
        <>
            {/* Filters & Controls Grid */}
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

            {/* Table Content */}
            <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-outline-variant/5">
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Nom</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold text-center">Score</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Statut</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Source</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Intérêts</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Trading Years</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Tags</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Date d'entrée</th>
                                <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            {isLoading && <tr><td colSpan={5} className="text-center py-8">Loading leads...</td></tr>}
                            {error && <tr><td colSpan={5} className="text-center py-8 text-error">Error loading leads</td></tr>}
                            {leads?.map((lead) => (
                                <tr key={lead.id} className="hover:bg-surface-container-high/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold" />
                                            <div>
                                                <div className="text-sm font-semibold text-on-surface">{lead.name}</div>
                                                <div className="text-[11px] text-outline">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className="text-sm text-center font-headline font-bold text-primary ">{lead.score}</span>
                                            <div className="w-24 h-1 bg-secondary-container rounded-full overflow-hidden">
                                                <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.4)]" style={{ width: `${lead.score}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                                            {formatStatus(lead.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-outline font-medium">{formatSource(lead.source)}</td>
                                    <td className="px-6 py-5 text-sm text-outline font-medium">{formatInterest(lead.interests)}</td>
                                    <td className="px-6 py-5 text-sm text-outline font-medium">{lead.tradingYears}</td>
                                    <td className="px-6 py-5 text-sm text-outline font-medium">{lead.tags?.join(", ")}</td>
                                    <td className="px-6 py-5 text-sm text-outline font-medium">{formatDate(lead.createdAt)}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded" title="Tag Lead">
                                                <span className="material-symbols-outlined text-lg">sell</span>
                                            </button>
                                            <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded" title="Contacter">
                                                <span className="material-symbols-outlined text-lg">mail</span>
                                            </button>
                                            <button className="p-2 text-outline hover:text-error hover:bg-error-container/10 transition-all rounded" title="Supprimer">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                            <button className="ml-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-md hover:bg-primary transition-all hover:text-on-primary">Details</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-surface-container-lowest px-6 py-4 flex items-center justify-between">
                    <span className="text-xs text-outline">Displaying 1-10 of 1,284 results</span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-outline hover:text-on-surface disabled:opacity-30" disabled>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 rounded bg-primary-container text-on-primary-container text-xs font-bold">1</button>
                        <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">2</button>
                        <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">3</button>
                        <span className="text-outline mx-1">...</span>
                        <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">128</button>
                        <button className="p-2 text-outline hover:text-on-surface">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}