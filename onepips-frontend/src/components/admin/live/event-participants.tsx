"use client"

import { useEventParticipants } from "@/lib/hooks/useEventParticipant";

export function EventParticipants({ eventId }: { eventId: string }) {
    useEventParticipants(eventId);
    return (
        <>
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-headline font-bold">Active Participant Feed</h3>
                    <div className="flex gap-2">
                        <button className="text-xs px-3 py-1.5 bg-surface-container-high rounded text-on-surface">Top
                            Engagers</button>
                        <button className="text-xs px-3 py-1.5 text-outline">Latest</button>
                    </div>
                </div>
                <div className="bg-surface-container-low rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container border-b border-outline-variant/10">
                                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                                    Participant</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                                    Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest">
                                    Engagement</th>
                                <th
                                    className="px-6 py-4 text-[10px] font-bold text-outline uppercase tracking-widest text-right">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/5">
                            <tr className="hover:bg-surface-container/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                            AK</div>
                                        <div>
                                            <p className="text-sm font-bold">Avery Kinsley</p>
                                            <p className="text-[10px] text-outline">Pro Tier Member</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">CONNECTED</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary/20 rounded-full"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="material-symbols-outlined text-outline text-lg hover:text-on-surface"
                                        data-icon="chat">chat</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold text-secondary">
                                            JH</div>
                                        <div>
                                            <p className="text-sm font-bold">Julian Hearst</p>
                                            <p className="text-[10px] text-outline">Analyst Tier</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">CONNECTED</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary/20 rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary/20 rounded-full"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="material-symbols-outlined text-outline text-lg hover:text-on-surface"
                                        data-icon="chat">chat</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-surface-container/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            MS</div>
                                        <div>
                                            <p className="text-sm font-bold">Mila Sorensen</p>
                                            <p className="text-[10px] text-outline">Founder Elite</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-outline border border-outline-variant/30">IDLE</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                        <div className="w-4 h-1 bg-primary rounded-full"></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        className="material-symbols-outlined text-outline text-lg hover:text-on-surface"
                                        data-icon="chat">chat</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="px-6 py-4 border-t border-outline-variant/10 text-center">
                        <button className="text-xs font-bold text-primary tracking-widest uppercase">Load All
                            Participants (1,242)</button>
                    </div>
                </div>
            </div>
        </>
    );
}