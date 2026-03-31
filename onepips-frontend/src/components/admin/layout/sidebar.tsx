"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Leads", href: "/admin/leads", icon: "group" },
    { name: "Applications", href: "/admin/applications", icon: "assignment" },
    { name: "Booking", href: "/admin/booking", icon: "event_available" },
    { name: "Payments", href: "/admin/payments", icon: "payments" },
    { name: "Events", href: "/admin/events", icon: "calendar_month" },
    { name: "Analytics", href: "/admin/analytics", icon: "leaderboard" },
    { name: "Community", href: "/admin/community", icon: "group" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <aside className="h-screen hidden lg:flex w-64 fixed left-0 top-0 z-40 bg-[#1B1B1F] border-r border-[#4A4455]/15 flex flex-col py-8 px-4">
                <div className="mb-10 px-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded obsidian-gradient flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                    </div>
                    <span className="font-headline font-black text-[#D2BBFF] text-xl">
                        One Pips Admin
                    </span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all
                ${isActive
                                        ? "text-[#D2BBFF] border-r-2 border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/10"
                                        : "text-[#958DA1] hover:text-[#E4E1E7] hover:bg-[#1F1F23]"}`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="mt-auto p-4 bg-surface-container rounded-xl border-t border-outline-variant/10">
                    <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full object-cover grayscale opacity-80 border border-primary/20" alt="Close up portrait of professional analyst in dark office with violet ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUxPDK7q4l4iYSU6EPv4wliE-h8DhyAF_e26YBuOvddBIK-Wwvr0Ob1SFV2ZvOdw18Vig6J3BVkgIwz1Jkc0QCO_THW5F9oqgM8cRlebANXXkuWLoxx4YmFiniKHDg5vbMrN4ct6cG6bi2OX3weUCCeP43-RvUolSAZOsHvDQMlTpMfIFj7y2bFKiA5YbJOoSd5BqAA-BK_6Uajf38qdZC0RgCMPg-n_7QbxlhFiEGiYSLj4IrzkrnW7zKPw1vDJG6hTJXTcLkiD0" />
                        <div>
                            <p className="text-xs font-bold text-on-surface">Elite Analyst</p>
                            <p className="text-[10px] text-outline">Tier IV Access</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
