"use client";

export function ProofSection() {
  const stats = [
    { label: "Avg Monthly Return", value: "+42%" },
    { label: "Elite Traders", value: "850+" },
  ];

  const testimonials = [
    {
      name: "Marc L.",
      role: "Étudiant Mentorat",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9VZr1-wuP4c9Z9ypIFuHCt84eFSZGKAYW923iPDd4uwMPR-1dAr3P-MPkP4nl6pJcu5h-z1MJMw5hhHmkkkHAot8AvgsZPTbZqR65LETnrzJqDA0P0WWZwq2z8U4TUYKL61CxKBV-6s91oJqv67rJkMik5lmQFSaSv4grpcWpLJoiWV8AV1uDtGnE6OBltqyg7XTnsmUriAQqopsrZtPBpY54bMvu3FnuW_HO_JdPbqMeTUZ_wXqMXeq3ajbGvRhsqaw5DgZAVyY",
      content: "Avant One Pips, je perdais mon capital chaque mois. En 3 mois de méthode, j'ai validé ma première Fund Prop de 100k.",
      badge: "verified_user",
      imgAlt: "Profit Screenshot",
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbaN6X08Lg5sddSkkv_2kcVGn2hUwIXk2idn_JuuxCh7Gmk7v3pDH1UQ5IKX3u-xRJBYXV5R7St6M7U22cGnvjRUxlzWb9I8hMITK8OGzCHTSzxdzWbtu-FxKQinKKllKnZ3O5VAdvp3lhdohfhx_peS5UYQO6Thog6APKWq9B_pLVFC8pZshK5tS4PL4hDh0Y3R-mZ0w1PiImDtPucsjTDM43DIQ40yo7zgJwFoOQ-tj6rVfPGRMv_2B_6ezAm_nq3ipqHBZfNkQ"
    },
    {
      name: "Sarah K.",
      role: "Masterclass Live",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKAPlWPLmQboshflzocS26QDRGhOu2pr76K1O3lTraQ4O-i6y95r-qUcRapzDWDWWSCyNi3Fanpt8nV7lPEIUicoP9pb6uZPgaBHtbGIk_ixKgCtzojvsZEE77-Vq2g-i29q-A3Iz0rvYk9gggEyyCut8kWsWX5-bxKM57Jzog1dhIYJ6Ss5_LMnqSRCK1wpE-rC6Q4U2QpFvHNHZopjgXmYnjxVU8rvFiEhFPsNvNh8L38XFRi8iJiOdNRT7mVB9zSf1Hxto3BWk",
      content: "La clarté de l'enseignement est incroyable. On ne nous vend pas du rêve, on nous donne des outils mathématiques.",
      badge: "play_circle",
      imgAlt: "Analysis Result",
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGMDTbpsSW2gmp4cKS4-BpY00e0VKZ83QZxrYKEJSbFJPRTiMFH82yCiy9XUEl78jE0NKAh_y31yk4KIrs5SafcOO_Tun2120kEATYciu2P1JZ_qEFf0u3AGlzdsrp8iZbpw8hazkTC6tXzWi2wHj0qaWRiq2duzulcn6EdkCbGX42IsroidigJ47cPicB6lQ4l0DlidoRRNqmF9ehDcuN_n2W7g-UGgm3JF4OvlEqPPA4qqRzPQ1ZUyxlxutakqSI6Pe74LMmSJo"
    },
    {
      name: "Julien R.",
      role: "Coaching VIP",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDedZfFP-H9q61o04ZMxVKtoj-jBVmPlMqb8T2F_3rsZtf6hc8BzUokFSapzI3VDqZ1_yfUmAV6IS04B9ORunAyMbLkMdyXtIebZ-BkPLgaGdyJqE_S3GckLbWVDDDb_LFlqCiPZfc30NES2iVw40vwbR24nYLju19-hFvkRjkRzQhv3Np26-glauoNhqYMVraoaP4H1E39p2uvZZ_qkeO_A3-GEPh6xQpGwrrBfNs-waH0LA-2gf7yqWjg5RSrEpqSncoWtoMQyRI",
      content: "Le risk management est enfin devenu un automatisme. Mes pertes sont maîtrisées, mes gains explosent.",
      badge: "verified_user",
      imgAlt: "Trade History",
      imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMjcu2WYwSwCcCK83gyXzjHmQVVlfsnW_V0s90fQJXh-at0m5ED6-gvLPoXZkEhCSjFCgLJbqLAc3aaJIU_mjZ72_Vm20ZW0wF8XQq5F4tobDKUywdgaDWQ_GUYYeB8Jr9_ShQHmGEbNz5YkoCbG6cgla64p1-WcNsEQuDm-PL2wNiDy4hexO1zjik5aPHhz4ghb6TjgGKLwoczlKCBEsdCWseXjexcJtHBIiuBYA7NJo0jEMtH9hHiuRc1ufwgBvohLUuOOHiACI"
    }
  ];

  return (
    <section className="bg-surface-container-low py-24 px-8 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-headline font-bold mb-4">La preuve par les chiffres</h2>
            <p className="text-outline max-w-md">Nos étudiants ne se contentent pas d'apprendre, ils performent sur les marchés réels.</p>
          </div>
          <div className="flex gap-12">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-5xl font-headline font-bold text-primary">{s.value}</p>
                <p className="text-xs font-label text-outline uppercase tracking-widest mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-surface-container p-6 rounded-xl border-t border-white/5 glow-violet">
              <div className="aspect-video bg-surface-container-lowest rounded-lg mb-6 overflow-hidden relative group">
                <img alt={t.imgAlt} className="w-full h-full object-cover blur-sm opacity-40 group-hover:blur-none transition-all duration-500" src={t.imgSrc} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary-container">{t.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-10 h-10 rounded-full bg-surface-variant bg-cover bg-center" 
                  style={{ backgroundImage: `url('${t.image}')` }}
                ></div>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-outline">{t.role}</p>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">"{t.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
