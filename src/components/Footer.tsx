export const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-sm font-medium text-foreground">
            NACKA STRAND CUSTOMS
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nacka Strand Customs. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
};
