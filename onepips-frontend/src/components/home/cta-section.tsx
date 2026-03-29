"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32 px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-30"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-headline font-bold mb-8 leading-tight">Prêt à changer de ligue ?</h2>
        <p className="text-xl text-outline mb-12 max-w-2xl mx-auto">
          Rejoignez One Pips et accédez à une éducation sans compromis. Le marché n'attend pas.
        </p>
        <div className="inline-block p-1 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 rounded-full">
          <Link 
            href="/candidature" 
            className="bg-primary-container text-on-primary-container px-12 py-6 text-xl font-headline font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-primary-container/40 inline-flex items-center"
          >
            Candidater maintenant
          </Link>
        </div>
        <p className="mt-8 text-xs font-label text-outline uppercase tracking-[0.3em]">
          Places limitées pour garantir la qualité
        </p>
      </div>
    </section>
  );
}
