"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function ResultatsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-4 block font-label">Performance &amp; Verification</span>
              <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tighter mb-6">
                La Preuve par les <span className="text-gradient">Chiffres.</span>
              </h1>
              <p className="text-outline text-lg max-w-2xl leading-relaxed">
                Chez One Pips, nous ne vendons pas de rêves, mais une méthodologie éprouvée. Explorez les témoignages de nos membres et les rapports de performance authentifiés de notre équipe d&apos;analyse.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col items-start md:items-end gap-4">
              <div className="glass-card p-6 w-full max-w-xs">
                <div className="flex items-center gap-4 mb-2">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-sm font-bold uppercase tracking-wider text-on-surface">Verified Results</span>
                </div>
                <div className="text-3xl font-headline font-bold">92.4%</div>
                <div className="text-xs text-outline">Taux de satisfaction des membres (Q3 2024)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Disclaimer */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="bg-surface-container-low p-8 md:p-12 rounded border-l-4 border-tertiary-container relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl font-bold">warning</span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-3xl">report_problem</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-2 tracking-tight">AVERTISSEMENT SUR LES RISQUES</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-4xl">
                  Le trading sur instruments financiers comporte un niveau de risque élevé et peut ne pas convenir à tous les investisseurs. L&apos;effet de levier peut fonctionner aussi bien à votre désavantage qu&apos;à votre avantage. Avant de décider de trader, vous devez examiner attentivement vos objectifs d&apos;investissement, votre niveau d&apos;expérience et votre appétit pour le risque. Il est possible que vous subissiez une perte de tout ou partie de votre capital investi. <strong>Les performances passées ne sont pas indicatives des résultats futurs.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Paroles de Membres */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Paroles de <span className="text-primary">Membres</span></h2>
            <div className="text-outline text-sm uppercase tracking-widest font-bold font-label">Video Archives</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg bg-surface-container-high aspect-video md:aspect-auto">
              <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEPRWx4yY1WWEKjAR2PO4y9-7T0LUgcY3cv7Fhy-2MigyVsFk4zBr7sDN-Lcc66vl1JhPg3HrT6N9q6-UGZ2mVju-LyVqJB8OE_LBs1Kw85MA70frefLGv-2BgTRPJ-sc47aKrD3UZ3_AvrlGK8j6Yn7x-riXBLaxmkYOl9Ni-3Onw_vVp4P-VPbFai4ucU9kgQZsyg3AoV501OLZxBd4ZbIEqjEWUySFAqvd2ELMOGMIkVtflr1Mh-foP-VjFm0FHt8D9itYcoNY" alt="Sarah Testimonial" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-all">
                  <span className="material-symbols-outlined text-4xl text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-8">
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-label">Member Highlight</div>
                <h4 className="text-2xl font-headline font-bold">De Débutante à Analyste Confirmée</h4>
                <p className="text-outline text-sm mt-2">Le parcours de Sarah sur 18 mois au sein de One Pips.</p>
              </div>
            </div>

            <div className="md:col-span-2 relative group overflow-hidden rounded-lg bg-surface-container-high aspect-video md:aspect-auto">
              <img className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6eZyxZThkcZBpzfxKEZ4g-pKoF_m6BOZUyBWNubOHnjhkg2CcxD2rU3A8mYJz0SXOv-Z-NlWoLgLdZ9dVRGY3Muk2TYMAIKtw60xkdtQpgB0DkDjKr_UbypMFIC--lbu0HSpuIzB3rLQlWn66dW8ld-9p_DQ7vme6xFAvPAG4mqLymBovLEkDT6bOmV26a_RYYib104ec3tjnWT0_PM7QfmgAAq8NSJPPSDFwnobgOozqL1k3SWULRXRn6MK9d52tGVZI3F_I7A0" alt="Thomas Testimonial" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-2xl text-on-surface">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-lg font-headline font-bold">Maîtriser la Psychologie</h4>
                <div className="text-xs text-outline mt-1 font-bold font-label">Thomas, Trader Forex</div>
              </div>
            </div>

            <div className="md:col-span-1 relative group overflow-hidden rounded-lg bg-surface-container-high aspect-square md:aspect-auto">
              <img className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtOuJ5md_xAMGSzjtX-BCzMZBKbtVSkyyy3-gkw1Onxb4Tv4b8PnlG8q4l00pJPTcx1LXilOJN4GlVXQZOH2CB10eMQDraNYslgr9NCXgEGsX4llzyVSF-0OZH9cvezwjgMF5qIl9Iq9o0r-XPZio2BFJBbG6aBtdqhncV3cbRwmdizrTLYgVtSRRbytXcdfoqZyqllUDz7_3yzxXt75Qty1a2tG3AXVAem16JzLwrojMIK6Bah13rhbkhq0ugEz2dz3L5T5e_U_Y" alt="Testimonial 3" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-xl text-on-surface">play_arrow</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 relative group overflow-hidden rounded-lg bg-surface-container-high aspect-square md:aspect-auto">
              <img className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsauq0PrIY9Z4X3MBna2uGqpsPgILZ-a9E6P8umzYzJ0OrrbDHSxsnLChj3236YJSAb_0ByIDUganh00TdhMSi57o2YCUbi8QFQXT0EXuqsDcp1hUM8qef9zcXMYOJ7TX7fScekdIdT0vVbgwV-uATyRjHPZIwjJhyl6tgxV_uneDKj5nNHdWW_UcivcWlBEtc2JUtLhqFK2cfpSEtl2GPr_jGsFCBDdTi7WIY6T5H0R5jMzEVlj5ZLr7MOpYQdEbDQ154FedgGms" alt="Testimonial 4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary/20 transition-all">
                  <span className="material-symbols-outlined text-xl text-on-surface">play_arrow</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Results Grid */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-headline font-bold mb-4">Captures d&apos;Écran <span className="text-primary">Directes</span></h2>
              <p className="text-outline max-w-xl mx-auto">Par souci de confidentialité et de protection des stratégies propriétaires, certaines données sont partiellement floutées. Accès complet disponible via notre espace membre.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { gain: "+4.2%", pair: "EUR/USD Session" },
                { gain: "+12.8%", pair: "Weekly PNL Recap" },
                { gain: "+2.1%", pair: "Gold Scalp" },
                { gain: "+7.5%", pair: "Swing Position" },
              ].map((res, i) => (
                <div key={i} className="group relative aspect-square rounded overflow-hidden bg-surface-container-lowest flex flex-col items-center justify-center p-4">
                  <div className="absolute inset-0 blur-md opacity-30 group-hover:opacity-50 transition-opacity">
                    <img className="w-full h-full object-cover" src={`https://lh3.googleusercontent.com/aida-public/AB6AXuDo4zWlLqsuZlWzzWZe0NZazj3bY5rrA7YJAgoVQczLo2DLXsseSnerNZhgqK02Jtv3ZPjmLCn4xHbtR9xFu04autgab-OnmahPhFS4Pz4699U5FnqzFzlZFb31fpwLPPBASWgX7MVgt5AIdw0AeKAVo06oP7N8K5TeMcAnnyCAfyNbH9RkF9crJ76i9kdGFfN1fCsdpyCb3BGuAhCjGm8W_YH-WL6Y2qNuurA9VdFN4Nl8bBuMkD5Gpo1aUgWFpm_sDMnfOe0iwgc`} alt={`Result ${i}`} />
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="text-primary font-headline font-bold text-3xl mb-1">{res.gain}</div>
                    <div className="text-xs uppercase tracking-tighter text-outline font-label">{res.pair}</div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="material-symbols-outlined text-outline-variant text-sm">visibility_off</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <button className="bg-surface-container border border-outline-variant/30 px-8 py-4 rounded-full flex items-center gap-3 hover:bg-surface-container-high transition-all group">
                <span className="text-on-surface font-semibold">Voir plus de résultats (Espace Membre)</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="glass-card p-12 rounded-xl text-center border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10"></div>
            <h2 className="text-4xl font-headline font-bold mb-6">Prêt à changer votre <span className="text-gradient">approche ?</span></h2>
            <p className="text-outline text-lg max-w-2xl mx-auto mb-10">
              Ne vous contentez pas de regarder les autres réussir. Intégrez une communauté où la transparence est la norme et la performance la priorité.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Button
                onClick={() => window.location.href = "/candidature"}
                className="bg-primary-container text-on-primary-container px-10 py-8 rounded font-headline font-bold text-lg active:scale-95 transition-all hover:bg-primary-container/90">
                Candidater Maintenant
              </Button>
              <Button
                onClick={() => window.location.href = "/offres"}
                className="bg-surface-container border border-outline-variant/50 text-on-surface px-10 py-8 rounded font-headline font-bold text-lg hover:bg-surface-container-high active:scale-95 transition-all">
                Consulter les Offres
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
