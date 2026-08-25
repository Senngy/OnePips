import type { UserWithPerms } from "@/lib/services/users.service";

export default function UsersStats({ users }: { users: UserWithPerms[] }) {
  const total = users.length;
  const countByRole = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Staff" value={total} />
      <StatCard label="Admins" value={countByRole["ADMIN"] ?? 0} />
      <StatCard label="Managers" value={countByRole["MANAGER"] ?? 0} />
      <StatCard label="Éditeurs" value={countByRole["EDITOR"] ?? 0} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-container-low p-5 rounded-lg border border-outline-variant/5">
      <p className="text-[10px] text-outline uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-3xl font-headline font-bold">{value}</p>
    </div>
  );
}
