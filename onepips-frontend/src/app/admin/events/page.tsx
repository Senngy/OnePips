"use client";

import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import NewLiveModal from "@/components/admin/live/new-live-modal";
import { EventParticipants } from "@/components/admin/live/event-participants";
import ConfirmModal from "@/components/modals/confirm-modal";
import UpdateLiveModal from "@/components/admin/live/update-live-modal";
import { useState } from "react";
import { useUpcomingEvents } from "@/lib/hooks/events/useEvents";
import { useArchivedEvents } from "@/lib/hooks/events/useArchivedEvent";
import { getTimeLeft } from "@/lib/utils/getEventTimeLeft";
import { usePublishEvent } from "@/lib/hooks/events/usePublishEvent";
import { useCancelEvent } from "@/lib/hooks/events/useCancelEvent";

export default function AdminEventsPage() {
  const [isNewLiveModalOpen, setIsNewLiveModalOpen] = useState(false);
  const [isUpdateLiveModalOpen, setIsUpdateLiveModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [openOptionsMenuId, setOpenOptionsMenuId] = useState<string | null>(null);
  const [confirmType, setConfirmType] = useState<"publish" | "cancel" | null>(null);

  const { data: events, isLoading, isError, error, refetch, isFetching, isStale, isSuccess, status } = useUpcomingEvents();
  const { data: archivedEvents } = useArchivedEvents();

  const displayedEvent = events?.find(e => e.id === selectedEventId) || events?.[0];
  const displayedEventTimeLeft = getTimeLeft(displayedEvent?.startsAt as string);
  const displayedEventParticipantsList = displayedEvent?.participants || [];

  const { mutate: publish } = usePublishEvent();
  const { mutate: cancel } = useCancelEvent();

  const handleCreateLive = () => {
    setIsNewLiveModalOpen(true);
  };

  const toggleOptionsMenu = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setOpenOptionsMenuId(openOptionsMenuId === eventId ? null : eventId);
  };

  return (
    <div className="font-body selection:bg-primary/30">
      {isNewLiveModalOpen && <NewLiveModal setIsOpen={setIsNewLiveModalOpen} />}
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-headline font-bold">Gestion des Lives</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateLive}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm active:scale-95 transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)]">
                <span className="material-symbols-outlined text-sm">add</span>
                Créer un Live
              </button>
            </div>
          </div>
          {/* Next Event par defaut ou event selectionné */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Statut: {displayedEvent?.isPublished ? "Publié" : "Non publié"}</span>
              </div>
              <button className="text-outline hover:text-primary flex items-center gap-2 text-sm font-medium">
                View Schedule <span className="material-symbols-outlined text-sm"
                  data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
            <div className="asymmetric-grid">
              {displayedEvent && (
                <div
                  key={displayedEvent.id ?? 'default'}
                  className="surface-container rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]"
                  style={{ animation: 'applicant-reveal 0.35s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
                  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <img alt="Trading Chart Background" className="w-full h-full object-cover"
                      data-alt="abstract financial data visualization with glowing purple and blue lines representing stock market movements and technical analysis"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe6-pFlK-9mJWR36BPTPCMtxcSCn3VNLaQHS3rzfbXKeCoyuDecM45a9R7finx4MayDYOa8bLbrHTRyoKEGBI-GrOmRf-zD_Gic2B30PkulhWjHCDY9VYgMvUYZ6NEnu-QJkRqsRYT2fekniievCDHU7392Q3WLd4czxF-927iAt0DqWJON7Q9TlO3whaQN0X_1KxjI8gUrP-___2JA2B5nlXw57KNkfzNVL9n_dyIswJ20zORkDNadrbL9jl_1FDciXCh4V71yJ0" />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent">
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-primary/20">Masterclass</span>
                      <span
                        className="flex items-center gap-1.5 text-tertiary text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                        Live commence dans {displayedEventTimeLeft?.days}j {displayedEventTimeLeft?.hours}h {displayedEventTimeLeft?.minutes}m
                      </span>
                    </div>
                    <h3 className="text-5xl font-headline font-bold leading-tight max-w-2xl">{displayedEvent.title}</h3>
                    <p className="text-on-surface-variant mt-4 text-lg max-w-xl">{displayedEvent.description}</p>
                  </div>
                  <div className="relative z-10 mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      <img alt="Panelist"
                        className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-container"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEAncYWiqAotKYFX9t2NUcEuXHA9n2qTewtrF9x3chn89BxuYBj2QiR5PI3FuSt9p9s9eeNDAlKA3C149nAwG9H3qi0KSjFTJGuuJ2Roe97yts6jiY6T84JDYlx2irnKmPD_3NGCyZFOgGJnVUvtZeyt5MvQL_5w-Fb9TvtQPkeO9pHpXQVI7kPbyyw4WKojU0oeeaA-4cWYn73KXzU32MbqXcFKmLj_J1U3dKnxjzqfzJxlE5DJRT92v2D7uzkpvUvQl_HOkl9uk" />
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-surface-container bg-surface-container-highest text-[10px] font-bold text-outline">
                        +{displayedEvent.participants?.length || 0}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-md font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary-container/20"
                        onClick={() => {
                          setIsUpdateLiveModalOpen(true);
                        }}
                      >
                        Mettre à jour
                      </button>
                      {isUpdateLiveModalOpen && displayedEvent && (
                        <UpdateLiveModal
                          setIsOpen={setIsUpdateLiveModalOpen}
                          event={displayedEvent}
                        />
                      )}
                      <button
                        className="bg-surface-variant text-on-surface px-6 py-2.5 rounded-md font-bold text-sm hover:bg-surface-bright transition-colors active:scale-95"
                        onClick={() => {
                          setSelectedEventId(displayedEvent.id!);
                          setConfirmType("publish");
                        }}>
                        Publier
                      </button>
                      <ConfirmModal
                        open={!!confirmType}
                        title={
                          confirmType === "publish"
                            ? "Confirmer la publication"
                            : "Confirmer l’annulation"
                        }
                        description={
                          confirmType === "publish"
                            ? "Confirmer la publication de cet événement live ?"
                            : "Confirmer l’annulation de cet événement live ?"
                        }
                        onConfirm={() => {
                          if (!selectedEventId) return;

                          if (confirmType === "publish") {
                            publish(selectedEventId);
                          } else {
                            cancel(selectedEventId);
                          }

                          setConfirmType(null);
                          setSelectedEventId(null);
                        }}
                        onCancel={() => {
                          setConfirmType(null);
                          setSelectedEventId(null);
                        }}
                      />
                      <button
                        className="bg-transparent border border-error/30 text-error px-6 py-2.5 rounded-md font-bold text-sm hover:bg-error/10 transition-colors active:scale-95"
                        onClick={() => {
                          setSelectedEventId(displayedEvent.id!);
                          setConfirmType("cancel");
                        }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Other coming Events / Sidebar List */}
              <div className="space-y-4">
                {events?.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id || null)}
                    className={`surface-container rounded-xl p-5 border-l-4 cursor-pointer transition-colors ${displayedEvent?.id === event.id ? 'border-primary bg-surface-container-high' : 'border-outline-variant hover:bg-surface-container-high'}`}>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">
                      Date prévue : {new Date(event.startsAt).toLocaleString()}
                    </p>
                    <h4 className="font-bold text-on-surface leading-tight mb-3">{event.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-on-surface-variant">{event._count?.participants || "N/A"} inscrits</span>
                      <div className="relative">
                        <button
                          onClick={(e) => toggleOptionsMenu(e, event.id!)}
                          className="material-symbols-outlined text-outline text-lg hover:text-on-surface transition-colors focus:outline-none"
                          data-icon="more_vert"
                        >
                          more_vert
                        </button>

                        {openOptionsMenuId === event.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-surface-container-highest ring-1 ring-outline/20 z-10 border border-outline-variant/10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenOptionsMenuId(null);
                                  // TODO: Add logic to open update modal
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                                role="menuitem"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                Mettre à jour
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Section: Engagement Stats (Asymmetric layout) */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Live Retention</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-primary">88.4%</span>
                <span className="text-[10px] text-primary-container font-bold">+2.1% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]" style={{ width: "88%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Avg. Watch Time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">42m</span>
                <span className="text-[10px] text-tertiary font-bold">-5m ↓</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Chat Interaction</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">12.4k</span>
                <span className="text-[10px] text-primary-container font-bold">+15% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">4.2%</span>
                <span className="text-[10px] text-primary-container font-bold">+0.8% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant" style={{ width: "42%" }}></div>
              </div>
            </div>
          </section>
          {/* Section: Participant List & Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <EventParticipants eventId={displayedEvent?.id || ""} participantCount={displayedEvent?._count?.participants || 0} />
            {/* Past Events Archive (Asymmetric Sidebar) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-bold">Evenements Archivés</h3>
                <span className="material-symbols-outlined text-outline" data-icon="history">history</span>
              </div>
              <div className="space-y-4">
                {archivedEvents?.map((event) => (
                  <div
                    key={event.id}
                    className="surface-container rounded-xl p-5 group cursor-pointer hover:bg-surface-container transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold text-outline">{new Date(event.startsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="bg-surface-bright text-[8px] font-black px-1.5 py-0.5 rounded">HD
                        REPLAY</span>
                    </div>
                    <h5 className="text-sm font-bold group-hover:text-primary transition-colors mb-4 leading-snug">
                      {event.title}</h5>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-outline">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]" data-icon="group">group</span>
                        {event._count?.participants} Views
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]" data-icon="star">star</span> 4.9
                        Rating
                      </div>
                    </div>
                  </div>
                ))}
                {/* Archived Item */}
                <div
                  className="glass-card rounded-xl p-5 group cursor-pointer hover:bg-surface-container transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-outline">OCT 22, 2023</span>
                    <span className="bg-surface-bright text-[8px] font-black px-1.5 py-0.5 rounded">HD
                      REPLAY</span>
                  </div>
                  <h5 className="text-sm font-bold group-hover:text-primary transition-colors mb-4 leading-snug">
                    Psychology of the "Black Swan": Trading in Chaos</h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-outline">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="group">group</span>
                      2.4k Views
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="star">star</span> 4.9
                      Rating
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant/30 text-outline text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all">
                  See All Archived Events
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
