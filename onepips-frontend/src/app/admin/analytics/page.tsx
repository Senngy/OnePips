export default function AdminAnalyticsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-4">Sources de Trafic</h3>
          <p className="text-outline text-sm">(TikTok / Insta / YouTube)</p>
        </div>
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10">
          <h3 className="text-xl font-bold mb-4">Taux de Conversion Funnel</h3>
          <p className="text-outline text-sm">Candidature -&gt; Booking -&gt; Vente</p>
        </div>
      </div>
    </main>
  );
}
