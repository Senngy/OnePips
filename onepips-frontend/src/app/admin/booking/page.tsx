export default function AdminBookingPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Calendrier des Appels</h1>
      <div className="bg-surface-container-high p-12 rounded-xl border border-outline-variant/10 text-center">
        <p className="text-outline italic">Liste des rendez-vous et statut (Fait / No-show)</p>
      </div>
    </main>
  );
}
