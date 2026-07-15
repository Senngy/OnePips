"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function TestPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-on-surface">Chargement...</p>;
  }

  return (
    <pre className="whitespace-pre-wrap break-words p-6 text-sm text-on-surface">
      {JSON.stringify(user, null, 2)}
    </pre>
  );
}
