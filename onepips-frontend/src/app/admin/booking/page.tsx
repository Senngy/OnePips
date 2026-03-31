import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminBookingPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Prise de Rendez-vous</h1>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex gap-3">
              <div className="flex bg-surface-container-low p-1 rounded-lg">
                <button
                  className="px-4 py-2 rounded-md bg-surface-container-highest text-primary text-xs font-bold transition-all">
                  <span className="material-symbols-outlined text-sm inline-block align-middle mr-1">list</span>
                  LIST
                </button>
                <button
                  className="px-4 py-2 rounded-md text-outline hover:text-on-surface text-xs font-bold transition-all">
                  <span
                    className="material-symbols-outlined text-sm inline-block align-middle mr-1">calendar_view_month</span>
                  CALENDAR
                </button>
              </div>
              <button
                className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-md text-sm font-bold active:scale-95 transition-transform flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span>
                NEW APPOINTMENT
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] text-outline font-bold tracking-widest uppercase mb-1">TOTAL BOOKINGS</p>
              <p className="text-2xl font-headline font-bold text-on-surface">1,284</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] text-outline font-bold tracking-widest uppercase mb-1">COMPLETED</p>
              <p className="text-2xl font-headline font-bold text-on-surface">842</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] text-outline font-bold tracking-widest uppercase mb-1">PENDING</p>
              <p className="text-2xl font-headline font-bold text-primary">12</p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/5">
              <p className="text-[10px] text-outline font-bold tracking-widest uppercase mb-1">NO-SHOW RATE</p>
              <p className="text-2xl font-headline font-bold text-tertiary">4.2%</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-highest/30">
                    <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase">Date
                      &amp; Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase">Client
                      Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase">
                      Associated Lead</th>
                    <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase">Status
                    </th>
                    <th
                      className="px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase text-right">
                      Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Oct 24, 2023</span>
                        <span className="text-xs text-outline font-mono">14:30 EST</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-md bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">
                          JD
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Julianne Deville</span>
                          <span className="text-[10px] text-outline">julianne.d@corporate.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-2 py-1 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/10 italic">Obsidian
                        Tier Prospect</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        Scheduled
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Reschedule">
                          <span className="material-symbols-outlined text-lg">event_repeat</span>
                        </button>
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Mark Status">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Oct 23, 2023</span>
                        <span className="text-xs text-outline font-mono">09:00 EST</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-md bg-secondary-container/20 flex items-center justify-center text-secondary font-bold text-xs">
                          MT
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Marcus Thorne</span>
                          <span className="text-[10px] text-outline">m.thorne@vanguard.io</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-2 py-1 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/10 italic">High
                        Net Worth Lead</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Reschedule">
                          <span className="material-symbols-outlined text-lg">event_repeat</span>
                        </button>
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Mark Status">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Oct 22, 2023</span>
                        <span className="text-xs text-outline font-mono">11:15 EST</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-md bg-error-container/20 flex items-center justify-center text-error font-bold text-xs">
                          SL
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Sarah Lin</span>
                          <span className="text-[10px] text-outline">lin.s@wealth.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-2 py-1 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/10 italic">Institutional
                        Partner</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider border border-error/20">
                        No-Show
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Reschedule">
                          <span className="material-symbols-outlined text-lg">event_repeat</span>
                        </button>
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Mark Status">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">Oct 21, 2023</span>
                        <span className="text-xs text-outline font-mono">16:00 EST</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-md bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">
                          RB
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Richard Brooks</span>
                          <span className="text-[10px] text-outline">rbrooks@traderhub.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-2 py-1 rounded bg-surface-container-highest text-[10px] font-bold text-on-surface-variant border border-outline-variant/10 italic">Standard
                        Lead</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        Scheduled
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Reschedule">
                          <span className="material-symbols-outlined text-lg">event_repeat</span>
                        </button>
                        <button
                          className="p-2 rounded hover:bg-surface-container-highest text-outline hover:text-primary transition-colors"
                          title="Mark Status">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div
              className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-lowest/50">
              <p className="text-[10px] text-outline font-medium">Showing 1 to 4 of 48 sessions</p>
              <div className="flex gap-2">
                <button
                  className="p-1.5 rounded bg-surface-container-high text-outline hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  className="p-1.5 rounded bg-primary-container text-on-primary-container font-bold text-[10px] px-3">1</button>
                <button
                  className="p-1.5 rounded bg-surface-container-high text-outline hover:text-on-surface transition-colors font-bold text-[10px] px-3">2</button>
                <button
                  className="p-1.5 rounded bg-surface-container-high text-outline hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          {/* Secondary Layout: Upcoming Summary Bento */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-8 border border-outline-variant/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline text-xl font-bold">Upcoming Intense Sessions</h3>
                <a className="text-xs font-bold text-primary tracking-widest hover:underline uppercase" href="#">View
                  Full Agenda</a>
              </div>
              <div className="space-y-6">
                <div
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary-container/5 transition-colors cursor-pointer group">
                  <div
                    className="flex flex-col items-center justify-center bg-surface-container-highest px-3 py-2 rounded-lg border border-outline-variant/10 min-w-[60px]">
                    <span className="text-xs font-bold text-primary uppercase">Oct</span>
                    <span className="text-xl font-bold text-on-surface">25</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Technical Deep Dive: Forex Risk Hedging</h4>
                    <p className="text-xs text-outline mt-1 line-clamp-1">With Client Julianne Deville &amp; Senior
                      Strategist Marcus. Focus on APAC markets.</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-[10px] text-outline">
                        <span className="material-symbols-outlined text-xs">schedule</span> 14:30 - 15:30
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-outline">
                        <span className="material-symbols-outlined text-xs">videocam</span> Google Meet
                      </span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <div
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary-container/5 transition-colors cursor-pointer group">
                  <div
                    className="flex flex-col items-center justify-center bg-surface-container-highest px-3 py-2 rounded-lg border border-outline-variant/10 min-w-[60px]">
                    <span className="text-xs font-bold text-primary uppercase">Oct</span>
                    <span className="text-xl font-bold text-on-surface">27</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                      Portfolio Review - Q4 Projection</h4>
                    <p className="text-xs text-outline mt-1 line-clamp-1">Analysis of crypto assets and volatile
                      commodities for Obsidian Tier members.</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-[10px] text-outline">
                        <span className="material-symbols-outlined text-xs">schedule</span> 10:00 - 11:30
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-outline">
                        <span className="material-symbols-outlined text-xs">videocam</span> Zoom Secure
                      </span>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
            {/* Side Info: Market Status & Alerts */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/5">
              <h3 className="font-headline text-lg font-bold mb-6">Booking Alerts</h3>
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-tertiary/10 border-l-2 border-tertiary">
                  <div className="flex items-center gap-2 text-tertiary mb-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">High Volatility Alert</span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">Consider rescheduling 3 calls during the NFP
                    release tomorrow at 08:30 EST.</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border-l-2 border-primary">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">New Obsidian Lead</span>
                  </div>
                  <p className="text-xs text-on-surface leading-relaxed">A high-priority lead just booked their first
                    consultation. Review profile now.</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/10">
                <p className="text-[10px] text-outline font-bold tracking-widest uppercase mb-4">Calendar Health</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.4)]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface">85%</span>
                </div>
                <p className="text-[10px] text-outline leading-tight">Current occupancy for the next 7 days across all
                  analyst channels.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
