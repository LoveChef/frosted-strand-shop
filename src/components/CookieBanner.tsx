import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="glass rounded-2xl border border-border p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-muted-foreground flex-1">
            Vi använder cookies för att förbättra din upplevelse. Läs mer i vår{" "}
            <Link to="/policy/integritetspolicy" className="text-primary hover:underline">
              integritetspolicy
            </Link>.
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={decline}>
              Avböj
            </Button>
            <Button size="sm" onClick={accept}>
              Acceptera
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
