export default function AdminEventsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Gestion des Lives</h1>
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 flex items-center justify-center min-h-[400px]">
        <button className="bg-primary text-on-primary px-12 py-4 rounded-xl font-bold shadow-2xl hover:scale-105 transition-all">Créer un Nouvel Event</button>
      </div>
    </main>
  );
}
