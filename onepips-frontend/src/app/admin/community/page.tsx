"use client";

import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import ConfirmModal from "@/components/modals/confirm-modal";
import PermissionGate from "@/components/admin/permission-gate";
import { useState } from "react";
import { useCommunityStats } from "@/lib/hooks/community/useCommunityStats";
import {
  useTestimonials,
  useCreateTestimonial,
  useDeleteTestimonial,
} from "@/lib/hooks/community/useTestimonials";
import { useResults, useDeleteResult } from "@/lib/hooks/community/useResults";
import { TestimonialDto } from "@/lib/services/community.service";
import { ResultDto } from "@/lib/services/community.service";
import FormTestimony from "@/components/admin/community/form-testimony";
import NewResultModal from "@/components/admin/community/new-result-modal";
import ImageLightbox from "@/components/ui/image-lightbox";

export default function AdminCommunityPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <PermissionGate permission="COMMUNITY_READ">
          <CommunityContent />
        </PermissionGate>
      </main>
    </div>
  );
}

function CommunityContent() {
  const { data: stats, isLoading: statsLoading } = useCommunityStats();
  const { data: testimonials, isLoading: testimonialsLoading } =
    useTestimonials();
  const { mutate: deleteTestimonial } = useDeleteTestimonial();
  const { data: results, isLoading: resultsLoading } = useResults();
  const { mutate: deleteResult } = useDeleteResult();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [newResultOpen, setNewResultOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const getStatValue = (label: string) => {
    return stats?.find((s) => s.label === label)?.value ?? 0;
  };

  return (
    <>
      <div className="px-8 pt-8">
        <h1 className="text-4xl font-headline font-bold mb-8">
          Gestion de la Communauté
        </h1>
      </div>
        {/* Content Canvas */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Statistics Overview (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-outline text-[10px] font-label uppercase tracking-widest">
                Total Testimonials
              </span>
              <span className="text-3xl font-headline font-bold text-on-surface">
                {statsLoading ? "-" : getStatValue("total_testimonials")}
              </span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-outline text-[10px] font-label uppercase tracking-widest">
                Average Rating
              </span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">
                  {statsLoading
                    ? "-"
                    : (getStatValue("average_rating") / 10).toFixed(1)}
                </span>
                <div className="flex text-primary">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-outline text-[10px] font-label uppercase tracking-widest">
                Global Pips Shared
              </span>
              <span className="text-3xl font-headline font-bold text-on-surface">
                +{statsLoading ? "-" : getStatValue("global_pips")}
              </span>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-outline text-[10px] font-label uppercase tracking-widest">
                Active Results
              </span>
              <span className="text-3xl font-headline font-bold text-on-surface">
                {statsLoading ? "-" : getStatValue("active_results")}
              </span>
            </div>
          </div>
          {/* Asymmetric Main Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Testimonials Management */}
            <section className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-headline font-bold text-on-surface">
                  Derniers Témoignages
                </h3>
              </div>
              <div className="bg-surface-container-low rounded-xl overflow-hidden border border-white/5 shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/50 text-outline text-[10px] font-label uppercase tracking-widest border-b border-white/5">
                      <th className="px-6 py-4">Membre</th>
                      <th className="px-6 py-4">Évaluation</th>
                      <th className="px-6 py-4">Commentaire</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {testimonialsLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-5 text-center text-outline"
                        >
                          Chargement...
                        </td>
                      </tr>
                    ) : testimonials?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-5 text-center text-outline"
                        >
                          Aucun témoignage
                        </td>
                      </tr>
                    ) : (
                      testimonials?.map((t: TestimonialDto) => (
                        <tr
                          key={t.id}
                          className="hover:bg-surface-container/30 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-xs font-bold">
                                {t.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-on-surface">
                                  {t.name}
                                </p>
                                <p className="text-[10px] text-outline">
                                  {t.role}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex text-primary text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="material-symbols-outlined text-xs"
                                  style={{
                                    fontVariationSettings:
                                      i < t.rating ? "'FILL' 1" : "'FILL' 0",
                                  }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs text-on-surface-variant max-w-[240px] truncate italic">
                              &quot;{t.content}&quot;
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`px-2 py-1 rounded text-[10px] font-label uppercase ${t.isVisible ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-outline"}`}
                            >
                              {t.isVisible ? "Visible" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => setDeleteTargetId(t.id)}
                              className="text-outline hover:text-tertiary"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                            <ConfirmModal
                              open={deleteTargetId === t.id}
                              onCancel={() => setDeleteTargetId(null)}
                              onConfirm={() => {
                                deleteTestimonial(t.id);
                                setDeleteTargetId(null);
                              }}
                              title="Supprimer le témoignage"
                              description="Êtes-vous sûr de vouloir supprimer ce témoignage ?"
                              variant="danger"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            {/* Right Column: Add New Form (Glassmorphism) */}
            <aside className="lg:col-span-4 space-y-6">
              <FormTestimony />
            </aside>
          </div>
          {/* Performance Section Header */}
          <div className="flex justify-between items-end pt-8 border-t border-white/5">
            <div className="space-y-1">
              <h3 className="text-2xl font-headline font-bold text-on-surface">
                Gestion des Résultats
              </h3>
              <p className="text-sm text-outline">
                Performance screenshots et analyses partagées.
              </p>
            </div>
            <button
              onClick={() => setNewResultOpen(true)}
              className="flex items-center gap-2 text-primary font-headline text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined">cloud_upload</span>
              UPLOADER UN RÉSULTAT
            </button>
          </div>
          {/* Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resultsLoading ? (
              <div className="col-span-full text-outline text-center py-8">
                Chargement des résultats...
              </div>
            ) : results?.length === 0 ? (
              <div className="col-span-full text-outline text-center py-8">
                Aucun résultat
              </div>
            ) : (
              results?.map((r: ResultDto) => (
                <div
                  key={r.id}
                  className="bg-surface-container rounded-xl overflow-hidden group border border-white/5"
                >
                  <div
                    className="h-40 overflow-hidden relative bg-black/20 cursor-zoom-in"
                    onClick={() => setLightboxSrc(r.image)}
                  >
                    {r.image && (
                      <div className="w-full h-full overflow-hidden border border-outline-variant/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={r.image}
                          alt="preview"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                    <span className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded pointer-events-none">
                      {r.pair}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xl font-headline font-bold text-primary">
                        +{r.gain}%
                      </span>
                      <span className="text-[10px] font-label text-outline uppercase tracking-widest">
                        {new Date(r.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                      <span className="text-sm text-on-surface-variant font-bold">
                        {r.title}
                      </span>
                      <span className="text-xs text-on-surface-variant truncate">
                        {r.description}
                      </span>
                      <div className="flex gap-2 pt-2">
                        <span
                          onClick={() => deleteResult(r.id)}
                          className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-tertiary"
                        >
                          delete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* Add New Placeholder */}
            <div
              onClick={() => setNewResultOpen(true)}
              className="bg-surface-container-low border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 group hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
                <span className="material-symbols-outlined text-primary group-hover:text-white">
                  add_a_photo
                </span>
              </div>
              <p className="text-sm font-headline font-bold text-on-surface">
                Ajouter un résultat
              </p>
              <p className="text-[10px] text-outline text-center mt-1">
                PNG, JPG ou Screenshot MT4/MT5
              </p>
            </div>
          </div>
        </div>
      <NewResultModal
        isOpen={newResultOpen}
        onClose={() => setNewResultOpen(false)}
      />
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
