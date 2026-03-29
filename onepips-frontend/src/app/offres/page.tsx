"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function OffresPage() {
  return (
    <>
      {/* TopNavBar */}
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="w-full md:w-2/3">
              <span className="inline-block px-3 py-1 bg-surface-container-high text-primary text-[10px] tracking-[0.2em] font-bold uppercase mb-6 rounded-sm font-label">
                Élite Trading Education
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
                Passez du côté des <br /><span className="text-gradient">1% Rentables.</span>
              </h1>
              <p className="text-outline text-lg max-w-xl leading-relaxed">
                Des programmes conçus pour l'élite. Pas de signaux, juste de la compétence pure. Choisissez votre niveau d'engagement et commencez votre ascension.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
              <div className="w-full aspect-square relative overflow-hidden rounded-xl border-outline-variant/15 border">
                <img
                  alt="Premium Trading Setup"
                  className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPxG4cEmdJWr2x8lxw1WkX3ocHRIPQLkP4_gVnilT92Zppk_ChrQd3qAWdOp74dMTOgNNbdc2bXrIGTu4-qsfWixrKlMMKcIO3-lEL_JaBp8HhoyUDlvQej7R7cQ3vZJmf6VcNvJrfRnKHwt8d_oZrOL5Lj0ekT7vC6-jegEL9gP8roN2hokIJXfkHk1xbkJl7Ku8o2aCFEg6QD9gtPHtez1a3dnqJ_UmRLI4QZVkvQbZ_H7QGiPt1xZw9M9LgtaS7SOKMf_zZRuY"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Live Academy */}
            <div className="bg-surface-container-low p-8 flex flex-col h-full group hover:bg-surface-container transition-all duration-500 relative">
              <div className="mb-12">
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">hub</span>
                  <span className="text-[10px] font-bold tracking-widest text-outline uppercase">Accès Mensuel</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">Live Academy</h3>
                <p className="text-outline text-sm leading-relaxed mb-8">
                  Immersion totale dans les marchés en direct. Apprenez en observant l'analyse institutionnelle chaque jour.
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-headline font-bold text-on-surface">97€</span>
                  <span className="text-outline text-sm">/mois</span>
                </div>
              </div>
              <div className="space-y-4 mb-12 flex-grow">
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Sessions Live Quotidiennes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Replay des Analyses</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <span>Communauté Discord VIP</span>
                </div>
              </div>
              <button className="w-full py-4 bg-surface-container-highest border border-outline-variant/20 text-on-surface font-bold hover:bg-primary hover:text-on-primary transition-all duration-300">
                S'abonner
              </button>
            </div>

            {/* Card 2: Coaching Privé */}
            <div className="bg-surface-container p-10 flex flex-col h-full relative overflow-hidden border-t-2 border-primary shadow-[0_20px_50px_rgba(124,58,237,0.15)] transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary px-4 py-1 text-[10px] font-black uppercase tracking-tighter text-on-primary">
                Recommandé
              </div>
              <div className="mb-12">
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
                  <span className="text-[10px] font-bold tracking-widest text-primary uppercase">Sur Mesure</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">Coaching Privé</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                  Session intensive en 1-to-1 pour débloquer vos paliers psychologiques et techniques.
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-headline font-bold text-on-surface">150€</span>
                  <span className="text-outline text-sm">/heure</span>
                </div>
              </div>
              <div className="space-y-4 mb-12 flex-grow">
                <div className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>Audit complet de votre Journal</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>Plan de Trading Personnalisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>Correction de votre Biais</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>Support Direct Post-Session</span>
                </div>
              </div>
              <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-300">
                Réserver un créneau
              </button>
            </div>

            {/* Card 3: Mentorat Elite */}
            <div className="bg-surface-container-low p-8 flex flex-col h-full group hover:bg-surface-container transition-all duration-500">
              <div className="mb-12">
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">diamond</span>
                  <span className="text-[10px] font-bold tracking-widest text-outline uppercase">Sélection</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">Mentorat Elite</h3>
                <p className="text-outline text-sm leading-relaxed mb-8">
                  Le programme ultime. Accompagnement sur 6 mois pour transformer votre capital en empire.
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-2xl font-headline font-bold text-on-surface">Sur Candidature</span>
                </div>
              </div>
              <div className="space-y-4 mb-12 flex-grow">
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>Passage de Proprietary Firm</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>Accès Mastermind Physique</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>Gestion de Portefeuille</span>
                </div>
              </div>
              <button className="w-full py-4 border border-primary text-primary font-bold hover:bg-primary/10 transition-all duration-300">
                Candidater
              </button>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="max-w-7xl mx-auto px-8 mt-32">
          <div className="bg-surface-container-lowest p-12 border border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-headline font-bold mb-2">Prêt à changer d'échelle ?</h4>
              <p className="text-outline text-sm">Plus de 500 traders accompagnés vers la liberté financière.</p>
            </div>
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUBr8XtKCrsAkgyOHKFBEjJ4bGzUOjpEY2CeqjZ9PgvoDCxZ38xdYqoE1GWPzTUUq6Ib0x1e4QjHGtZFpnJWpUQkMPAa2FUp_3knW2Yvgikdv-MX9afFUXegnhap7Eriuds7-nlB-2jJqB4l4Yl366OOKUaIqaFHtXgZYVrCQJBwCa_g10IXp0L_tnAlBpPi3TyeN9RUZb6wYOfBqKHZtEAcGeW_EeWBrRmrwd_zGeCfQm-gi-ZPALGIr54JbV41bwQeZbi4auq1o" alt="User 1" />
              <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2MVxNI7iKau82jkoO94wMtmJQd4k7yicV-SzVh80j-CLQwVJ8TGpjnFrCTm0djP-it9FC9Zp7Ig7-l3voPfuYwUVHkXxjLJiGvxPqWQg5HvEXIVvGFFBIgGDfHYeCwx4B0eXIKNrX18ZTP28Xay5nMgS2XSrrVagCrfaFE-pF1dBdEEYWX2HQgmjIt34rccLMEgqeOR1sTQ2y5mcf9z-_g_KTuwcuh14PtMnQJSroBG5KOKWahqBl5WUO7szi5Tf0C8uxtBvqxt0" alt="User 2" />
              <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB_FZHeXi5ytXdo3CePnN63eFLGKXvOvkblSKYnMLsVdNpHhrgNWgpTW4ojan0Vdcc9R7Cal0iVqyd_u8qMJnhdOXen0O4RWYI7Wnra0MysYRHaujv5Gk6oa85Mkw1iQWRl5BRdObTRPazZJWbo-qbDObpTaCvXjf2ZUGvZPd380jIKbcYMYjvLf9IqvoG6PhBYGCBu3WXoOu8kwLD5WMmeBu5x8oVFH45BJtkLoDp-XxxjO2_h7DvoLmK9Oty8Nm990Lvq3QfmWQ" alt="User 3" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">+500</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
