"use client";

export function ProblemSolution() {
  const problems = [
    {
      icon: "trending_down",
      title: "Perte de capital",
      text: "Trader sans plan, c'est comme parier au casino. Le marché finit toujours par tout reprendre."
    },
    {
      icon: "psychology_alt",
      title: "Confusion totale",
      text: "Trop d'indicateurs, trop d'avis contradictoires. La paralysie par l'analyse vous tue."
    },
    {
      icon: "person_off",
      title: "Solitude absolue",
      text: "Face à vos écrans, vos émotions prennent le dessus sans personne pour vous recadrer."
    }
  ];

  const solutions = [
    {
      icon: "architecture",
      title: "Méthode Strict",
      text: "Un workflow précis : Analyse -> Setup -> Exécution -> Journal."
    },
    {
      icon: "groups",
      title: "Encadrement 24/7",
      text: "Des coachs experts répondent à vos analyses en temps réel."
    },
    {
      icon: "hub",
      title: "Communauté Elite",
      text: "Partagez vos trades avec un groupe d'analystes déterminés."
    }
  ];

  return (
    <section className="py-24 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-headline font-bold mb-12 tracking-tight">Pourquoi 95% des traders échouent</h2>
            <div className="space-y-6">
              {problems.map((p, i) => (
                <div key={i} className="flex items-start gap-6 p-6 rounded-xl bg-surface-container-lowest border border-error/10">
                  <span className="material-symbols-outlined text-error text-3xl">{p.icon}</span>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                    <p className="text-outline text-sm">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-surface-container p-8 rounded-2xl border border-primary/20">
              <h3 className="text-3xl font-headline font-bold text-primary mb-12">L'écosystème One Pips</h3>
              <div className="space-y-8">
                {solutions.map((s, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">{s.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{s.title}</h4>
                      <p className="text-outline">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
