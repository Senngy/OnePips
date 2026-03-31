"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    { name: "Payments", href: "/admin/payments", icon: "payments" },
    { name: "Events", href: "/admin/events", icon: "calendar_month" },
    { name: "Analytics", href: "/admin/analytics", icon: "leaderboard" },
    { name: "Settings", href: "/admin/settings", icon: "settings" },
    { name: "Community", href: "/admin/community", icon: "group" },
];
const mainNavItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { name: "Leads", href: "/admin/leads", icon: "group" },
    { name: "Applications", href: "/admin/applications", icon: "assignment" },
    { name: "Booking", href: "/admin/booking", icon: "event_available" },
]

export default function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    return (
        <>
            {/* 🔻 MENU OVERLAY */}
            {open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end">
                    <div className="w-lg bg-[#1B1B1F] rounded-t-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Menu</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[#2A2A2F] text-white"
                                >
                                    <span className="material-symbols-outlined">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full mt-4 py-3 bg-[#7C3AED] rounded-lg text-white font-bold"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* 🔻 BOTTOM NAV */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#131317] border-t border-outline-variant/10 px-6 py-3 flex justify-between items-center z-50">

                {/* LEFT ITEMS */}
                {mainNavItems.slice(0, 2).map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center text-xs ${isActive ? "text-primary" : "text-outline"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}

                {/* CENTER BUTTON */}
                <button
                    onClick={() => setOpen(!open)}
                    className="relative -top-6 w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg"
                >
                    <span className="material-symbols-outlined text-white text-2xl">
                        menu
                    </span>
                </button>

                {/* RIGHT ITEMS */}
                {mainNavItems.slice(2).map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center text-xs ${isActive ? "text-primary" : "text-outline"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            {/* MENU OVERLAY */}
            {open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end">
                    <div className="w-full bg-[#1B1B1F] rounded-t-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-white mb-4">Menu</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[#2A2A2F] text-white"
                                >
                                    <span className="material-symbols-outlined">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="w-full mt-4 py-3 bg-[#7C3AED] rounded-lg text-white font-bold"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#131317] border-t border-outline-variant/10 px-6 py-3 flex justify-between items-center z-50">

                {/* LEFT ITEMS */}
                {mainNavItems.slice(0, 2).map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center text-xs ${isActive ? "text-primary" : "text-outline"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}

                {/* CENTER BUTTON */}
                <button
                    onClick={() => setOpen(!open)}
                    className="relative -top-6 w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg"
                >
                    <span className="material-symbols-outlined text-white text-2xl">
                        menu
                    </span>
                </button>

                {/* RIGHT ITEMS */}
                {mainNavItems.slice(2).map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center text-xs ${isActive ? "text-primary" : "text-outline"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </>
    )
}