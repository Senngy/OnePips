import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminLeadsPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      {/* TopNavBar */}
      <Sidebar />


      {/* Main Content Canvas */}
      <main className="ml-64 min-h-screen">
        {/* Header Section */}
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Prospection</h1>
          {/* Filters & Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="col-span-1 md:col-span-2 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="w-full bg-surface-container-low border-none rounded-lg pl-12 pr-4 py-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-outline/50"
                placeholder="Search name, email, or institutional tag..." type="text" />
            </div>
            <div>
              <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 cursor-pointer">
                <option value="">All Statuses</option>
                <option value="hot">Hot (Ready)</option>
                <option value="pending">Pending Review</option>
                <option value="cold">Cold (Archived)</option>
              </select>
            </div>
            <div>
              <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 cursor-pointer">
                <option value="">Score Range</option>
                <option value="90">90 - 100 (Elite)</option>
                <option value="70">70 - 89 (Prime)</option>
                <option value="50">50 - 69 (Stable)</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest border-b border-outline-variant/5">
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Client Identity</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold text-center">Engine Score</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Status</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold">Entry Date</th>
                    <th className="px-6 py-5 text-[10px] uppercase tracking-widest text-outline font-bold text-right">Strategic Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">JA</div>
                        <div>
                          <div className="text-sm font-semibold text-on-surface">Julianne Abernathy</div>
                          <div className="text-[11px] text-outline">j.abernathy@luxcapital.io</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-headline font-bold text-primary">94</span>
                        <div className="w-24 h-1 bg-secondary-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.4)]" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                        HOT LEAD
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-outline font-medium">Oct 24, 2023</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded" title="Tag Lead">
                          <span className="material-symbols-outlined text-lg">sell</span>
                        </button>
                        <button className="p-2 text-outline hover:text-error hover:bg-error-container/10 transition-all rounded" title="Reject">
                          <span className="material-symbols-outlined text-lg">do_not_disturb_on</span>
                        </button>
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded" title="Accept">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </button>
                        <button className="ml-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-md hover:bg-primary transition-all hover:text-on-primary">Details</button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary font-bold">EV</div>
                        <div>
                          <div className="text-sm font-semibold text-on-surface">Erik Vanswijk</div>
                          <div className="text-[11px] text-outline">vanswijk.crypto@proton.me</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-headline font-bold text-outline">58</span>
                        <div className="w-24 h-1 bg-secondary-container rounded-full overflow-hidden">
                          <div className="h-full bg-outline shadow-none" style={{ width: '58%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-variant text-on-surface-variant border border-outline-variant/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant mr-2"></span>
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-outline font-medium">Oct 23, 2023</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">sell</span></button>
                        <button className="p-2 text-outline hover:text-error hover:bg-error-container/10 transition-all rounded"><span className="material-symbols-outlined text-lg">do_not_disturb_on</span></button>
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                        <button className="ml-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-md hover:bg-primary transition-all hover:text-on-primary">Details</button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary font-bold">MK</div>
                        <div>
                          <div className="text-sm font-semibold text-on-surface">Mads Kelsen</div>
                          <div className="text-[11px] text-outline">mads.trades@outlook.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-headline font-bold text-tertiary">12</span>
                        <div className="w-24 h-1 bg-secondary-container rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary shadow-none" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container/20 text-tertiary border border-error/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-2"></span>
                        COLD LEAD
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-outline font-medium">Oct 21, 2023</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">sell</span></button>
                        <button className="p-2 text-outline hover:text-error hover:bg-error-container/10 transition-all rounded"><span className="material-symbols-outlined text-lg">do_not_disturb_on</span></button>
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                        <button className="ml-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-md hover:bg-primary transition-all hover:text-on-primary">Details</button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-fixed font-bold">SR</div>
                        <div>
                          <div className="text-sm font-semibold text-on-surface">Sophia Rossi</div>
                          <div className="text-[11px] text-outline">rossi.invest@gmail.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-headline font-bold text-primary">88</span>
                        <div className="w-24 h-1 bg-secondary-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.3)]" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                        HOT LEAD
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-outline font-medium">Oct 19, 2023</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">sell</span></button>
                        <button className="p-2 text-outline hover:text-error hover:bg-error-container/10 transition-all rounded"><span className="material-symbols-outlined text-lg">do_not_disturb_on</span></button>
                        <button className="p-2 text-outline hover:text-primary hover:bg-surface-container transition-all rounded"><span className="material-symbols-outlined text-lg">check_circle</span></button>
                        <button className="ml-2 px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs font-bold rounded-md hover:bg-primary transition-all hover:text-on-primary">Details</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-surface-container-lowest px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-outline">Displaying 1-10 of 1,284 results</span>
              <div className="flex items-center gap-2">
                <button className="p-2 text-outline hover:text-on-surface disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary-container text-on-primary-container text-xs font-bold">1</button>
                <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">2</button>
                <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">3</button>
                <span className="text-outline mx-1">...</span>
                <button className="w-8 h-8 rounded bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors">128</button>
                <button className="p-2 text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento-style Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] uppercase tracking-widest text-outline font-bold">Daily Conversion</h4>
                <span className="material-symbols-outlined text-primary">trending_up</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">24.8%</span>
                <span className="text-xs text-primary font-bold">+2.4%</span>
              </div>
              <p className="text-[11px] text-outline mt-2">Conversion from Lead to Qualified Applicant is peaking.</p>
            </div>
            <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] uppercase tracking-widest text-outline font-bold">Pending Review</h4>
                <span className="material-symbols-outlined text-on-surface-variant">hourglass_empty</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">42</span>
                <span className="text-[11px] text-outline">High-priority items</span>
              </div>
              <p className="text-[11px] text-outline mt-2">Current SLA: 4.2 hours remaining on top priority.</p>
            </div>
            <div className="bg-primary-container/10 p-6 rounded-xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold">Engine Quality</h4>
                <span className="material-symbols-outlined text-primary">verified</span>
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-3xl font-headline font-bold text-primary">98.2</span>
                <span className="text-[11px] text-primary/70">Algorithm Confidence</span>
              </div>
              <p className="text-[11px] text-primary/70 mt-2 relative z-10">Scoring model v4.2 is stable and optimized.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
