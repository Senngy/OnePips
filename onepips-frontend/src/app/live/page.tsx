"use client";

export default function LivePage() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131317]/80 backdrop-blur-xl shadow-[0_40px_40px_0_rgba(210,187,255,0.06)]">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-2xl font-bold tracking-tighter text-[#E4E1E7] font-headline">One Pips</div>
          <div className="hidden md:flex items-center gap-8 font-headline tracking-tight">
            <a className="text-[#958DA1] hover:text-[#E4E1E7] transition-colors" href="/">Home</a>
            <a className="text-[#958DA1] hover:text-[#E4E1E7] transition-colors" href="/methode">Méthode</a>
            <a className="text-[#958DA1] hover:text-[#E4E1E7] transition-colors" href="/resultats">Résultats</a>
            <a className="text-[#958DA1] hover:text-[#E4E1E7] transition-colors" href="/offres">Offres</a>
            <a className="text-[#D2BBFF] border-b-2 border-[#7C3AED] pb-1" href="/live">Live</a>
          </div>
          <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-md font-medium font-headline active:scale-95 transition-transform hover:bg-[#1F1F23] transition-all duration-300">
            Candidater
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section with Asymmetric Layout */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden bg-surface">
          {/* Background Atmospheric Glow */}
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-tertiary-container/5 rounded-full blur-[100px]"></div>
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 py-24">
            {/* Left Content: Value Prop */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 w-fit mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Live Session Exclusive</span>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
                Maîtrisez les Marchés en <span className="text-primary italic text-glow">Temps Réel</span>.
              </h1>
              <p className="text-lg text-outline leading-relaxed max-w-xl mb-12">
                Rejoignez nos analystes seniors pour une session de trading en direct. Obtenez une vision institutionnelle du carnet d&apos;ordres et découvrez les opportunités avant le reste du marché.
              </p>
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">Analyse Flux</h3>
                    <p className="text-xs text-outline mt-1 font-label">Lecture du carnet d&apos;ordres institutionnel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary">bolt</span>
                  <div>
                    <h3 className="font-headline font-bold text-on-surface">Exécution Live</h3>
                    <p className="text-xs text-outline mt-1 font-label">Setup de trading partagé en direct.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Registration & Countdown */}
            <div className="lg:col-span-5 relative">
              <div className="glass-card p-8 rounded-2xl relative z-10 shadow-[0_40px_40px_0_rgba(210,187,255,0.06)]">
                {/* Countdown */}
                <div className="mb-10 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-outline mb-4 font-label">Prochaine session dans :</p>
                  <div className="flex justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="font-headline text-3xl font-bold text-on-surface">02</span>
                      <span className="text-[8px] uppercase tracking-tighter text-outline font-label">Jours</span>
                    </div>
                    <span className="text-3xl text-primary/30">:</span>
                    <div className="flex flex-col items-center">
                      <span className="font-headline text-3xl font-bold text-on-surface">14</span>
                      <span className="text-[8px] uppercase tracking-tighter text-outline font-label">Heures</span>
                    </div>
                    <span className="text-3xl text-primary/30">:</span>
                    <div className="flex flex-col items-center">
                      <span className="font-headline text-3xl font-bold text-on-surface">45</span>
                      <span className="text-[8px] uppercase tracking-tighter text-outline font-label">Min</span>
                    </div>
                  </div>
                </div>
                {/* Registration Form */}
                <form action="#" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Nom complet</label>
                    <input className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none" placeholder="Alexandre Martin" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Email professionnel</label>
                    <input className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary-fixed-dim transition-all outline-none" placeholder="alex@premium.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-outline ml-1 font-label">Expérience</label>
                    <select className="w-full bg-surface-container-lowest border-none rounded-md px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary-fixed-dim transition-all appearance-none outline-none">
                      <option>Débutant (0-1 an)</option>
                      <option>Intermédiaire (1-3 ans)</option>
                      <option>Avancé (3+ ans)</option>
                    </select>
                  </div>
                  <button className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-md mt-4 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)]" type="submit">
                    RÉSERVER MON ACCÈS
                  </button>
                  <p className="text-[9px] text-center text-outline/60 px-4 font-label">
                    En vous inscrivant, vous acceptez de recevoir nos analyses hebdomadaires et invitations exclusives.
                  </p>
                </form>
              </div>
              {/* Decorative Image Overlay */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full overflow-hidden border-4 border-surface z-20 hidden md:block">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrB4xySED4lgFAAoDsrlGXEN7bXv5-iNawJLSSJkIkYXQFFv2mK_oaws1go26Ver-1pE_RCX6iq856Xgf1r9jBpPd30CpvuWlTO26TR8QQyBaKuCn9HFIpNwEq0qWEG67qqwAhUwOfCYTeZjWN6FACRlVqydQUYj9He_ODnwVDT4ZQBnuR7og2TfjOJu1cq42NeM_Yqe_la_5Jqg_3Ke6SBmLellBL46hNPaVDre0Z24O9T9bPgWhlotFtK0v-e_GsiWkoP_IHeLE" alt="Live trading chart" />
              </div>
            </div>
          </div>
        </section>

        {/* Proof Section (Bento Grid) */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold mb-4">Pourquoi participer ?</h2>
              <div className="w-12 h-1 bg-primary-container mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container p-8 rounded-xl border-t-[0.5px] border-surface-bright">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-4">Psychologie de Marché</h4>
                <p className="text-sm text-outline leading-relaxed font-label">Apprenez à gérer vos émotions en observant comment les professionnels réagissent aux mouvements brusques de volatilité.</p>
              </div>
              <div className="bg-surface-container p-8 rounded-xl border-t-[0.5px] border-surface-bright">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">query_stats</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-4">Backtesting Direct</h4>
                <p className="text-sm text-outline leading-relaxed font-label">Nous analysons les setups passés et actuels pour valider la pertinence de la stratégie One Pips en conditions réelles.</p>
              </div>
              <div className="bg-surface-container p-8 rounded-xl border-t-[0.5px] border-surface-bright">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">forum</span>
                </div>
                <h4 className="font-headline text-xl font-bold mb-4">Q&amp;A Privé</h4>
                <p className="text-sm text-outline leading-relaxed font-label">Posez vos questions techniques directement à nos traders et recevez des réponses personnalisées en fin de session.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <div className="mb-12">
              <div className="flex justify-center gap-1 text-primary mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <blockquote className="text-2xl font-headline font-medium italic text-on-surface leading-snug">
                &quot;La session live a radicalement changé ma perception du risque. Voir la stratégie One Pips appliquée en direct sur le NASDAQ a été le déclic qu&apos;il me fallait.&quot;
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn9piH0ZYNt0qKjf7U1H0PU-_w9F0syROzyudoUwp5f4drxLFX-ygC7o_q2J7SbJf5Mb1Z94sk0C5cneZstFd37-nhcSi1-89Y2-hCJ4XbELy1LVv8Cp-nIX0vCxXwNLuFLx1cmB5nxtKx50UtlwfMQaFbPWcMSdILBnKy1zRbaZVc1BeFiTJ4HcMIBQYgyrUw_jerKnAT6scLCyca4D5CPQu4bsC-MlHUyCZgCpRg0Sp1c3UWsPR8a5NnXR--tVxN3JULTJV85VQ" alt="Marc-Antoine D." />
                </div>
                <div className="text-left font-body">
                  <p className="font-bold text-on-surface">Marc-Antoine D.</p>
                  <p className="text-xs text-outline uppercase tracking-widest font-label font-bold">Trader Indépendant</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#4A4455]/15 bg-[#131317]">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 py-12 gap-6 font-body text-sm tracking-wide uppercase font-bold">
          <div className="text-lg font-black text-[#E4E1E7] font-headline">One Pips</div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-[#958DA1] hover:text-[#D2BBFF] transition-colors" href="/legal">Mentions Légales</a>
            <a className="text-[#958DA1] hover:text-[#D2BBFF] transition-colors" href="/privacy">Politique de Confidentialité</a>
            <a className="text-[#958DA1] hover:text-[#D2BBFF] transition-colors" href="/cgv">CGV</a>
            <a className="text-[#958DA1] hover:text-[#D2BBFF] transition-colors" href="/legal">Avertissement sur les Risques</a>
          </div>
          <p className="text-[#958DA1] text-[10px] text-center md:text-right max-w-xs normal-case opacity-80 font-normal">
            © 2024 One Pips. Premium Trading Education. High-risk investment warning: Trading involves significant risk of loss.
          </p>
        </div>
      </footer>
    </div>
  );
}
