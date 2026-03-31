import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import MobileNav from "@/components/admin/layout/mobile-nav";

export default function AdminDashboardPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      {/* Side Navigation Bar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Top Nav Bar */}
        <Navbar />

        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {/* Leads Today */}
            <div className="bg-surface-container p-5 rounded-xl border-t border-surface-bright/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">Leads Today</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">142</h3>
                  <span className="text-xs text-primary font-bold">+12%</span>
                </div>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-primary/20 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-[65%] obsidian-gradient"></div>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-surface-container p-5 rounded-xl border-t border-surface-bright/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">Conversion</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">8.42%</h3>
                  <span className="text-xs text-tertiary font-bold">-0.5%</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                <span className="text-[10px] text-outline">Target: 10%</span>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-surface-container p-5 rounded-xl border-t border-surface-bright/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">Revenue (MTD)</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">$42.1k</h3>
                  <span className="text-xs text-primary font-bold">+28%</span>
                </div>
              </div>
              <div className="h-8 mt-4 flex items-center gap-1">
                <div className="w-1/4 h-2 bg-primary-container rounded-sm"></div>
                <div className="w-1/4 h-3 bg-primary-container rounded-sm opacity-60"></div>
                <div className="w-1/4 h-5 bg-primary-container rounded-sm opacity-80"></div>
                <div className="w-1/4 h-6 obsidian-gradient rounded-sm"></div>
              </div>
            </div>

            {/* Planned Meetings */}
            <div className="bg-surface-container p-5 rounded-xl border-t border-surface-bright/20 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">Meetings</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">18</h3>
                  <span className="text-xs text-outline font-medium">Upcoming</span>
                </div>
              </div>
              <div className="mt-4 flex -space-x-2">
                <img className="w-6 h-6 rounded-full border border-surface-container object-cover" alt="Portrait of a young male client" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvIogi97rl4WBXc20cgOqYdr-ZBZC4OmjF-5X90DjGLPWwZL8VELcS6DU9gY7cKZH4nSL7tS5-g-PK15APlGGAtqJsJzG1CmNRD82V9XJbxLsRxCz7PQJxJXKbbASppwc9vW-QhPUBCvvsBAN6zfXNAX8VU7XT4Vd5HUSxMW156SggdXhUgBMEgltKhiXD3VgPn-dF8WdllnrjyjY61ukC5jUbESFbwjbjYwEF2c6NlXhaSm890pcaG4CHEeWFhX2G-SJtJvbOcqs" />
                <img className="w-6 h-6 rounded-full border border-surface-container object-cover" alt="Portrait of a female client" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2UWKqTCa6wmMulLHjwFbbivoOQlYKNJHwZf-XrSyX4_-EtEe4XdMxeieQTZ6NOp-eOP2mcYhFmlS_XuMHNnPduOam51FUsGuDGdyEV71Uyorjyd31ZZsQteaJbHn-F8hsedsYc6kaKoKQAjEeqldRMUdQjxX3fZG73L6rBOSzvRV36F6E5KaQgpWrxFgwJCMIYRauMDTqqYFCJm4dHInkYXvoQTpCELnZsbvW61OJIGAVW_kTgpy4c6uxuOg2LZsQHRXkuPOoTbk" />
                <img className="w-6 h-6 rounded-full border border-surface-container object-cover" alt="Portrait of a mature male client" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwQsZEpTUUx-4JNiVuRpRJqFgxsABrOHaCCzFcvOTaYduMQL8vQ9TcG-3qvX4atyIDXDbIqltTHMkqIfapaKYv5ME3kgvpv6EMAJrMqQ-JOXkLKFEgAVOBr0DNwVSBmgjCSln68sKRz4by9s0mvxGYQOzgVwa9T9EhY4pZfi1dmS8j1CR9pJEBOj_ZW1lSImyQYU4d3fNDXV8eZhZU7FRIrU92t__uHPNcgsK-6b-ZXNtRZ-XAItiLhh6un69DDs_NFixpcM6j5So" />
                <div className="w-6 h-6 rounded-full border border-surface-container bg-surface-variant flex items-center justify-center text-[8px] font-bold text-on-surface">+15</div>
              </div>
            </div>

            {/* Live Traffic */}
            <div className="bg-surface-container p-5 rounded-xl border-t border-surface-bright/20 flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <span className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">Live Traffic</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-headline font-bold text-on-surface">312</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 opacity-20 transform translate-x-4 translate-y-4">
                <span className="material-symbols-outlined text-6xl text-primary">public</span>
              </div>
            </div>
          </div>

          {/* Main Charts Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Velocity Main Chart */}
            <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">Revenue Velocity</h2>
                  <p className="text-sm text-outline">Real-time profit accumulation trend</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-bold border border-outline-variant/30 rounded text-outline hover:text-on-surface">1H</button>
                  <button className="px-3 py-1 text-xs font-bold border border-primary/50 bg-primary/10 rounded text-primary">24H</button>
                  <button className="px-3 py-1 text-xs font-bold border border-outline-variant/30 rounded text-outline hover:text-on-surface">7D</button>
                </div>
              </div>
              {/* Custom SVG Chart Simulation */}
              <div className="w-full h-80 relative flex items-end justify-between px-4 pb-8">
                <div className="absolute inset-0 flex flex-col justify-between py-8">
                  <div className="w-full h-px bg-outline-variant/5"></div>
                  <div className="w-full h-px bg-outline-variant/5"></div>
                  <div className="w-full h-px bg-outline-variant/5"></div>
                  <div className="w-full h-px bg-outline-variant/5"></div>
                  <div className="w-full h-px bg-outline-variant/10"></div>
                </div>
                {/* Visualizing the curve using divs for demo */}
                <div className="w-full h-full absolute inset-0 pt-16 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                    <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0,180 Q100,160 200,170 T400,120 T600,140 T800,80 T1000,40 L1000,200 L0,200 Z" fill="url(#gradient)"></path>
                    <path d="M0,180 Q100,160 200,170 T400,120 T600,140 T800,80 T1000,40" fill="none" stroke="#D2BBFF" strokeWidth="3"></path>
                    <circle className="animate-pulse" cx="1000" cy="40" fill="#D2BBFF" r="4"></circle>
                  </svg>
                </div>
                {/* X Axis Labels */}
                <div className="absolute bottom-0 w-full flex justify-between text-[10px] font-bold text-outline font-label px-4">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>NOW</span>
                </div>
              </div>
            </div>

            {/* Lead Sources Pie Chart */}
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col">
              <h2 className="text-xl font-headline font-bold text-on-surface mb-2">Lead Distribution</h2>
              <p className="text-sm text-outline mb-10">Channel performance breakdown</p>
              <div className="flex-1 flex flex-col justify-center items-center">
                {/* Simulated Donut Chart */}
                <div className="relative w-48 h-48 rounded-full border-[16px] border-surface-container flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[16px] border-primary-container border-t-transparent border-l-transparent rotate-12"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-tertiary border-b-transparent border-r-transparent -rotate-45"></div>
                  <div className="text-center">
                    <span className="text-3xl font-headline font-bold text-on-surface">1.2k</span>
                    <p className="text-[10px] text-outline uppercase tracking-tighter">Total Leads</p>
                  </div>
                </div>
                {/* Legend */}
                <div className="w-full mt-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                      <span className="text-xs font-medium text-on-surface">TikTok Ads</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">54%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      <span className="text-xs font-medium text-on-surface">Instagram</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">32%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                      <span className="text-xs font-medium text-on-surface">Organic/Other</span>
                    </div>
                    <span className="text-xs font-bold text-on-surface">14%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Applications Table */}
          <section className="mt-8 bg-surface-container-low rounded-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h2 className="text-lg font-headline font-bold text-on-surface">High-Intent Applications</h2>
              <button className="text-sm font-bold text-primary hover:underline">View All Leads</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold tracking-widest text-outline uppercase font-label">
                    <th className="px-8 py-4">Applicant</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Lead Score</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="group hover:bg-surface-container transition-colors border-t border-outline-variant/5">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center font-bold text-primary">MS</div>
                        <div>
                          <p className="font-bold text-on-surface">Marcus Sterling</p>
                          <p className="text-xs text-outline">marcus.s@fintech.io</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold">INTERVIEWING</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-secondary-container rounded-full overflow-hidden">
                          <div className="w-[92%] h-full obsidian-gradient shadow-[0_0_8px_#7C3AED]"></div>
                        </div>
                        <span className="font-bold">92</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">more_vert</button>
                    </td>
                  </tr>
                  <tr className="group hover:bg-surface-container transition-colors border-t border-outline-variant/5">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center font-bold text-primary">EL</div>
                        <div>
                          <p className="font-bold text-on-surface">Elena Lopez</p>
                          <p className="text-xs text-outline">elena@traderlink.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">NEW APP</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-secondary-container rounded-full overflow-hidden">
                          <div className="w-[78%] h-full obsidian-gradient shadow-[0_0_8px_#7C3AED]"></div>
                        </div>
                        <span className="font-bold">78</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">more_vert</button>
                    </td>
                  </tr>
                  <tr className="group hover:bg-surface-container transition-colors border-t border-outline-variant/5">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center font-bold text-primary">DW</div>
                        <div>
                          <p className="font-bold text-on-surface">David Wu</p>
                          <p className="text-xs text-outline">d.wu@quant.net</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-2 py-1 rounded bg-tertiary-container/20 text-tertiary text-[10px] font-bold uppercase">Urgent</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-secondary-container rounded-full overflow-hidden">
                          <div className="w-[85%] h-full obsidian-gradient shadow-[0_0_8px_#7C3AED]"></div>
                        </div>
                        <span className="font-bold">85</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">more_vert</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
