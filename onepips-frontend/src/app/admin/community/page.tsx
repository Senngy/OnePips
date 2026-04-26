"use client";

import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminCommunityPage() {
    return (
        <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container">
            <Sidebar />
            <main className="ml-64 min-h-screen">
                <Navbar />
                <h1 className="text-4xl font-headline font-bold mb-8">Gestion de la Communauté</h1>
                {/* Content Canvas */}
                <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Statistics Overview (Bento Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-outline text-[10px] font-label uppercase tracking-widest">Total
                                Testimonials</span>
                            <span className="text-3xl font-headline font-bold text-on-surface">1,284</span>
                            <span className="text-xs text-primary mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12% this month
                            </span>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-outline text-[10px] font-label uppercase tracking-widest">Average Rating</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-headline font-bold text-on-surface">4.92</span>
                                <div className="flex text-primary">
                                    <span className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-outline text-[10px] font-label uppercase tracking-widest">Global Pips
                                Shared</span>
                            <span className="text-3xl font-headline font-bold text-on-surface">+45.2k</span>
                            <span className="text-xs text-outline mt-2 tracking-wide uppercase font-label">Across 420 traders</span>
                        </div>
                        <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-outline text-[10px] font-label uppercase tracking-widest">Active Results</span>
                            <span className="text-3xl font-headline font-bold text-on-surface">842</span>
                            <span className="text-xs text-tertiary mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">pending</span>
                                14 pending review
                            </span>
                        </div>
                    </div>
                    {/* Asymmetric Main Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Testimonials Management */}
                        <section className="lg:col-span-8 space-y-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-headline font-bold text-on-surface">Derniers Témoignages</h3>
                                <div className="flex gap-2">
                                    <button
                                        className="p-2 bg-surface-container text-outline hover:text-on-surface rounded border border-white/5">
                                        <span className="material-symbols-outlined">filter_list</span>
                                    </button>
                                    <button
                                        className="p-2 bg-surface-container text-outline hover:text-on-surface rounded border border-white/5">
                                        <span className="material-symbols-outlined">search</span>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-white/5 shadow-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr
                                            className="bg-surface-container-high/50 text-outline text-[10px] font-label uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4">Membre</th>
                                            <th className="px-6 py-4">Évaluation</th>
                                            <th className="px-6 py-4">Commentaire</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <tr className="hover:bg-surface-container/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs font-bold">
                                                        JD</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-on-surface">Julien Durand</p>
                                                        <p className="text-[10px] text-outline">Gold Member</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex text-primary text-xs">
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs text-on-surface-variant max-w-[240px] truncate italic">"Une
                                                    stratégie limpide qui m'a permis de..."</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-label uppercase">Visible</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-outline hover:text-on-surface">
                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-surface-container/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                                                        <img className="w-full h-full object-cover"
                                                            data-alt="professional headshot of a female stock analyst, soft lighting, minimalistic background"
                                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTtijnhx2fC04A-NcOimj_Y91RKiB444Korgel-4lBqr8yi6GQGSxF8b3TtuuN12wNzz035j57rraV1uRVhLibccls2BffHXQ4Qo0D9FdiqKNqIK0l7hqsAu2y5vPSFfYyeH-YeQinEAE6KzCriF-lxWfBkKkfXkrjpXLlQtm4hODqxVKQJdMfNFViRmPatLu9U055F_EzjCTC_G6wQH5k4ro_ziw2e3-_Jf2TiAQzTqQvRjHttvU82MX-Ymvgu3Bovddt1jlnAhY" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-on-surface">Sarah Belkacem</p>
                                                        <p className="text-[10px] text-outline">Elite Trader</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex text-primary text-xs">
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs text-on-surface-variant max-w-[240px] truncate italic">"Les
                                                    lives sessions sont d'une valeur incroyable."</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-label uppercase">Visible</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-outline hover:text-on-surface">
                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-surface-container/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-outline text-xs font-bold">
                                                        MP</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-on-surface">Marc Pierre</p>
                                                        <p className="text-[10px] text-outline">Beginner</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex text-primary text-xs">
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="material-symbols-outlined text-xs"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs text-on-surface-variant max-w-[240px] truncate italic">"Début
                                                    prometteur après seulement 2 semaines."</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className="px-2 py-1 rounded bg-surface-container-highest text-outline text-[10px] font-label uppercase">Hidden</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-outline hover:text-on-surface">
                                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        {/* Right Column: Add New Form (Glassmorphism) */}
                        <aside className="lg:col-span-4 space-y-6">
                            <div className="glass-card p-8 rounded-xl border border-white/5 space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-headline font-bold text-on-surface">Nouveau Témoignage</h3>
                                    <p className="text-xs text-outline">Ajouter manuellement un avis reçu.</p>
                                </div>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-label uppercase tracking-widest text-outline">Nom
                                            Complet</label>
                                        <input
                                            className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface placeholder:text-outline/30 transition-all"
                                            placeholder="ex: Jean Dupont" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-label uppercase tracking-widest text-outline">Rôle /
                                            Badge</label>
                                        <select
                                            className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface transition-all">
                                            <option>Membre Gold</option>
                                            <option>Elite Trader</option>
                                            <option>Beginner</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-label uppercase tracking-widest text-outline">Évaluation
                                            (1-5)</label>
                                        <div className="flex gap-2">
                                            <span
                                                className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
                                                style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span
                                                className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
                                                style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span
                                                className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
                                                style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span
                                                className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
                                                style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span
                                                className="material-symbols-outlined text-outline cursor-pointer hover:scale-110 transition-transform">star</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            className="text-[10px] font-label uppercase tracking-widest text-outline">Témoignage</label>
                                        <textarea
                                            className="w-full bg-surface-container-lowest border-none ring-1 ring-white/10 focus:ring-primary text-sm rounded-md px-4 py-3 text-on-surface placeholder:text-outline/30 transition-all"
                                            placeholder="Tapez ici le contenu du message..." rows={4}></textarea>
                                    </div>
                                    <button
                                        className="w-full bg-primary-container text-on-primary-container py-3 rounded-md font-headline font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                                        type="button">
                                        ENREGISTRER L'AVIS
                                    </button>
                                </form>
                            </div>
                        </aside>
                    </div>
                    {/* Performance Section Header */}
                    <div className="flex justify-between items-end pt-8 border-t border-white/5">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-headline font-bold text-on-surface">Gestion des Résultats</h3>
                            <p className="text-sm text-outline">Performance screenshots et analyses partagées.</p>
                        </div>
                        <button
                            className="flex items-center gap-2 text-primary font-headline text-sm font-semibold hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined">cloud_upload</span>
                            UPLOADER UN RÉSULTAT
                        </button>
                    </div>
                    {/* Performance Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Entry 1 */}
                        <div className="bg-surface-container rounded-xl overflow-hidden group border border-white/5">
                            <div className="h-40 overflow-hidden relative">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="close-up of a trading candlestick chart on a dark phone screen, vibrant green and red bars against a deep obsidian background"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTqDnGMpZSNCH4uSCEdOtWLQ1YdxwkTcWUIjCL84vossmPXNuZBXvixncUjsCLwOxxTAEzT1eOoSwbgnMwSeiLyQkI4IpSLGLfl_pcYyBND37epWHSMhH3U0J0qOvo8MuL-9pzHfuXb4UtOKCestxJ2kzSTiSDb_TPqWBLV_6OGuabKg4U60Og0zGhSTuHZd740K6Gh2nf5ooC2MA3HnnsN_WwKN5T8eIwWrvdj1XMsUPVx9DG9oqCHGasIhMS3IK3ixIrg_eRDQw" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <span
                                    className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded">XAUUSD
                                    Buy</span>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xl font-headline font-bold text-primary">+142.5%</span>
                                    <span className="text-[10px] font-label text-outline uppercase tracking-widest">12 Oct
                                        2023</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-on-surface-variant">Setup: Elliott Waves</span>
                                    <div className="flex gap-2">
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-on-surface">edit</span>
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-tertiary">delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Entry 2 */}
                        <div className="bg-surface-container rounded-xl overflow-hidden group border border-white/5">
                            <div className="h-40 overflow-hidden relative">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="financial technical analysis screen showing multiple currency pair indicators on a dark UI interface"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl1yZiXcuvaootjB44BWb7Dd6o7XYf1Rb__x_Gbuxbim4KOPqy2VJ6NkWflk7KiW89KcufZf_xr_kTndt-PKmh3dtpsaeKDEhZhUEYI41iDfb0q4xNxqKwJCOmJtUCzgmYuGxW_F9E7x2muw4gKvqPfMr7U-5jitMuQNnqEmO_E43asj7V-8roqCwWzqEa3Ae3RAvNUknLNze-c9k5Zx9osxHRirCrPuSSOVCgR6T3hrIc26E3rvHD8_c-0Gx7nuHMLAPNgyWFD3I" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <span
                                    className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded">EURUSD
                                    Sell</span>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xl font-headline font-bold text-primary">+82.1%</span>
                                    <span className="text-[10px] font-label text-outline uppercase tracking-widest">10 Oct
                                        2023</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-on-surface-variant">Setup: Resistance Hit</span>
                                    <div className="flex gap-2">
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-on-surface">edit</span>
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-tertiary">delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Entry 3 */}
                        <div className="bg-surface-container rounded-xl overflow-hidden group border border-white/5">
                            <div className="h-40 overflow-hidden relative">
                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    data-alt="close up of meta trader dashboard showing profit balance and open trades on a smartphone screen in a dark room"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Zun7hOKoqr7Bkv_UBrMraROehBDLdwWp4i_bJt0yLgQU2o-DIxFU1y2q60ucM7Z8tGINwiAuCbuqQyinA-hSCf2jaSd4QeWKltpvKyITcJOrNa8UIm0i9mQ6Z9NKcFgi4lBI9JmR74MmyvVsT4pApc6Vlz6neTUPC3gu_7uB4tPRYxLLYxz2CnRX-8Cured-ZBiD7lx42Orhq-AAIuLbpX389xZ-XUz1VuU60pHz1WwL8QznL5i_GKaRhbr_sarzdft53d2e6Ug" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <span
                                    className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded">BTCUSD
                                    Long</span>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-xl font-headline font-bold text-primary">+210.4%</span>
                                    <span className="text-[10px] font-label text-outline uppercase tracking-widest">08 Oct
                                        2023</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-on-surface-variant">Setup: Breakout</span>
                                    <div className="flex gap-2">
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-on-surface">edit</span>
                                        <span
                                            className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-tertiary">delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Add New Placeholder */}
                        <div
                            className="bg-surface-container-low border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 group hover:border-primary/50 transition-colors cursor-pointer">
                            <div
                                className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
                                <span className="material-symbols-outlined text-primary group-hover:text-white">add_a_photo</span>
                            </div>
                            <p className="text-sm font-headline font-bold text-on-surface">Ajouter un résultat</p>
                            <p className="text-[10px] text-outline text-center mt-1">PNG, JPG ou Screenshot MT4/MT5</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}