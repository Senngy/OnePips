import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminAnalyticsPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Tableau de Bord</h1>

          <section className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Bento Grid: Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 p-7 rounded-lg bg-surface-container relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50">
                </div>
                <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Total Platform Traffic</p>
                <div className="flex items-end gap-4">
                  <h2 className="text-4xl font-headline font-bold text-on-background">142,890</h2>
                  <span className="flex items-center text-primary text-sm font-bold mb-1">
                    <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                    12.4%
                  </span>
                </div>
                <div className="mt-6 h-16 w-full flex items-end gap-1">
                  {/* Simulated Chart Bars */}
                  <div className="flex-1 bg-primary/10 h-1/2 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/20 h-2/3 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/10 h-1/3 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/40 h-3/4 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/60 h-full rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/30 h-1/2 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/20 h-2/3 rounded-t-sm"></div>
                  <div className="flex-1 bg-primary/50 h-5/6 rounded-t-sm"></div>
                </div>
              </div>
              <div className="p-7 rounded-lg bg-surface-container-low border border-outline-variant/5">
                <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Active Funnel</p>
                <h2 className="text-3xl font-headline font-bold text-on-background">8.4%</h2>
                <p className="text-xs text-on-surface-variant mt-2">Global Conv. Rate</p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary-container overflow-hidden">
                    <div className="h-full w-[8.4%] bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]"></div>
                  </div>
                </div>
              </div>
              <div className="p-7 rounded-lg bg-surface-container-low border border-outline-variant/5">
                <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Net Profit Forecast</p>
                <h2 className="text-3xl font-headline font-bold text-on-background">$48.2k</h2>
                <p className="text-xs text-on-surface-variant mt-2">Next 14 Days</p>
                <div className="mt-6 flex justify-end">
                  <span className="material-symbols-outlined text-primary/40 text-4xl"
                    data-icon="query_stats">query_stats</span>
                </div>
              </div>
            </div>
            {/* Funnel Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-surface-container rounded-lg p-8">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="font-headline text-xl font-bold">Funnel Velocity</h3>
                    <p className="text-sm text-outline mt-1">Deep-dive into multi-stage conversion drops</p>
                  </div>
                  <button
                    className="text-xs font-label uppercase tracking-widest text-primary border-b border-primary/30 pb-0.5">Full
                    Audit</button>
                </div>
                <div className="space-y-6">
                  {/* Stage 1 */}
                  <div className="relative group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold tracking-tight">Stage 01: Landing Page</span>
                      <span className="text-xs font-mono text-primary">142,890 Users</span>
                    </div>
                    <div className="h-10 bg-surface-container-lowest rounded-md flex overflow-hidden">
                      <div className="h-full bg-primary/40 w-full flex items-center px-4">
                        <span className="text-[10px] font-black tracking-tighter text-on-primary-container">AD
                          IMPRESSION &amp; DIRECT</span>
                      </div>
                    </div>
                  </div>
                  {/* Dropoff 1 */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <div
                      className="bg-surface-variant px-3 py-1 rounded text-[10px] font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs"
                        data-icon="keyboard_double_arrow_down">keyboard_double_arrow_down</span> 68.2%
                      DROPOFF
                    </div>
                  </div>
                  {/* Stage 2 */}
                  <div className="relative group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold tracking-tight">Stage 02: Application Submitted</span>
                      <span className="text-xs font-mono text-primary">45,439 Users</span>
                    </div>
                    <div className="h-10 bg-surface-container-lowest rounded-md flex overflow-hidden">
                      <div className="h-full bg-primary/60 w-[31%] flex items-center px-4">
                        <span className="text-[10px] font-black tracking-tighter text-on-primary-container">FORM
                          COMPLETED</span>
                      </div>
                    </div>
                  </div>
                  {/* Dropoff 2 */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <div
                      className="bg-surface-variant px-3 py-1 rounded text-[10px] font-bold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs"
                        data-icon="keyboard_double_arrow_down">keyboard_double_arrow_down</span> 74.8%
                      DROPOFF
                    </div>
                  </div>
                  {/* Stage 3 */}
                  <div className="relative group">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold tracking-tight">Stage 03: Payment Success</span>
                      <span className="text-xs font-mono text-primary">11,450 Users</span>
                    </div>
                    <div className="h-10 bg-surface-container-lowest rounded-md flex overflow-hidden">
                      <div
                        className="h-full bg-primary w-[8%] flex items-center px-4 shadow-[0_0_15px_rgba(210,187,255,0.3)]">
                        <span
                          className="text-[10px] font-black tracking-tighter text-on-primary-container">CONVERTED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Traffic Sources Breakdown */}
              <div className="bg-surface-container-low rounded-lg p-8 border border-outline-variant/10">
                <h3 className="font-headline text-xl font-bold mb-8">Traffic Sources</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded bg-[#FE2C55]/10 flex items-center justify-center text-[#FE2C55]">
                      <span className="material-symbols-outlined" data-icon="video_library">video_library</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">TikTok Ads</span>
                        <span className="text-on-surface-variant">42%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-[#FE2C55] w-[42%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded bg-[#E4405F]/10 flex items-center justify-center text-[#E4405F]">
                      <span className="material-symbols-outlined" data-icon="camera">camera</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Instagram</span>
                        <span className="text-on-surface-variant">35%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-[#E4405F] w-[35%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" data-icon="search">search</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Organic SEO</span>
                        <span className="text-on-surface-variant">18%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[18%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded bg-outline/10 flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined" data-icon="more_horiz">more_horiz</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">Other</span>
                        <span className="text-on-surface-variant">5%</span>
                      </div>
                      <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-outline w-[5%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 p-4 bg-surface-container-lowest rounded-md border border-outline-variant/10">
                  <p className="text-[10px] font-label uppercase text-outline mb-2">Editor's Insight</p>
                  <p className="text-xs italic leading-relaxed text-on-surface-variant">"TikTok volume is up 4% this
                    week, however Instagram traffic shows a 2.4x higher LTV in Stage 03."</p>
                </div>
              </div>
            </div>
            {/* Heatmap / User Growth Visual */}
            <div className="bg-surface-container rounded-lg p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                  <h3 className="font-headline text-xl font-bold">Hourly Traffic Density</h3>
                  <p className="text-sm text-outline mt-1">Heatmap indicating peak system engagement</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-surface-container-highest rounded text-xs font-bold text-primary transition-all active:scale-95">EXPORT
                    DATA</button>
                  <button
                    className="px-4 py-2 bg-primary-container rounded text-xs font-bold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all active:scale-95">RECALIBRATE</button>
                </div>
              </div>
              {/* Grid Heatmap */}
              <div className="grid grid-cols-24 gap-1 h-32">
                {/* Column generation proxy */}
                <div className="flex gap-1 w-full justify-between items-end">
                  <div className="w-full bg-primary/10 h-1/4 rounded-sm"></div>
                  <div className="w-full bg-primary/20 h-1/3 rounded-sm"></div>
                  <div className="w-full bg-primary/10 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-primary/40 h-1/5 rounded-sm"></div>
                  <div className="w-full bg-primary/5 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-primary/60 h-1/4 rounded-sm"></div>
                  <div className="w-full bg-primary/80 h-3/4 rounded-sm"></div>
                  <div className="w-full bg-primary h-full rounded-sm shadow-[0_0_12px_rgba(210,187,255,0.2)]"></div>
                  <div className="w-full bg-primary/70 h-5/6 rounded-sm"></div>
                  <div className="w-full bg-primary/40 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-primary/20 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-primary/30 h-1/3 rounded-sm"></div>
                  <div className="w-full bg-primary/50 h-3/4 rounded-sm"></div>
                  <div className="w-full bg-primary/90 h-[95%] rounded-sm shadow-[0_0_10px_rgba(210,187,255,0.2)]">
                  </div>
                  <div className="w-full bg-primary/40 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-primary/10 h-1/4 rounded-sm"></div>
                  <div className="w-full bg-primary/20 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-primary/60 h-5/6 rounded-sm"></div>
                  <div className="w-full bg-primary/30 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-primary/10 h-1/4 rounded-sm"></div>
                  <div className="w-full bg-primary/20 h-1/3 rounded-sm"></div>
                  <div className="w-full bg-primary/40 h-2/3 rounded-sm"></div>
                  <div className="w-full bg-primary/10 h-1/2 rounded-sm"></div>
                  <div className="w-full bg-primary/5 h-1/4 rounded-sm"></div>
                </div>
              </div>
              <div
                className="flex justify-between mt-4 text-[10px] font-mono text-outline uppercase tracking-widest px-1">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
              </div>
            </div>
            {/* Detailed Source Performance Table */}
            <div className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/15">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="font-headline text-lg font-bold">Campaign Breakdown</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-outline">Search:</span>
                  <input
                    className="bg-surface-container-lowest border-none text-xs rounded p-2 focus:ring-1 focus:ring-primary w-48"
                    placeholder="Campaign ID..." type="text" />
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-surface-container-highest/30">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Source
                      Campaign</th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Spend
                    </th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Leads
                    </th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">CPA</th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">ROI</th>
                    <th
                      className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline text-right">
                      Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">TT_Global_Prospecting_V4</p>
                      <p className="text-[10px] text-outline">TikTok Ads Manager</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-mono">$12,450</td>
                    <td className="px-6 py-5 text-sm">4,210</td>
                    <td className="px-6 py-5 text-sm font-mono">$2.95</td>
                    <td className="px-6 py-5">
                      <span
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-[11px] font-bold">412%</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="material-symbols-outlined text-primary"
                        data-icon="trending_up">trending_up</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">IG_Reels_Educational_Series</p>
                      <p className="text-[10px] text-outline">Instagram Boost</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-mono">$8,900</td>
                    <td className="px-6 py-5 text-sm">2,150</td>
                    <td className="px-6 py-5 text-sm font-mono">$4.13</td>
                    <td className="px-6 py-5">
                      <span
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-[11px] font-bold">650%</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="material-symbols-outlined text-primary"
                        data-icon="trending_up">trending_up</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-on-surface">Organic_Youtube_Shorts</p>
                      <p className="text-[10px] text-outline">Direct Link-in-Bio</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-mono">$0</td>
                    <td className="px-6 py-5 text-sm">1,020</td>
                    <td className="px-6 py-5 text-sm font-mono">$0.00</td>
                    <td className="px-6 py-5">
                      <span
                        className="bg-primary/10 text-primary px-2 py-1 rounded text-[11px] font-bold">∞</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="material-symbols-outlined text-outline"
                        data-icon="trending_flat">trending_flat</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-5 text-tertiary">
                      <p className="text-sm font-bold">Google_Search_Branded</p>
                      <p className="text-[10px] text-tertiary/60">PPC Campaigns</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-mono">$4,200</td>
                    <td className="px-6 py-5 text-sm">112</td>
                    <td className="px-6 py-5 text-sm font-mono">$37.50</td>
                    <td className="px-6 py-5">
                      <span
                        className="bg-tertiary/10 text-tertiary px-2 py-1 rounded text-[11px] font-bold">-14%</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="material-symbols-outlined text-tertiary"
                        data-icon="trending_down">trending_down</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* Dynamic Context Area */}
          <section className="p-8 border-t border-outline-variant/10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 rounded-lg bg-surface-container border border-primary/20 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                SYSTEM ADVICE</div>
              <h4 className="font-headline text-lg font-bold mb-4">Traffic Channel Recommendation</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Based on the current 14-day cycle, shifting 15% of the <span className="text-primary font-bold">Google
                  Search</span> budget into <span className="text-primary font-bold">Instagram Reels</span> is
                projected to increase top-of-funnel conversions by <span className="text-white font-mono">~2.4%</span>
                without increasing total CAC.
              </p>
              <div className="flex gap-4">
                <button
                  className="bg-primary text-on-primary font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded">Apply
                  Allocation</button>
                <button
                  className="text-outline font-bold text-[10px] uppercase tracking-widest px-4 py-2 hover:text-white">Ignore</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-6 bg-surface-container-low rounded-lg border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary mb-3 text-3xl" data-icon="bolt">bolt</span>
                <p className="text-[10px] font-label text-outline uppercase tracking-widest">Server Response</p>
                <p className="text-xl font-headline font-bold">42ms</p>
              </div>
              <div
                className="p-6 bg-surface-container-low rounded-lg border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-primary mb-3 text-3xl" data-icon="update">update</span>
                <p className="text-[10px] font-label text-outline uppercase tracking-widest">Next Refresh</p>
                <p className="text-xl font-headline font-bold">08:42</p>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
