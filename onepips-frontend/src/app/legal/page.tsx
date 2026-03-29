export default function LegalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Mentions Légales & Disclaimer</h1>
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 w-full max-w-4xl space-y-6">
        <section>
          <h3 className="text-xl font-bold mb-2 text-primary">Disclaimer Trading (TRÈS IMPORTANT)</h3>
          <p className="text-outline text-sm leading-relaxed">
            Le trading comporte des risques importants de perte en capital. Les informations fournies sur ce site ne constituent pas des conseils en investissement.
          </p>
        </section>
        <section className="pt-4 border-t border-outline-variant/10">
          <h3 className="text-xl font-bold mb-2">Mentions Légales</h3>
          <p className="text-outline text-sm">Contenu en attente de rédaction...</p>
        </section>
      </div>
    </main>
  );
}
