export default function AdminSettingsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Paramètres du Site</h1>
      <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-outline mb-1">Nom de l'Académie</label>
            <input className="w-full bg-surface-container-high border border-outline-variant/10 p-2 rounded text-on-surface" defaultValue="One Pips" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-outline mb-1">Lien de Support</label>
            <input className="w-full bg-surface-container-high border border-outline-variant/10 p-2 rounded text-on-surface" defaultValue="https://t.me/onepips_support" />
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded font-bold uppercase text-xs tracking-widest">Sauvegarder</button>
        </div>
      </div>
    </main>
  );
}
