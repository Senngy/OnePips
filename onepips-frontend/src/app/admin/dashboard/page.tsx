export default function AdminDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 shadow-lg">
          <p className="text-outline text-xs uppercase tracking-widest font-bold mb-2">Leads Today</p>
          <p className="text-3xl font-headline font-bold text-primary">12</p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 shadow-lg">
          <p className="text-outline text-xs uppercase tracking-widest font-bold mb-2">Conv. Rate</p>
          <p className="text-3xl font-headline font-bold text-primary">24%</p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 shadow-lg">
          <p className="text-outline text-xs uppercase tracking-widest font-bold mb-2">Revenus</p>
          <p className="text-3xl font-headline font-bold text-primary">€4,250</p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10 shadow-lg">
          <p className="text-outline text-xs uppercase tracking-widest font-bold mb-2">RDV Planifiés</p>
          <p className="text-3xl font-headline font-bold text-primary">8</p>
        </div>
      </div>
    </main>
  );
}
