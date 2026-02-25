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