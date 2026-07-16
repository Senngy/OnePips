"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { getPageName } from "@/lib/helpers/page-name";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Navbar() {
    const pathname = usePathname();
    const pageName = getPageName(pathname);
    const router = useRouter();
    const { logout } = useAuth();
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const handleSignOut = async () => {
        await logout();
        router.push("/admin/login");
    };

    return (
        <header className="w-full sticky top-0 z-30 bg-[#131317] flex items-center justify-between px-8 py-4 shadow-[0_40px_40px_rgba(210,187,255,0.06)]">
            <div className="flex items-center gap-4">
                <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">Admin <span className="text-primary">{pageName}</span></h1>
                <div className="h-6 w-px bg-outline-variant/20 mx-2"></div>
                <p className="text-sm font-medium text-outline">System Pulse: Stable</p>
            </div>
            <div className="flex items-center gap-4 relative">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
                    <input className="bg-surface-container-lowest border border-outline-variant/15 text-sm rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-primary-container transition-all" placeholder="Command + K to search..." type="text" />
                </div>
                <button className="p-2 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="relative">
                    <button
                        className="p-2 text-outline hover:text-primary transition-colors"
                        onClick={() => setShowAccountMenu((current) => !current)}
                        aria-label="Compte"
                        type="button"
                    >
                        <span className="material-symbols-outlined">account_circle</span>
                    </button>
                    {showAccountMenu ? (
                        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                            <button
                                className="w-full px-4 py-3 text-left text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                                onClick={handleSignOut}
                                type="button"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
