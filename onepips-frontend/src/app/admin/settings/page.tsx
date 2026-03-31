import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminSettingsPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />

        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Paramètres du Site</h1>
          {/* Grid Layout: Settings Navigation + Content */}
          <div className="grid grid-cols-12 gap-10">
            {/* Inner Nav Column (Asymmetrical Sidebar) */}
            <div className="col-span-3">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="text-[10px] font-label uppercase tracking-widest text-outline mb-4">Configuration
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-primary bg-surface-container-low rounded-md"
                        href="#branding">
                        Site Branding
                        <span className="material-symbols-outlined text-[18px]"
                          data-icon="palette">palette</span>
                      </a>
                    </li>
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-outline hover:text-on-surface hover:bg-surface-container/50 rounded-md transition-all"
                        href="#seo">
                        SEO &amp; Meta
                        <span className="material-symbols-outlined text-[18px]"
                          data-icon="search">search</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-label uppercase tracking-widest text-outline mb-4">Commercial
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-outline hover:text-on-surface hover:bg-surface-container/50 rounded-md transition-all"
                        href="#plans">
                        Offer Management
                        <span className="material-symbols-outlined text-[18px]"
                          data-icon="shopping_bag">shopping_bag</span>
                      </a>
                    </li>
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-outline hover:text-on-surface hover:bg-surface-container/50 rounded-md transition-all"
                        href="#coupons">
                        Discounts
                        <span className="material-symbols-outlined text-[18px]"
                          data-icon="confirmation_number">confirmation_number</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[10px] font-label uppercase tracking-widest text-outline mb-4">Ecosystem
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-outline hover:text-on-surface hover:bg-surface-container/50 rounded-md transition-all"
                        href="#integrations">
                        Integrations
                        <span className="material-symbols-outlined text-[18px]" data-icon="api">api</span>
                      </a>
                    </li>
                    <li>
                      <a className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-outline hover:text-on-surface hover:bg-surface-container/50 rounded-md transition-all"
                        href="#webhooks">
                        Webhooks
                        <span className="material-symbols-outlined text-[18px]"
                          data-icon="webhook">webhook</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Main Forms Column */}
            <div className="col-span-9 space-y-12">
              {/* Branding Section */}
              <section id="branding">
                <div className="mb-6">
                  <h4 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Site
                    Configuration</h4>
                  <p className="text-outline text-sm">Control the visual identity and global branding tokens of
                    the One Pips platform.</p>
                </div>
                <div className="bg-surface-container p-8 rounded-lg glass-panel space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[11px] font-label uppercase tracking-wider text-primary">Platform
                        Name</label>
                      <input
                        className="w-full bg-surface-container-lowest border-outline-variant/20 rounded-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        type="text" value="One Pips Elite" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-label uppercase tracking-wider text-primary">Support
                        Email</label>
                      <input
                        className="w-full bg-surface-container-lowest border-outline-variant/20 rounded-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        type="email" value="ops@onepips.com" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-label uppercase tracking-wider text-primary">Brand
                      Assets</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest">
                        <span className="material-symbols-outlined text-outline"
                          data-icon="upload_file">upload_file</span>
                        <span className="text-xs text-outline font-medium text-center">Primary
                          Logo<br /><span className="opacity-60">PNG or SVG</span></span>
                      </div>
                      <div
                        className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest">
                        <span className="material-symbols-outlined text-outline"
                          data-icon="upload_file">upload_file</span>
                        <span className="text-xs text-outline font-medium text-center">Favicon<br /><span
                          className="opacity-60">32x32px</span></span>
                      </div>
                      <div
                        className="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest">
                        <span className="material-symbols-outlined text-outline"
                          data-icon="upload_file">upload_file</span>
                        <span className="text-xs text-outline font-medium text-center">Social
                          Card<br /><span className="opacity-60">1200x630px</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Offer Management */}
              <section id="plans">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Offer
                      Management</h4>
                    <p className="text-outline text-sm">Configure subscription plans, pricing tiers, and access
                      levels.</p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high border border-outline-variant/20 rounded-md text-xs font-bold text-primary hover:bg-surface-container-highest transition-all">
                    <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                    Add Tier
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Tier Card */}
                  <div
                    className="bg-surface-container border-l-4 border-primary p-6 rounded-r-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary"
                          data-icon="military_tech">military_tech</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-on-surface">Alpha Signal Room</h5>
                        <p className="text-xs text-outline">Real-time trading alerts + Discord Access</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">$199.00 <span
                          className="text-[10px] text-outline">/ month</span></p>
                        <p
                          className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                          Active Plan</p>
                      </div>
                      <button
                        className="p-2 text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                      </button>
                    </div>
                  </div>
                  {/* Tier Card */}
                  <div
                    className="bg-surface-container border-l-4 border-outline-variant/30 p-6 rounded-r-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors">
                    <div className="flex items-center gap-6">
                      <div
                        className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline"
                          data-icon="school">school</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-on-surface">Foundation Mentorship</h5>
                        <p className="text-xs text-outline">Complete video library + Bi-weekly calls</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">$499.00 <span
                          className="text-[10px] text-outline">/ lifetime</span></p>
                        <p
                          className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                          Active Plan</p>
                      </div>
                      <button
                        className="p-2 text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              {/* Integrations Section */}
              <section id="integrations">
                <div className="mb-6">
                  <h4 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Integration
                    Links</h4>
                  <p className="text-outline text-sm">Connect your third-party infrastructure for seamless
                    operations.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Stripe Integration */}
                  <div
                    className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#635BFF]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#635BFF]"
                            data-icon="account_balance">account_balance</span>
                        </div>
                        <h6 className="font-bold text-on-surface">Stripe</h6>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-outline font-label uppercase">Live Secret
                          Key</label>
                        <div className="relative">
                          <input
                            className="w-full bg-surface-container-lowest border-outline-variant/20 rounded text-xs text-outline pr-10"
                            type="password" value="sk_live_51M..." />
                          <button className="absolute right-2 top-1.5 text-outline-variant">
                            <span className="material-symbols-outlined text-sm"
                              data-icon="visibility">visibility</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Discord Integration */}
                  <div
                    className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#5865F2]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#5865F2]"
                            data-icon="forum">forum</span>
                        </div>
                        <h6 className="font-bold text-on-surface">Discord Bot</h6>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">Connected</span>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-outline font-label uppercase">Guild ID</label>
                        <input
                          className="w-full bg-surface-container-lowest border-outline-variant/20 rounded text-xs text-on-surface"
                          type="text" value="8429304857210" />
                      </div>
                    </div>
                  </div>
                  {/* Cal.com Integration */}
                  <div
                    className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface"
                            data-icon="calendar_month">calendar_month</span>
                        </div>
                        <h6 className="font-bold text-on-surface">Cal.com</h6>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full bg-error-container/20 text-[10px] font-bold text-error uppercase">Action
                        Required</span>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-outline font-label uppercase">API Key</label>
                        <input
                          className="w-full bg-surface-container-lowest border-outline-variant/20 rounded text-xs text-on-surface"
                          placeholder="Enter Cal.com API key" type="text" />
                      </div>
                    </div>
                  </div>
                  {/* SEO / Meta Section (Integrated into grid for layout variety) */}
                  <div
                    className="bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary"
                            data-icon="travel_explore">travel_explore</span>
                        </div>
                        <h6 className="font-bold text-on-surface">Global SEO</h6>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-outline font-label uppercase">Meta
                          Description</label>
                        <textarea
                          className="w-full bg-surface-container-lowest border-outline-variant/20 rounded text-xs text-on-surface resize-none"
                          rows={2}>Elite FX educational platform for precision trading and market analysis.</textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Advanced Maintenance */}
              <section className="pb-20">
                <div className="bg-surface-container-lowest p-8 rounded-lg border border-error/20">
                  <h5 className="font-bold text-error flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[20px]" data-icon="warning">warning</span>
                    Danger Zone
                  </h5>
                  <p className="text-sm text-outline mb-6">These actions are irreversible. Please proceed with
                    extreme caution.</p>
                  <div
                    className="flex items-center justify-between p-4 bg-surface-container rounded border border-outline-variant/10">
                    <div>
                      <p className="text-sm font-bold text-on-surface">Maintenance Mode</p>
                      <p className="text-xs text-outline">Disable site access for all non-admin users.</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" value="" />
                      <div
                        className="w-11 h-6 bg-secondary-container rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-error">
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div >
      </main >
    </div >
  );
}
