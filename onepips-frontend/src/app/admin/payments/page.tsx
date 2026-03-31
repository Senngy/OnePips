import Sidebar from "@/components/admin/layout/sidebar";
import Navbar from "@/components/admin/layout/navbar";

export default function AdminPaymentsPage() {
  return (
    <div className="font-body selection:bg-primary/30">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Navbar />
        <div className="p-8 max-w-[1600px] mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Paiements & Abonnements</h1>
          <button
            className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-md font-medium text-sm active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
          <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Large Primary Widget (MRR) */}
            <div
              className="md:col-span-2 bg-surface-container-low p-6 rounded-xl etched-border glass-highlight relative overflow-hidden group">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-label uppercase tracking-[0.1em] text-outline mb-1">Monthly Recurring
                    Revenue</p>
                  <h3 className="font-headline text-4xl font-bold text-on-surface tracking-tighter">$142,850.00
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center text-primary font-medium text-sm">
                    <span className="material-symbols-outlined text-lg mr-1">trending_up</span>
                    +12.4%
                  </span>
                  <span className="text-[10px] text-outline mt-1 italic">vs last month</span>
                </div>
              </div>
              <div className="mt-8 h-32 w-full flex items-end gap-1.5">
                {/* Mockup of a growth chart using div bars */}
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[40%] group-hover:bg-primary/20 transition-all">
                </div>
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[45%] group-hover:bg-primary/20 transition-all">
                </div>
                <div className="flex-1 bg-primary/15 rounded-t-sm h-[60%] group-hover:bg-primary/25 transition-all">
                </div>
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[55%] group-hover:bg-primary/20 transition-all">
                </div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[75%] group-hover:bg-primary/30 transition-all">
                </div>
                <div className="flex-1 bg-primary/25 rounded-t-sm h-[85%] group-hover:bg-primary/35 transition-all">
                </div>
                <div className="flex-1 bg-primary rounded-t-sm h-[100%] shadow-[0_0_15px_rgba(210,187,255,0.3)]">
                </div>
              </div>
              {/* Aesthetic background glow */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-[60px]"></div>
            </div>
            {/* Total Revenue Widget */}
            <div className="bg-surface-container p-6 rounded-xl etched-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">account_balance_wallet</span>
                  <span className="text-xs font-label text-outline">ANNUAL</span>
                </div>
                <p className="text-xs font-label uppercase tracking-[0.1em] text-outline mb-1">Total Revenue</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">$1.24M</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-outline">Progress to Target</span>
                  <span className="text-on-surface">84%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary-container rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.4)]" style={{ width: '84%' }}>
                  </div>
                </div>
              </div>
            </div>
            {/* Churn Rate Widget */}
            <div className="bg-surface-container p-6 rounded-xl etched-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="material-symbols-outlined text-tertiary p-2 bg-tertiary/10 rounded-lg">group_remove</span>
                  <span className="text-xs font-label text-tertiary-fixed-dim">CRITICAL</span>
                </div>
                <p className="text-xs font-label uppercase tracking-[0.1em] text-outline mb-1">Churn Rate</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">2.8%</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <span className="flex items-center text-tertiary text-xs font-medium">
                  <span className="material-symbols-outlined text-sm mr-1">arrow_downward</span>
                  -0.4% improvement
                </span>
                <p className="text-[10px] text-outline mt-1 italic">Maintaining elite retention</p>
              </div>
            </div>
          </section>
          {/* Table Section: Transactions */}
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Recent Transactions</h3>
                <p className="text-outline text-sm">Live feed of global capital flow</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="bg-surface-container text-outline hover:text-on-surface px-4 py-2 rounded-md text-xs font-medium border border-outline-variant/10 transition-all">Filter</button>
                <button
                  className="bg-surface-container text-outline hover:text-on-surface px-4 py-2 rounded-md text-xs font-medium border border-outline-variant/10 transition-all">Sort
                  by: Date</button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl etched-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/15">
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">
                      Customer</th>
                    <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline">Plan
                      Type</th>
                    <th
                      className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline text-right">
                      Amount</th>
                    <th
                      className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline text-center">
                      Status</th>
                    <th
                      className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-outline text-center">
                      Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {/* Transaction 1 */}
                  <tr className="hover:bg-surface-container transition-colors duration-150 group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">Oct 24, 2023</span>
                        <span className="text-[10px] text-outline tracking-tight">14:32 UTC</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center overflow-hidden">
                          <img alt="User" className="w-full h-full object-cover"
                            data-alt="vibrant portrait of a man with minimalist background suitable for profile avatar"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzdKHPCVLqdVuwFYIy9oEZWO_JybD0xUiaxPg1YqlbOk7ydreXg71qdf1gC2htxFdIapZIpeRiGcIoqoFKnPECn3zio28sQ1tO7asTH8CK7JXclI4h360haZz51GQcnmd9vX7TgB8eB92Mpc8sgAprb7F8pPJ-7ZKl8ublQXFVMxI-9QTGUUtunFCYTYNGOpi2sA8PBErqBDQaxTD-idDQth9ZHyLhshjLkSozGT3PHPkGQNiFVUd2VsE4BTtmhTXZ_MILHm-ND_Q" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Julian Rossi</span>
                          <span className="text-xs text-outline">julian.r@example.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Premium</span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-on-surface text-sm">
                      $499.00
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs text-[#4ADE80] bg-[#4ADE80]/10 px-3 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full"></span>
                        Succeeded
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        className="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">more_horiz</button>
                    </td>
                  </tr>
                  {/* Transaction 2 */}
                  <tr className="hover:bg-surface-container transition-colors duration-150 group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">Oct 24, 2023</span>
                        <span className="text-[10px] text-outline tracking-tight">12:15 UTC</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center overflow-hidden">
                          <img alt="User" className="w-full h-full object-cover"
                            data-alt="professional headshot of woman with clear eye contact and bright clean background"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAt2C9N-yC8EIwq5hn5x3Jt6TFxGG4u-zQlg9rtyrZuNDue6ZYjceazF5vs-SHWqQEIWIcscV5WG1YaLbThMXJU0JFg6_csuLnET8fCk2lMh0KSHLWOkuBnClU3UCOy71zjaOF3rG5BKfMLQIMSlBmAq1-TmQGA-y3j0nsnbKgm8jkezaRQx7edVO-I2dtkHTc7a_oqUmWSRzlX15F_cZw_7FRRbDSNk5QhL7_4G-KC1gEUOHXsuL_EYSxAs4RJ27vbRtC0Sx3TyY" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Sarah Chen</span>
                          <span className="text-xs text-outline">s.chen@techglobal.net</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary-container/40 text-secondary border border-outline-variant/20 font-medium">Coaching</span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-on-surface text-sm">
                      $1,250.00
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs text-[#4ADE80] bg-[#4ADE80]/10 px-3 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full"></span>
                        Succeeded
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        className="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">more_horiz</button>
                    </td>
                  </tr>
                  {/* Transaction 3 */}
                  <tr className="hover:bg-surface-container transition-colors duration-150 group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">Oct 23, 2023</span>
                        <span className="text-[10px] text-outline tracking-tight">21:05 UTC</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center overflow-hidden text-xs font-bold text-outline">
                          MA
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Marcus Aurelius</span>
                          <span className="text-xs text-outline">m.a@stoictrade.io</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/5 text-outline-variant border border-outline-variant/10 font-medium">Discord</span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-on-surface text-sm">
                      $49.99
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs text-tertiary bg-tertiary/10 px-3 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                        Refunded
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        className="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">more_horiz</button>
                    </td>
                  </tr>
                  {/* Transaction 4 */}
                  <tr className="hover:bg-surface-container transition-colors duration-150 group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-medium">Oct 23, 2023</span>
                        <span className="text-[10px] text-outline tracking-tight">18:44 UTC</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center overflow-hidden">
                          <img alt="User" className="w-full h-full object-cover"
                            data-alt="clean minimal portrait of business professional in sleek dark studio setting"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg4kMZXzRwHxYwnSKNx6oAmHfOwKX8s3UhjXHFJ7__Qrer4-aINC9s5OqiKp9fGiJepUciu7PDCj22LNnB_KC0jqyJgxZtVhbl9qkLqXXmQqpiQbKklywCxzRppgdaWmFHaUOafcYvNPJRxRm2RZp1jxzt86s7VL9lugXXbA3N2TmwrtSrNb5TVc7BcS0Nt2DN39xbHTM784FdKuYi5PZwHWg1gd_USJQ2gydr2-KHi1VnWkyCuP4s6RgJbmtm_dMthKbzWq_CSro" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">Elena Soros</span>
                          <span className="text-xs text-outline">e.soros@capital.com</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">Premium</span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-on-surface text-sm">
                      $499.00
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs text-[#FBBF24] bg-[#FBBF24]/10 px-3 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full animate-pulse"></span>
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        className="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">more_horiz</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-lowest/50">
                <span className="text-xs text-outline">Showing 1-10 of 2,492 transactions</span>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded bg-surface-container border border-outline-variant/10 text-outline disabled:opacity-30">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="text-xs font-medium text-on-surface mx-2">1</span>
                  <button
                    className="p-1 rounded bg-surface-container border border-outline-variant/10 text-on-surface">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* Bottom Section: Strategy & History */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Mix (Bento Card) */}
            <div className="lg:col-span-1 bg-surface-container p-6 rounded-xl etched-border flex flex-col gap-6">
              <h4 className="font-headline font-semibold text-lg">Revenue Stream Mix</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface">Premium Subscriptions</span>
                    <span className="text-outline">62%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface">Discord Signals</span>
                    <span className="text-outline">28%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed-dim" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface">Elite Coaching</span>
                    <span className="text-outline">10%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
                    <div className="h-full bg-outline-variant" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-auto p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/5">
                <p className="text-[10px] text-outline italic leading-relaxed">
                  "Premium Subscriptions are the primary driver. Focus expansion efforts on high-ticket
                  coaching for 2024."
                </p>
              </div>
            </div>
            {/* History View / Financial Log */}
            <div className="lg:col-span-2 bg-surface-container-low p-6 rounded-xl etched-border">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-headline font-semibold text-lg">Financial History</h4>
                <div className="flex gap-2">
                  <button className="text-xs text-primary font-medium hover:underline">View All logs</button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative pl-6 border-l border-outline-variant/20 space-y-8">
                  {/* Log Item 1 */}
                  <div className="relative">
                    <span
                      className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-low"></span>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-on-surface">Stripe Payout Initiated</p>
                      <span className="text-xs text-outline">2 hours ago</span>
                    </div>
                    <p className="text-xs text-outline mt-1">A payout of <span
                      className="text-on-surface">$12,400.00</span> has been triggered to the primary
                      business bank account ending in *4421.</p>
                  </div>
                  {/* Log Item 2 */}
                  <div className="relative">
                    <span
                      className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface-container-low"></span>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-on-surface">Bulk Invoice Generation</p>
                      <span className="text-xs text-outline">Yesterday</span>
                    </div>
                    <p className="text-xs text-outline mt-1">2,492 recurring invoices were successfully
                      generated for the November cycle.</p>
                  </div>
                  {/* Log Item 3 */}
                  <div className="relative">
                    <span
                      className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-tertiary ring-4 ring-surface-container-low"></span>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-on-surface">Fraud Alert Triggered</p>
                      <span className="text-xs text-outline">Oct 22, 2023</span>
                    </div>
                    <p className="text-xs text-outline mt-1">Multiple failed payment attempts detected from IP
                      192.168.1.1. Automatic block applied.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
