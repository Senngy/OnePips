import InvitationForm from "@/components/admin/invitation/invitation-form";

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const tokenRaw = params.token;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-on-surface px-6">
        <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 max-w-md w-full text-center space-y-3">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-error text-4xl">
              link_off
            </span>
          </div>
          <h1 className="text-2xl font-headline font-bold">
            Lien d&apos;invitation invalide
          </h1>
          <p className="text-sm text-outline">
            Le jeton d&apos;invitation est manquant. Veuillez utiliser le lien
            complet reçu par email.
          </p>
        </div>
      </div>
    );
  }

  return <InvitationForm token={token} />;
}
