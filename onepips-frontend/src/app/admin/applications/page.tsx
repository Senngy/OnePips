export default function AdminApplicationsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-4">Candidatures</h1>
      <p className="text-outline mb-12">Dossiers détaillés et scoring des futurs traders élite.</p>
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 italic text-outline">
        Chargement des candidatures en cours...
      </div>
    </main>
  );
}
