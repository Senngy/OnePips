import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import ApplicantTable from "@/components/admin/candidatures/applicant-table";

export default function AdminApplicationsPage() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* SideNavBar Integration */}
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {/* TopNavBar Integration */}
        <Navbar />

        {/* Content Canvas */}
        <div className="p-8 grid grid-cols-12 gap-8">
          {/* Filter & List Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Applications</h2>
                <p className="text-outline text-sm font-label uppercase tracking-widest mt-1">42 PENDING REVIEW</p>
              </div>
              <button className="flex items-center gap-2 text-primary-fixed-dim text-xs font-bold border border-primary-container/30 px-3 py-1.5 rounded-md hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                FILTER
              </button>
            </div>

            {/* Application List */}
            <ApplicantTable />


          </div>

          {/* Detailed View */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Profile Header */}
            <div className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-0"></div>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                <div className="relative">
                  <img className="w-24 h-24 rounded-2xl object-cover shadow-2xl"
                    alt="Portrait of a sophisticated professional male trader"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF-FXvGuEzb6ik827yanFwWtqn5VH3joga7dq_-P1UQNnSLTZyRmju-K0ZYmpu2TvwjOfv6IcVSnj27qLQN9zbpD3a63-l8QW0Lq4Xk9h2b0scPmq-hqz1TZkksZn3JI7IdJiKXN_dWx2wZ-PUcXFsUIfEp-9cg_XATxikCWbMYiuYbPSson8GkU3PJJENWlyPLQqIMUrwLlyjr6ZfJRIZHB-CrCWA-v7LnYnkQcU_sonfQNOJiBHvMIWJ6J10x_JPDtiS6psH_3g" />
                  <div className="absolute -bottom-2 -right-2 bg-primary p-1 rounded-lg">
                    <span className="material-symbols-outlined text-on-primary text-sm font-bold">verified</span>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Marcus Sterling</h1>
                    <span className="bg-surface-container-highest px-3 py-1 text-[10px] font-bold text-primary border border-primary/20 rounded-full tracking-widest">ID: #PX-8821</span>
                  </div>
                  <p className="text-outline text-base max-w-xl">London, UK • 6.2 Years Experience • High Frequency Specialist</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-md font-bold text-sm hover:brightness-110 active:scale-95 transition-all">APPROVE FOR FUNDING</button>
                    <button className="bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-md font-bold text-sm hover:bg-surface-bright active:scale-95 transition-all">REQUEST INTERVIEW</button>
                    <button className="bg-transparent border border-error/30 text-error px-6 py-2.5 rounded-md font-bold text-sm hover:bg-error/10 active:scale-95 transition-all">REJECT</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container p-6 border-t border-primary/20">
                <p className="text-outline text-[10px] font-black uppercase tracking-widest mb-4">Algorithmic Scoring</p>
                <div className="flex items-end gap-3">
                  <span className="font-headline text-5xl font-black text-primary">98</span>
                  <span className="text-outline text-xs mb-2">/ 100</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_10px_#d2bbff]" style={{ width: '98%' }}></div>
                </div>
                <p className="text-[10px] mt-4 text-on-surface-variant font-medium">Top 0.5% of applicants this quarter.</p>
              </div>
              <div className="bg-surface-container p-6 border-t border-outline-variant/30">
                <p className="text-outline text-[10px] font-black uppercase tracking-widest mb-4">Historical Win Rate</p>
                <div className="flex items-end gap-3">
                  <span className="font-headline text-5xl font-black text-on-surface">72%</span>
                </div>
                <div className="flex items-center gap-1 mt-4 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +4.2% Consistency
                </div>
                <p className="text-[10px] mt-4 text-outline font-medium">Based on 1,200 verified executions.</p>
              </div>
              <div className="bg-surface-container p-6 border-t border-outline-variant/30">
                <p className="text-outline text-[10px] font-black uppercase tracking-widest mb-4">Risk Profile</p>
                <span className="inline-block bg-tertiary-container/20 text-tertiary border border-tertiary/30 px-4 py-1.5 rounded text-xl font-headline font-bold">MODERATE</span>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-outline">Max Drawdown</span>
                  <span className="text-xs font-bold text-error">4.1%</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-outline">Profit Factor</span>
                  <span className="text-xs font-bold text-on-surface">3.2</span>
                </div>
              </div>
            </div>

            {/* Detail Tabs & History */}
            <div className="bg-surface-container rounded-xl overflow-hidden">
              <div className="flex border-b border-outline-variant/10">
                <button className="px-8 py-4 text-xs font-bold tracking-widest text-primary border-b-2 border-primary bg-primary/5 uppercase">Form Responses</button>
                <button className="px-8 py-4 text-xs font-bold tracking-widest text-outline hover:text-on-surface transition-colors uppercase">Interaction History</button>
                <button className="px-8 py-4 text-xs font-bold tracking-widest text-outline hover:text-on-surface transition-colors uppercase">Strategy Documents</button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div>
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Core Trading Methodology</label>
                    <p className="text-on-surface text-sm leading-relaxed">Systematic scalp strategy utilizing order flow imbalance and institutional liquidity pockets. Focused on EUR/USD and GBP/JPY during New York overlap.</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Monthly Volume Projection</label>
                    <p className="text-on-surface text-sm leading-relaxed">$50M - $120M Notional. Requires high-leverage execution environment with sub-5ms latency.</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Previous Funding</label>
                    <p className="text-on-surface text-sm leading-relaxed">FTMO ($200k), MyForexFunds ($300k). Successfully withdrew over $140k in 18 months.</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Crisis Management Protocol</label>
                    <p className="text-on-surface text-sm leading-relaxed">Auto-kill switch at 2% daily drawdown. Hard stop for all positions during NFP and FOMC announcements.</p>
                  </div>
                </div>

                {/* Interaction Timeline */}
                <div className="pt-8 border-t border-outline-variant/10">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">history</span>
                    RECENT ACTIVITY LOG
                  </h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_#d2bbff]"></div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Background screening completed by automated system</p>
                        <p className="text-[10px] text-outline mt-1 uppercase">Today, 09:12 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-outline-variant mt-1.5"></div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant">Identity verified via SumSub portal</p>
                        <p className="text-[10px] text-outline mt-1 uppercase">Today, 08:45 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-outline-variant mt-1.5"></div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant">Application submitted via Mobile Tier 3 portal</p>
                        <p className="text-[10px] text-outline mt-1 uppercase">Today, 08:32 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}
