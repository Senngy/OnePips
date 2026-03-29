export default function AdminLeadsPage() {
  return (
    <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
      <h1 className="text-4xl font-headline font-bold mb-8">Gestion des Leads</h1>
      <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/10 overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant/10 font-bold bg-surface-container-high">
              <th className="p-4">Nom</th>
              <th className="p-4">Email</th>
              <th className="p-4">Score</th>
              <th className="p-4">Statut</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-outline-variant/5">
              <td className="p-4">Jean Dupont</td>
              <td className="p-4">jean@example.com</td>
              <td className="p-4"><span className="text-primary font-bold">85</span></td>
              <td className="p-4"><span className="bg-primary/20 text-primary-fixed-dim px-2 py-1 rounded-full text-xs uppercase font-bold">Chaud</span></td>
              <td className="p-4"><button className="text-outline hover:text-on-surface underline">Voir détail</button></td>
            </tr>
            {/* Table placeholder */}
          </tbody>
        </table>
      </div>
    </main>
  );
}
