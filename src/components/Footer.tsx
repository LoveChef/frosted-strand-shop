import { Link } from "react-router-dom";
import logoImg from "@/assets/nscustoms-logo.png";

const policyLinks = [
  { label: "Retur & Återbetalning", slug: "retur-och-aterbetalningspolicy" },
  { label: "Integritetspolicy", slug: "integritetspolicy" },
  { label: "Användarvillkor", slug: "anvandarvillkor" },
  { label: "Leveranspolicy", slug: "leveranspolicy" },
  { label: "Kontaktuppgifter", slug: "kontaktuppgifter" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src={logoImg} alt="Nacka Strand Customs" className="h-8 w-auto object-contain" />
            <div className="flex items-center gap-6">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {policyLinks.map((link) => (
                  <Link
                    key={link.slug}
                    to={`/policy/${link.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <a
                href="https://www.tiktok.com/@nackastrandcustoms"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground transition-all hover:border-accent hover:text-foreground hover:shadow-[0_0_16px_hsl(var(--accent)/0.25)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.8.1V9.01a6.27 6.27 0 0 0-.8-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.84a4.86 4.86 0 0 1-1.01-.15z" />
                </svg>
                TikTok
              </a>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nacka Strand Customs. Alla rättigheter förbehållna.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered By <span className="text-yellow-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>PRY</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
