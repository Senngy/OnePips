const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: "bg-amber-400/15 text-amber-400 border-amber-400/25",
  ADMIN: "bg-primary-container/20 text-primary border-primary/25",
  MANAGER: "bg-sky-400/15 text-sky-300 border-sky-400/25",
  EDITOR: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
  VIEWER: "bg-surface-container-high text-outline border-outline-variant/25",
  CUSTOMER: "bg-surface-container-high text-outline border-outline-variant/25",
};

export default function RoleBadge({ role }: { role: string }) {
  const style =
    ROLE_STYLES[role] ??
    "bg-surface-container-high text-outline border-outline-variant/25";

  return (
    <span
      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${style}`}
    >
      {role.replace(/_/g, " ")}
    </span>
  );
}
