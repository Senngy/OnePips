"use client";

export default function CandidaterLandingPage() {
  return (
    <div className="bg-[#0B0B0F] text-on-background font-body antialiased selection:bg-primary selection:text-on-primary min-h-screen">
      {/* Hero Hook Section */}
      <section className="relative min-h-[870px] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-tertiary-container/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary">Live One Pips Academy</span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-on-surface text-glow">
            Arrêtez de brûler vos comptes.
          </h1>

          <p className="font-headline text-2xl md:text-4xl font-light text-outline max-w-2xl mx-auto leading-tight">
            Copiez ma méthode de trading. <span className="text-on-surface font-bold">Zéro bruit, 100% exécution.</span>
          </p>

          <div className="pt-12">
            <a className="group relative inline-flex items-center justify-center" href="#apply">
              <div className="absolute inset-0 bg-primary-container blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <button className="relative bg-primary-container hover:bg-primary-container/90 text-on-primary-container px-10 py-6 rounded-md font-headline text-xl font-extrabold uppercase tracking-widest transition-all transform active:scale-95 btn-glow shadow-2xl">
                Candidater maintenant
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Problem/Solution Bento Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Problem Card */}
          <div className="md:col-span-5 bg-surface-container-low p-10 rounded-lg flex flex-col justify-between space-y-12">
            <div className="space-y-6">
              <span className="material-symbols-outlined text-tertiary text-4xl">trending_down</span>
              <h3 className="font-headline text-3xl font-bold text-on-surface">Le Trading Classique</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-outline font-label">
                  <span className="material-symbols-outlined text-error text-xl">close</span>
                  <span className="text-sm">Indicateurs en retard et signaux contradictoires</span>
                </li>
                <li className="flex items-start gap-4 text-outline font-label">
                  <span className="material-symbols-outlined text-error text-xl">close</span>
                  <span className="text-sm">Overtrading émotionnel et FOMO permanent</span>
                </li>
                <li className="flex items-start gap-4 text-outline font-label">
                  <span className="material-symbols-outlined text-error text-xl">close</span>
                  <span className="text-sm">Comptes financés perdus en moins de 48h</span>
                </li>
              </ul>
            </div>
            <div className="h-1 bg-surface-container-high w-full"></div>
            <p className="font-label text-[10px] text-error/60 uppercase tracking-widest font-bold">Échec systématique</p>
          </div>

          {/* Solution Card */}
          <div className="md:col-span-7 bg-surface-container p-10 rounded-lg relative overflow-hidden group border-t border-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-primary text-[120px]">bolt</span>
            </div>
            <div className="relative z-10 space-y-8">
              <span className="material-symbols-outlined text-primary text-4xl">verified</span>
              <h3 className="font-headline text-4xl font-black text-on-surface">L&apos;Approche One Pips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2 font-label">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-tighter">Liquidité Institutionnelle</h4>
                  <p className="text-on-surface-variant text-sm">Entrez là où les banques achètent. Sortez là où elles vendent.</p>
                </div>
                <div className="space-y-2 font-label">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-tighter">Psychologie d&apos;Acier</h4>
                  <p className="text-on-surface-variant text-sm">Système de règles strictes éliminant tout doute lors de l&apos;exécution.</p>
                </div>
                <div className="space-y-2 font-label">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-tighter">Risk Management</h4>
                  <p className="text-on-surface-variant text-sm">Ratio Risk/Reward minimum de 1:3 sur chaque setup validé.</p>
                </div>
                <div className="space-y-2 font-label">
                  <h4 className="text-primary font-bold uppercase text-xs tracking-tighter">Accompagnement</h4>
                  <p className="text-on-surface-variant text-sm">Copy-trading et sessions lives pour voir la méthode en action.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="bg-surface-container-lowest py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-headline text-center text-3xl font-bold text-outline-variant mb-16 uppercase tracking-[0.3em]">Résultats vérifiés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 border-l-2 border-primary/30">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFVgolLsjWasmy7W-a-ZNU0TWs-39TqFCVdHEjw6ByBxg97oLvSK0_Ty7rdSYAIgxcZ-sSTq_xiX7Jan5wUsXsgt7UwvtKY6xclH-LV-y4ZqixSrEa03UxdUR5lyWoPFjbjHEoaBqpR2auN7f9hM6oRf4uSv3Sklnd-nxcUFyxa0X53zDN-A2tqe2asuRXO4aEDx7-tjHNA_j0z8-zYzwa_BS8Q5rOxZK7pkeMxf_q3qFR3UOvJQ-80yJMowy0BrZMyEp3Z-mYDZA" alt="Marc K." />
                <div className="font-label">
                  <div className="text-on-surface font-bold">Marc K.</div>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-black">Prop Firm Funded</div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed font-body">
                &quot;En 3 semaines avec One Pips, j&apos;ai validé mon challenge 100k. La clarté des setups est incomparable.&quot;
              </p>
              <div className="mt-4 flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low p-8 border-l-2 border-primary/30">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs9C092asQQmXJHaLmy9z9HyiTHwL4Otif8C5S6aWM4NBOUsJYu2R9o-7dzmJjtMhcicsVSETCcHfW9UjeA484YOrZHZYHeGJ7ScHu7KCIqkXOS2rfKZMPVOiYdjL-W94j4hgR3h4e0cti5kJujvHPfhdL0HElop8Vc8hZ8JOaS4QOOd-vHCxIM-9hdY5A8BDdq1LBVRmXKqUd-TEnCnEwsBbNNRWpFdlJJ0qvWZDSxuTn1HMi5Qz9-cnR2564WWvT1DAAioloQO8" alt="Léa D." />
                <div className="font-label">
                  <div className="text-on-surface font-bold">Léa D.</div>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-black">Full Time Trader</div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed font-body">
                &quot;J&apos;ai arrêté d&apos;utiliser 15 indicateurs. Maintenant je lis juste le prix. Merci One Pips pour la liberté.&quot;
              </p>
              <div className="mt-4 flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low p-8 border-l-2 border-primary/30">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4CSVS05ciiRZlHaqqjRxaZ_jU0qEcBwcGBomhc4wyy02R4urog_zLzzQ4DQvI_zA4PTXESMIeKjCpazDdpC6FFT3vzKpIs-Jt5SPvyg46geEVz_9VPrztzOUMGZSwySVvZQiUuvxUqTJE-bSD3ZfXY2QnzBCpE49a2rALl59fAP_xhksPGGmHtatQJOtkxo5Sl5dWjRPx1UmZp6mdcHXA7-OoSf4-qff9bBT4jnv-A9XYa2gno8tBqpcHxBaxQ2_V7b4FLsGmpnQ" alt="Sami R." />
                <div className="font-label">
                  <div className="text-on-surface font-bold">Sami R.</div>
                  <div className="text-[10px] text-primary uppercase tracking-widest font-black">Swing Trader</div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed font-body">
                &quot;La session live de lundi m&apos;a rapporté plus que mon ancien job en un mois. La méthode est chirurgicale.&quot;
              </p>
              <div className="mt-4 flex gap-1 text-primary">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA / Conversion Section */}
      <section className="relative py-32 px-8 overflow-hidden" id="apply">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-transparent to-[#0B0B0F]"></div>
          <img className="w-full h-full object-cover opacity-20 filter grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7dQcYWmrGMshal5qs101R9aknzII84ZgH9EUDDWAsspYEcDmBXFm-aYVNxK0HxWtgpOkYyJhxVC0eY_X4KMJmbEomh-GeGCBuYdwrObYjpSTo0NacnENOZI2TdFt8uArLH-KKnaBTUZOeyh51OvydA_SgretpQJwd0aM21m8YN83_B0kK7eD2S_I-o1Lk052D_ZYcbZnUocKurYClJK3_f_8_xgI_iwclVrNhJtgMs5yy05cJD-_Ef_0U9kyzxblvoOMKDStMsys" alt="Trading screens background" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          <h2 className="font-headline text-4xl md:text-6xl font-black text-on-surface leading-none">
            Rejoignez le top 1% des traders.
          </h2>
          <div className="space-y-4 max-w-xl mx-auto">
            <p className="text-outline text-lg font-body">
              Les places sont limitées pour garantir un suivi d&apos;élite. Candidature requise pour accéder à l&apos;Académie One Pips.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <a className="group relative w-full max-w-md" href="#">
              <div className="absolute inset-0 bg-primary-container blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <button className="relative w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container py-8 rounded-lg font-headline text-2xl font-black uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-2xl">
                Candidater maintenant
              </button>
            </a>
            <div className="flex items-center gap-4 text-[10px] font-label text-outline uppercase tracking-widest mt-4 font-bold">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">lock</span> Paiement Sécurisé</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">support_agent</span> Support 24/7 Elite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple High-Risk Warning */}
      <div className="max-w-7xl mx-auto px-8 py-12 text-center border-t border-outline-variant/10">
        <p className="font-label text-[9px] text-outline/40 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
          © 2024 ONE PIPS PREMIUM TRADING EDUCATION. HIGH-RISK INVESTMENT WARNING: TRADING INVOLVES SIGNIFICANT RISK AND IS NOT SUITABLE FOR ALL INVESTORS. LOSSES CAN EXCEED DEPOSITS.
        </p>
      </div>
    </div>
  );
}
