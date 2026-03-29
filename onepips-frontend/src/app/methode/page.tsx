"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MethodePage() {
  return (
    <>
      {/* TopAppBar */}
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8">
                <span className="inline-block px-3 py-1 bg-primary-container/20 text-primary border border-primary/20 text-xs font-bold tracking-widest uppercase rounded-sm font-label">
                  La Rigueur par le Design
                </span>
                <h1 className="text-5xl md:text-7xl font-headline font-bold leading-none tracking-tight text-[#E4E1E7]">
                  L&apos;Art de la <span className="text-primary text-glow">Précision</span>
                </h1>
                <p className="text-lg text-outline leading-relaxed max-w-xl">
                  Notre philosophie ne repose pas sur la chance, mais sur une discipline mathématique et une exécution chirurgicale. Nous formons les 1% qui comprennent que le trading est une affaire de probabilités, pas de prédictions.
                </p>
              </div>
              <div className="flex-1 w-full aspect-video rounded-xl overflow-hidden bg-surface-container shadow-2xl relative">
                <img
                  alt="Technical Trading Chart"
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw9NltjJBRqnXAIgxnz9FDaIrEjNhWF22-wdu9sIK821Lq5KEQlXCPIYCU-i2cElukgqNB_4nM4qOBTsDuoIkrMIwNdaRT2LHTstdmoWE0qQ5XUgYHMCS5EGbj36d04t1GDiv_2_ZTVcmbHjATuglfI1Ebi_DccR_FFXDdnEqwFThp3xBqNt5nrgvcNCX2ODoD-C2FXT02nuSaSsplpX2AoiBPZyd9aao-2UuxJ5MrWlZcdmIo22d95i2Qm99sl2WyHB5r0fEeLfU"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Bento Grid */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 glass-card p-10 rounded-xl flex flex-col justify-between min-h-[400px]">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-6">psychology</span>
                  <h3 className="text-3xl font-headline font-bold text-[#E4E1E7] mb-4">Discipline Psychologique</h3>
                  <p className="text-outline text-lg max-w-2xl leading-relaxed">
                    Le plus grand ennemi du trader est lui-même. Notre méthode intègre un module spécifique sur la gestion émotionnelle, transformant vos biais cognitifs en avantages compétitifs.
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="h-1 flex-1 bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] shadow-[0_0_8px_rgba(210,187,255,0.6)]"></div>
                  </div>
                  <span className="text-xs font-label text-primary font-bold">FOCUS 85%</span>
                </div>
              </div>
              <div className="md:col-span-4 bg-primary-container p-10 rounded-xl text-on-primary-container flex flex-col justify-center gap-6">
                <h3 className="text-2xl font-headline font-bold leading-tight">Gestion des Risques Prioritaire</h3>
                <p className="opacity-90 font-medium">
                  Nous n&apos;enseignons pas comment gagner, nous enseignons comment ne pas perdre. La préservation du capital est le socle de toute fortune.
                </p>
                <div className="text-6xl font-black opacity-20 self-end">RR 1:3</div>
              </div>
              <div className="md:col-span-4 glass-card p-8 rounded-xl flex flex-col gap-4">
                <span className="material-symbols-outlined text-tertiary text-3xl">analytics</span>
                <h4 className="text-xl font-bold font-headline">Analytique Pure</h4>
                <p className="text-sm text-outline">Utilisation de modèles institutionnels pour identifier les zones de liquidité réelles, loin du bruit des indicateurs standards.</p>
              </div>
              <div className="md:col-span-8 glass-card p-8 rounded-xl flex items-center gap-8 overflow-hidden">
                <div className="flex-1">
                  <h4 className="text-xl font-bold font-headline mb-2">Backtesting Rigoureux</h4>
                  <p className="text-sm text-outline">Chaque stratégie est testée sur 10 ans de données historiques avant d&apos;être validée par notre comité.</p>
                </div>
                <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-surface-container-highest rounded-full border border-outline-variant/20">
                  <span className="material-symbols-outlined text-5xl text-primary">history_edu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process (Timeline) */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">Le Parcours One Pips</h2>
              <p className="text-outline max-w-xl mx-auto">Une immersion structurée pour passer de spectateur à acteur majeur des marchés financiers.</p>
            </div>
            <div className="relative space-y-24">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary-container to-transparent -translate-x-1/2 hidden md:block"></div>

              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-4">Étape 01 — Théorie</h3>
                  <p className="text-outline leading-relaxed">
                    Maîtrisez les fondations : Architecture des marchés, carnets d&apos;ordres, et théorie des cycles. Pas de fioritures, seulement les concepts utilisés par les banques d&apos;investissement.
                  </p>
                </div>
                <div className="z-10 w-16 h-16 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center flex-shrink-0 order-1 md:order-2 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-on-surface">menu_book</span>
                </div>
                <div className="flex-1 hidden md:block order-3"></div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <div className="flex-1 hidden md:block order-1"></div>
                <div className="z-10 w-16 h-16 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center flex-shrink-0 order-1 md:order-2 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-on-surface">terminal</span>
                </div>
                <div className="flex-1 order-2 md:order-3">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-4">Étape 02 — Pratique</h3>
                  <p className="text-outline leading-relaxed">
                    Mise en application sur simulateur temps réel. Apprenez à exécuter sous pression et à gérer votre journal de trading avec une précision algorithmique.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-12 group">
                <div className="flex-1 md:text-right order-2 md:order-1">
                  <h3 className="text-2xl font-headline font-bold text-primary mb-4">Étape 03 — Mentorat</h3>
                  <p className="text-outline leading-relaxed">
                    Accès aux sessions lives quotidiennes. Recevez des feedbacks en temps réel sur vos trades et bénéficiez de l&apos;expérience de nos analystes seniors.
                  </p>
                </div>
                <div className="z-10 w-16 h-16 rounded-full bg-surface-container-highest border-4 border-surface flex items-center justify-center flex-shrink-0 order-1 md:order-2 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-on-surface">groups</span>
                </div>
                <div className="flex-1 hidden md:block order-3"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Free Youtube Courses Section */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-headline font-bold mb-4">Apprendre avec OnePips sur Youtube</h2>
              <p className="text-outline">Commencez à apprendre notre statégie avec les contenus gratuits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              {/* Free Youtube Courses Cards */}
              <div className="bg-surface-container-highest rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary transition-colors group cursor-pointer">
                <div className="relative">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/-zUjH8Ecjwo?si=VHcfxbd_hbUmCWQG"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary transition-colors group cursor-pointer">
                <div className="relative">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/WeEf9zNjlOs?si=W9ToI4i1FGoMXeY5"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary transition-colors group cursor-pointer">
                <div className="relative">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/wIYzkairDTs?si=O7K_cnOjOdh-l94c"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-primary-container/10 backdrop-blur-sm"></div>
            <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center gap-8 border border-outline-variant/10">
              <h2 className="text-3xl md:text-5xl font-headline font-bold">Prêt à évoluer ?</h2>
              <p className="text-outline max-w-2xl text-lg">
                Le trading avec la méthode OnePips demande de l'engagement et rigueur. Nous sélectionnons nos membres sur leur motivation et leur capacité de discipline.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-primary-container text-on-primary-container px-10 py-4 rounded-md font-bold text-lg active:scale-95 transition-transform hover:bg-primary-container/90">
                  Déposer une Candidature
                </button>
                <button className="border border-outline/30 text-on-surface px-10 py-4 rounded-md font-bold text-lg hover:bg-surface-container transition-colors">
                  Consulter les Résultats
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
