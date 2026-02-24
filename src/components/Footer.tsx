import logoImg from "@/assets/nscustoms-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logoImg} alt="Nacka Strand Customs" className="h-8 w-auto border-black/0 border-0 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nacka Strand Customs. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>);

};