"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-background docked full-width top-0 z-50 shadow-[0_40px_40px_rgba(210,187,255,0.06)] fixed w-full border-b border-outline-variant/10">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter text-on-background font-headline hover:opacity-80 transition-opacity"
        >
          One Pips
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center font-headline font-bold tracking-tight">
          {[
            { label: "Home", href: "/" },
            { label: "Méthode", href: "/methode" },
            { label: "Résultats", href: "/resultats" },
            { label: "Offres", href: "/offres" },
            { label: "Live", href: "/live" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-outline hover:text-on-surface hover:bg-surface-container transition-all duration-300 px-3 py-1 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/candidature"
          className="bg-primary-container text-on-primary-container px-6 py-2 font-headline font-bold scale-95 active:scale-90 transition-transform rounded-md flex items-center gap-2 hover:brightness-110"
        >
          Candidater
        </Link>
      </nav>
    </header>
  );
}
