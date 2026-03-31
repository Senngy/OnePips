"use client";

import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminCommunityPage() {
    return (
        <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container">
            <Sidebar />
            <main className="flex min-h-screen flex-col p-24 bg-surface-container-low text-on-surface">
                <Navbar />
                <h1 className="text-4xl font-headline font-bold mb-8">Gestion de la Communauté</h1>
                <div className="bg-surface-container-high p-12 rounded-xl border border-outline-variant/10 text-center">
                    <p className="text-outline italic">Gestion des membres VIP, Discord, et contenu exclusif</p>
                </div>
            </main>
        </div>
    );
}