"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function OffersSection() {
  const offers = [
    {
      title: "Live Academy",
      desc: "Pour maîtriser la lecture des marchés et comprendre les mouvements derrière les prix.",
      price: "97€",
      period: "/mois",
      features: ["Sessions Live Hebdomadaires", "Accès aux ressources exclusives", "Accès à la communauté privée OnePips"],
      buttonText: "S'abonner maintenant",
      popular: false
    },
    {
      title: "Appel privé – Analyse ciblée en 1h",
      desc: "Pour les traders souhaitant résoudre un problème précis ou analyser un trade en profondeur",
      price: "150€",
      period: "/heure",
      features: ["Prise de conscience de votre situation", "Recevoir des conseils actionnables", "Analyser vos trades ou setups difficiles", "Coaching adapté"],
      buttonText: "Réserver un créneau",
      popular: true
    },
    {
      title: "Mentorat",
      desc: "Pour les traders ambitieux souhaitant se professionnaliser et développer leur propre stratégie et comprendre profondément les marchés. (Admission sur entretien)",
      price: "Sur Candidature",
      period: "",
      features: ["Suivi personnalisé", "Audit complet de votre profil", "Plan d'action adapté", "Coaching technique et psychologie"],
      buttonText: "Déposer un dossier",
      popular: false
    }
  ];

  return (
    <section className="py-24 px-8 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold mb-4">Choisissez votre trajectoire</h2>
          <p className="text-outline">Trois niveaux d'engagement pour transformer votre trading.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {offers.map((offer, i) => (
            <div
              key={i}
              className={cn(
                "bg-surface-container p-10 rounded-xl border flex flex-col transition-all group",
                offer.popular
                  ? "bg-surface-container-highest border-primary relative transform md:-translate-y-4 shadow-2xl shadow-primary/10"
                  : "border-outline-variant/10 hover:border-primary/30"
              )}
            >
              {offer.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 text-xs font-label font-bold uppercase tracking-widest rounded-full">
                  Plus Populaire
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-headline font-bold mb-2">{offer.title}</h3>
                <p className="text-outline text-sm">{offer.desc}</p>
              </div>
              <div className="mb-8">
                <p className="text-4xl font-headline font-bold text-on-surface">
                  {offer.price}
                  <span className="text-lg text-outline font-normal">{offer.period}</span>
                </p>
              </div>
              <ul className="space-y-4 mb-12 flex-grow">
                {offer.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span> {f}
                  </li>
                ))}
              </ul>

              {offer.title === "Mentorat Elite" ? (
                <Link
                  href="/candidature"
                  className="w-full py-4 text-center rounded-md border border-outline text-on-surface font-headline font-bold hover:bg-surface-container-high transition-all"
                >
                  {offer.buttonText}
                </Link>
              ) : (
                <button
                  className={cn(
                    "w-full py-4 rounded-md font-headline font-bold transition-all",
                    offer.popular
                      ? "bg-primary text-on-primary hover:brightness-110"
                      : "border border-primary text-primary group-hover:bg-primary group-hover:text-on-primary"
                  )}
                >
                  {offer.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
