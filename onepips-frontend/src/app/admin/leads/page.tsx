import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";
import LeadTab from "@/components/admin/leads/lead-tab";

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
          <LeadTab />

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
