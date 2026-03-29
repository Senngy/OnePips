export default function AdminPaymentsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Paiements & Abonnements</h1>
      <div className="bg-surface-container p-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold">Intégration Stripe</h3>
          <p className="text-outline text-sm">Gestion des abonnements et historique financier.</p>
        </div>
        <div className="bg-primary-container px-4 py-1 rounded text-on-primary-container font-black text-xs uppercase">Connecté</div>
      </div>
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 italic text-outline">
        Historique des transactions...
      </div>
    </main>
  );
}
