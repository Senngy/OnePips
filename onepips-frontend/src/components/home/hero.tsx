"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <span className="text-secondary font-label text-sm tracking-[0.2em] uppercase mb-6 block">
            Rejoignez l'équipage OnePips
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter leading-none mb-8">
            Devenir trader rentable demande une{" "}
            <span className="text-primary">méthode</span>. Pas de la chance.
          </h1>
          <p className="text-outline text-xl max-w-xl mb-10 leading-relaxed">
            Vous retrouverez tout ce dont vous avez besoin afin de progresser
            et d'évoluer au sein d'une communauté privé qui se réunis autour du domaine qui
            nous passionne tous : Le trading
          </p>
          <div className="flex flex-col sm:sm:flex-row gap-4">
            <Link
              href="/candidature"
              className="bg-primary-container text-on-primary-container px-8 py-4 text-center text-lg font-headline font-bold rounded-md hover:brightness-110 transition-all shadow-lg shadow-primary-container/20"
            >
              Candidater maintenant
            </Link>
            <button className="border border-outline-variant text-on-surface px-8 py-4 text-lg font-headline font-bold rounded-md hover:bg-surface-container transition-all">
              Voir le programme
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 relative flex flex-col items-center">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div
            className="glass-card p-2 rounded-2xl relative overflow-hidden group glow-violet border border-white/5">
            <div className="relative overflow-hidden rounded-xl">
              <img alt="The Head Trader"
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                data-alt="A professional and charismatic male trader in a sharp suit looking confidently at the camera, high-end studio lighting"
                src="/profile-pic.jpg" />
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent">
              </div>
              <div
                className="absolute top-6 left-6 flex items-center gap-3 bg-[#5865F2]/20 backdrop-blur-md border border-[#5865F2]/40 px-4 py-2 rounded-full">
                <svg className="w-6 h-6 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.063 14.063 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z">
                  </path>
                </svg>
                <span className="text-xs font-headline font-bold tracking-wider text-white">LIVE
                  SERVER</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-center lg:text-left">
                <p className="text-primary font-headline font-bold text-2xl mb-1">Coach Principal</p>
                <p className="text-on-surface/60 text-sm font-body">Expert en Stratégies Institutionnelles
                </p>
              </div>
            </div>
          </div>
          <button
            className="mt-8 w-full bg-primary-container text-on-primary-container px-8 py-5 text-lg font-headline font-bold rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary-container/20 group flex items-center justify-center gap-3">
            <span
              className="material-symbols-outlined group-hover:translate-x-1 transition-transform">rocket_launch</span>
            Rejoindre la Wishlist Live Gratuit
          </button>
        </div>
      </div>
    </section>
  );
}
