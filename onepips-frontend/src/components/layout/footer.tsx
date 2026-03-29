export function Footer() {
  const links = [
    { label: "Terms of Service", href: "#" },
    { label: "Risk Disclosure", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="bg-surface-container-lowest w-full py-12 border-t border-outline-variant/15 mt-24">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center space-y-6">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          {links.map((link) => (
            <a
              key={link.label}
              className="text-outline-variant hover:text-outline font-body text-[10px] leading-relaxed uppercase tracking-widest transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-outline font-body text-[10px] leading-relaxed max-w-2xl opacity-80 hover:opacity-100 transition-opacity">
          © {new Date().getFullYear()} One Pips Premium Trading Education. High-risk investment warning:
          Trading involves significant risk. Les performances passées ne
          garantissent pas les résultats futurs. Ne tradez que le capital que
          vous pouvez vous permettre de perdre.
        </p>
      </div>
    </footer>
  );
}
