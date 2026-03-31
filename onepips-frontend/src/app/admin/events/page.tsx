import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminEventsPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Gestion des Lives</h1>
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">Status: Live
                  Monitoring</span>
                <h2 className="text-4xl font-headline font-bold mt-2">Upcoming Lives</h2>
              </div>
              <button className="text-outline hover:text-primary flex items-center gap-2 text-sm font-medium">
                View Schedule <span className="material-symbols-outlined text-sm"
                  data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
            <div className="asymmetric-grid">
              {/* Main Event Card */}
              <div
                className="surface-container rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                  <img alt="Trading Chart Background" className="w-full h-full object-cover"
                    data-alt="abstract financial data visualization with glowing purple and blue lines representing stock market movements and technical analysis"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe6-pFlK-9mJWR36BPTPCMtxcSCn3VNLaQHS3rzfbXKeCoyuDecM45a9R7finx4MayDYOa8bLbrHTRyoKEGBI-GrOmRf-zD_Gic2B30PkulhWjHCDY9VYgMvUYZ6NEnu-QJkRqsRYT2fekniievCDHU7392Q3WLd4czxF-927iAt0DqWJON7Q9TlO3whaQN0X_1KxjI8gUrP-___2JA2B5nlXw57KNkfzNVL9n_dyIswJ20zORkDNadrbL9jl_1FDciXCh4V71yJ0" />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent">
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-primary/20">Masterclass</span>
                    <span
                      className="flex items-center gap-1.5 text-tertiary text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                      Live in 02:45:12
                    </span>
                  </div>
                  <h3 className="text-5xl font-headline font-bold leading-tight max-w-2xl">Liquidity Grabs &amp;
                    institutional Orderflow: Q4 Strategies</h3>
                  <p className="text-on-surface-variant mt-4 text-lg max-w-xl">Deep dive into the psychological
                    levels of institutional selling in current volatility environments.</p>
                </div>
                <div className="relative z-10 mt-8 flex items-center justify-between">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img alt="Panelist"
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-container"
                      data-alt="close-up portrait of a professional man with a neutral expression in high-quality business attire"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEAncYWiqAotKYFX9t2NUcEuXHA9n2qTewtrF9x3chn89BxuYBj2QiR5PI3FuSt9p9s9eeNDAlKA3C149nAwG9H3qi0KSjFTJGuuJ2Roe97yts6jiY6T84JDYlx2irnKmPD_3NGCyZFOgGJnVUvtZeyt5MvQL_5w-Fb9TvtQPkeO9pHpXQVI7kPbyyw4WKojU0oeeaA-4cWYn73KXzU32MbqXcFKmLj_J1U3dKnxjzqfzJxlE5DJRT92v2D7uzkpvUvQl_HOkl9uk" />
                    <img alt="Panelist"
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-surface-container"
                      data-alt="headshot of a young professional woman with a slight smile, natural lighting, outdoors"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOLX30Jbrzguo3t9NnLyE4_N-ATWo1GPVC_8ZPHLqZq8L-0cqkqST1kyM8ISK6xaAhVC9dqrOFIBJ3SDzIFQBkLCQznY5AhwNGg9_wPf9UlQCsEYYJCO4siNbGzEwyK6KKx-0CQru3x4LDRS8_DU-OqY0bLVtdk11bht3F1PJU8PzwyYS1bQNyA69bpDnZdp-mj2hA_TBgCZ3xfJShzWAXGNqF_rzMWUOkA9dq5ghq8wUtl1adxta_tZ_eo1qFwjeugHKPVqdFsiY" />
                    <div
                      className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-surface-container bg-surface-container-highest text-[10px] font-bold text-outline">
                      +1.2k</div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-surface-variant text-on-surface px-6 py-2.5 rounded-md font-bold text-sm hover:bg-surface-bright transition-colors active:scale-95">
                      Send Reminders
                    </button>
                    <button
                      className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-md font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary-container/20">
                      Enter Green Room
                    </button>
                  </div>
                </div>
              </div>
              {/* Secondary Events / Sidebar List */}
              <div className="space-y-4">
                <div className="surface-container rounded-xl p-5 border-l-4 border-primary">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Tomorrow • 14:00
                    UTC</p>
                  <h4 className="font-bold text-on-surface leading-tight mb-3">Forex Weekly Outlook: Major Pairs
                    Analysis</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">420 Registered</span>
                    <span className="material-symbols-outlined text-outline text-lg"
                      data-icon="more_vert">more_vert</span>
                  </div>
                </div>
                <div
                  className="surface-container rounded-xl p-5 hover:bg-surface-container-high transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Nov 28 • 09:00
                    UTC</p>
                  <h4 className="font-bold text-on-surface leading-tight mb-3">Crypto Volatility Workshop: Hedging
                    Techniques</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">890 Registered</span>
                    <span className="material-symbols-outlined text-outline text-lg"
                      data-icon="more_vert">more_vert</span>
                  </div>
                </div>
                <div
                  className="surface-container rounded-xl p-5 hover:bg-surface-container-high transition-colors cursor-pointer">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Dec 02 • 18:30
                    UTC</p>
                  <h4 className="font-bold text-on-surface leading-tight mb-3">Advanced Fibonacci Ext. &amp;
                    Retracement Mastery</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">1,120 Registered</span>
                    <span className="material-symbols-outlined text-outline text-lg"
                      data-icon="more_vert">more_vert</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Section: Engagement Stats (Asymmetric layout) */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Live Retention</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-primary">88.4%</span>
                <span className="text-[10px] text-primary-container font-bold">+2.1% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]" style={{ width: "88%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Avg. Watch Time</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">42m</span>
                <span className="text-[10px] text-tertiary font-bold">-5m ↓</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Chat Interaction</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">12.4k</span>
                <span className="text-[10px] text-primary-container font-bold">+15% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="surface-container p-6 rounded-xl border border-outline-variant/10">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-headline font-bold text-on-surface">4.2%</span>
                <span className="text-[10px] text-primary-container font-bold">+0.8% ↑</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-secondary-container rounded-full overflow-hidden">
                <div className="h-full bg-on-surface-variant" style={{ width: "42%" }}></div>
              </div>
            </div>
          </section>
          {/* Section: Participant List & Analytics */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            {/* Past Events Archive (Asymmetric Sidebar) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-headline font-bold">Past Archive</h3>
                <span className="material-symbols-outlined text-outline" data-icon="history">history</span>
              </div>
              <div className="space-y-4">
                {/* Archived Item */}
                <div
                  className="glass-card rounded-xl p-5 group cursor-pointer hover:bg-surface-container transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-outline">OCT 22, 2023</span>
                    <span className="bg-surface-bright text-[8px] font-black px-1.5 py-0.5 rounded">HD
                      REPLAY</span>
                  </div>
                  <h5 className="text-sm font-bold group-hover:text-primary transition-colors mb-4 leading-snug">
                    Psychology of the "Black Swan": Trading in Chaos</h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-outline">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="group">group</span>
                      2.4k Views
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="star">star</span> 4.9
                      Rating
                    </div>
                  </div>
                </div>
                {/* Archived Item */}
                <div
                  className="glass-card rounded-xl p-5 group cursor-pointer hover:bg-surface-container transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-outline">OCT 15, 2023</span>
                    <span className="bg-surface-bright text-[8px] font-black px-1.5 py-0.5 rounded">HD
                      REPLAY</span>
                  </div>
                  <h5 className="text-sm font-bold group-hover:text-primary transition-colors mb-4 leading-snug">
                    Scalping Gold: 15-Minute Entry Strategies</h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-outline">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="group">group</span>
                      1.8k Views
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="star">star</span> 4.7
                      Rating
                    </div>
                  </div>
                </div>
                {/* Archived Item */}
                <div
                  className="glass-card rounded-xl p-5 group cursor-pointer hover:bg-surface-container transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-outline">OCT 08, 2023</span>
                    <span className="bg-surface-bright text-[8px] font-black px-1.5 py-0.5 rounded">HD
                      REPLAY</span>
                  </div>
                  <h5 className="text-sm font-bold group-hover:text-primary transition-colors mb-4 leading-snug">
                    The Elliott Wave Theory: Mastering Market Cycles</h5>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-outline">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="group">group</span>
                      3.1k Views
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]" data-icon="star">star</span> 5.0
                      Rating
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-xl border border-dashed border-outline-variant/30 text-outline text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all">
                  See All Archived Events
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
