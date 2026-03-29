"use client";

import MultiStepForm from "@/components/form/multi-step-form";

export default function CandidaturePage() {
  return (
    <main className="bg-background min-h-screen flex flex-col antialiased">
      {/* TopNavBar Simplified for Candidature */}
      <nav className="bg-background docked full-width top-0 z-50 border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-on-background font-headline cursor-pointer" onClick={() => window.location.href = "/"}>
            One Pips
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-outline-variant font-label text-[10px] tracking-widest uppercase">Candidature Élite 2024</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => window.location.href = "/"}
            >
              close
            </button>
          </div>
        </div>
      </nav>

      {/* Application Container */}
      <div className="flex-grow flex flex-col items-center justify-start pt-12 pb-24 px-6 overflow-hidden">
        <MultiStepForm />
      </div>

      {/* Aesthetic Pulse Layer */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-20"></div>
    </main>
  );
}
