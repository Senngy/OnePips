"use client";

import { useEffect, useState } from "react";

export default function EvenementPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "14",
    minutes: "45",
    seconds: "12",
  });

  // Basic countdown logic for visual effect, can be made real later
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      // Placeholder target date: 2 days from now
      const target = now + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (45 * 60 * 1000) + (12 * 1000);
      const distance = target - new Date().getTime();

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="selection:bg-primary-container selection:text-on-primary-container bg-[#0B0B0F] text-on-background min-h-screen">
      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 overflow-hidden">
        {/* Background Ambient Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl w-full text-center z-10">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant/15 mb-8">
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMMvDTnyjHykA6qAgjP1lPpPsv4pYRm2bRwreh6U8Vg-R-Ed564gX18JBBqFkiMzapXugG3-OAMNW4gYOR_5U6FdQi5w6gwSGdQV5N47uLjwUoRkAmvJ61p8xAm-xnHrbgErXxBVpvkH4KZqiCH2k_mIPOS6IVgnYmj5tiKMvFg7Mswq0RejbKbVDFwRWFl52mSoSCk5-nCMZpc9N2ehT2plFtFAc9gzpDdrWQfnTBzRFdIGPyTlSKrRvUJdJEGMeHbupCZsEZhI" alt="Trader 1" />
              <img className="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGNrwM03L-hxr1onEMXIsyl1Lj77rX549FjtpssPtkFyeLGaMPjzELtHueYMaV-RfnlMWdL4hZy7mvdDbw7A_7xH5cagKHd2pyu4sXn24LuhrwV5UamyvcbeXYZ9bIJu9FnAeJF-cwhhIUbjAiUM-b14O1IE7ChZl1cUAl9sth4EDkHh-uO6bgdBNchHNr0oSXWp2ICQrAI34XqDptFQPK6uUzsHDOYQx0v4E2ObUFVEAwrlBb28BVVMk1bOcW4lW6PhvS_ibXDJg" alt="Trader 2" />
              <img className="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbejqhcQTFmNRMfXJImCxgXMkLZMzSaUNhxU7Vo_QKrkSEXAwjo6mAMbD6nPnK5Zelt-prFe30GghQMtei5efKKwsUq4NANoLF7acZzLXMDfERG7HJAQODAJnn-RtQGvNUExg33szrH7hQR-l2ttpW9VhLE35WOUeKqhGBVrRHzy5wyhy7mZoDpgcH5UA4JnAzUNirLxjMQ7ABXSHXuNbD6_NGg02GLwby30M7thvNcipjLskc4giwaxKjTFMooVw8xj2buQuyUUQ" alt="Trader 3" />
            </div>
            <span className="text-xs font-medium tracking-wide uppercase text-secondary">Rejoignez 2.4k+ membres actifs</span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-on-background">
            LIVE EXCEPTIONNEL : Les secrets de la <span className="text-primary italic">rentabilité</span> enfin dévoilés
          </h1>

          <p className="text-lg md:text-xl text-outline mb-12 max-w-2xl mx-auto leading-relaxed">
            Participez à une initiation gratuite et une session exclusive de Questions/Réponses pour transformer votre approche des marchés financiers.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-16">
            <div className="flex flex-col items-center p-4 rounded-md bg-surface-container-low border border-outline-variant/10">
              <span className="font-headline text-3xl font-bold text-primary">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-widest text-outline">Jours</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-md bg-surface-container-low border border-outline-variant/10">
              <span className="font-headline text-3xl font-bold text-primary">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-widest text-outline">Heures</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-md bg-surface-container-low border border-outline-variant/10">
              <span className="font-headline text-3xl font-bold text-primary">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-widest text-outline">Minutes</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-md bg-surface-container-low border border-outline-variant/10">
              <span className="font-headline text-3xl font-bold text-primary">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-widest text-outline">Secondes</span>
            </div>
          </div>

          {/* Primary CTA */}
          <button className="group relative px-10 py-5 bg-primary-container text-on-primary-container font-headline font-bold text-lg rounded-md transition-all duration-300 hover:scale-[1.02] active:scale-95 violet-glow">
            <span className="relative z-10">M&apos;INSCRIRE GRATUITEMENT AU LIVE</span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
          </button>
        </div>

        {/* Decorative UI Element */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-96 opacity-30">
          <div className="glass-card p-6 rounded-xl space-y-4 rotate-3">
            <div className="h-2 w-24 bg-primary/40 rounded-full"></div>
            <div className="h-32 w-full bg-surface-container-highest/50 rounded-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              <svg className="absolute bottom-0 w-full h-16 text-primary" viewBox="0 0 100 40">
                <path d="M0 40 L10 32 L25 35 L40 20 L55 25 L75 5 L100 15 V40 H0 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"></path>
              </svg>
            </div>
            <div className="flex justify-between">
              <div className="h-2 w-12 bg-outline-variant/30 rounded-full"></div>
              <div className="h-2 w-12 bg-outline-variant/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className="bg-surface-container-low py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3">
              <h2 className="font-headline text-3xl font-bold text-on-background mb-6 leading-tight">
                Pourquoi rejoindre cet événement <span className="text-primary italic">Live</span> ?
              </h2>
              <p className="text-outline text-sm leading-relaxed mb-8">
                Nous ne vous montrons pas seulement quoi faire, nous vous montrons comment le faire en temps réel sur les marchés actuels.
              </p>
              <div className="h-1 w-20 bg-primary-container"></div>
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-lg group hover:bg-surface-container transition-colors duration-500">
                <div className="w-12 h-12 rounded bg-primary-container/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">school</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-background mb-4">Apprentissage de la méthode</h3>
                <p className="text-outline text-sm leading-relaxed">
                  Découvrez les piliers de notre stratégie institutionnelle. Une approche simplifiée pour identifier les zones de haute probabilité.
                </p>
              </div>
              <div className="glass-card p-8 rounded-lg group hover:bg-surface-container transition-colors duration-500">
                <div className="w-12 h-12 rounded bg-primary-container/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-background mb-4">Analyse de marché en direct</h3>
                <p className="text-outline text-sm leading-relaxed">
                  Assistez au scan complet du marché. Nous analysons les configurations actuelles sous vos yeux pour une immersion totale.
                </p>
              </div>
              <div className="glass-card p-8 rounded-lg group hover:bg-surface-container transition-colors duration-500 md:col-span-2">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-12 h-12 shrink-0 rounded bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">forum</span>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold text-on-background mb-2">Q&amp;A Session Illimitée</h3>
                    <p className="text-outline text-sm leading-relaxed">
                      Posez toutes vos questions à nos experts. Aucune zone d&apos;ombre ne subsistera après ce live interactif conçu pour votre réussite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-surface text-center font-headline">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-medium text-on-background italic mb-12">
            &quot;La meilleure session d&apos;initiation que j&apos;ai pu suivre. Enfin du concret sans blabla commercial.&quot;
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center grayscale opacity-50">
            <span className="font-bold text-xl uppercase tracking-tighter">TradingView</span>
            <span className="font-bold text-xl uppercase tracking-tighter">MT4</span>
            <span className="font-bold text-xl uppercase tracking-tighter">Binance</span>
            <span className="font-bold text-xl uppercase tracking-tighter">Strike</span>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary-container/5 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
          <h2 className="font-headline text-4xl font-bold text-on-background mb-8">Prêt à changer votre vision du trading ?</h2>
          <p className="text-outline mb-12 text-lg">
            Les places sont limitées pour garantir la qualité de la session Q&amp;A. Réservez votre accès gratuit maintenant.
          </p>
          <button className="group relative px-12 py-6 bg-primary-container text-on-primary-container font-headline font-bold text-xl rounded-md transition-all duration-300 hover:shadow-[0_0_50px_rgba(124,58,237,0.3)] active:scale-95">
            M&apos;INSCRIRE GRATUITEMENT AU LIVE
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span className="text-xs uppercase tracking-widest font-bold">100% Gratuit — Aucun Engagement</span>
            </div>
            <p className="text-[10px] text-outline/50 uppercase tracking-tighter">© 2024 One Pips Premium Trading Education. High-risk investment warning.</p>
          </div>
        </div>
        {/* Background Image/Decoration */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-6xl aspect-video opacity-10 pointer-events-none">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz22fy6XMQZPyC7AdvLfmCQNtYfYV59Fjtr8R93YjDYEIFmTK-72RC8CtVzBG5R2JmXOoZwUfcnMrOrE6dIz-VViHFg4oAh73AjGpAFn0sZpLWJ0wvfaKoBYhKwMzZDNpVYgjX9dA4-RWr540yI4SFWwD6y2iSjsnEW0aKwBuCAkvjUERxWYiQdDnKuYSNGEP180PnMF7bOvoJCtA8KBAmnnnalBHV9oWp8Og9k_CwjQvZpoosMqeYVOUva46abMKr6v2UsmwIVpQ" alt="Trading setup background" />
        </div>
      </section>
    </div>
  );
}
