export default function BookingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-headline font-bold mb-4">Réserver un Appel</h1>
      <p className="text-outline mb-12 uppercase tracking-widest text-sm text-primary">Visible uniquement si qualifié</p>
      <div className="bg-surface-container p-12 rounded-xl border border-outline-variant/10 w-full max-w-4xl min-h-[600px] flex items-center justify-center">
        <p className="text-outline italic">Intégration Cal.com en attente...</p>
      </div>
    </main>
  );
}
