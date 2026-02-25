import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const policies: Record<string, { title: string; content: string }> = {
  "retur-och-aterbetalningspolicy": {
    title: "Retur- och återbetalningspolicy",
    content: `Vi vill att du ska vara helt nöjd med ditt köp. Om du inte är nöjd med din beställning kan du returnera produkten inom 14 dagar efter mottagandet.

**Villkor för retur:**
- Produkten måste vara oanvänd och i originalförpackning.
- Returen måste initieras inom 14 dagar från leveransdatum.
- Kontakta oss via e-post för att starta en retur.

**Återbetalning:**
- Återbetalning sker till den ursprungliga betalningsmetoden inom 5–10 arbetsdagar efter att vi mottagit och godkänt returen.
- Fraktkostnader för returen står kunden för, om inte produkten var defekt vid leverans.

**Defekta produkter:**
- Om du mottar en defekt eller skadad produkt, kontakta oss omedelbart. Vi ersätter produkten eller återbetalar hela beloppet inklusive fraktkostnad.

**Kontakta oss:**
- E-post: info@nackastrandcustoms.se`,
  },
  "integritetspolicy": {
    title: "Integritetspolicy",
    content: `Din integritet är viktig för oss. Denna policy förklarar vilka personuppgifter vi samlar in, hur vi använder dem och vilka rättigheter du har.

**Vilka uppgifter vi samlar in:**
- Namn, e-postadress och leveransadress vid köp.
- Betalningsuppgifter (hanteras säkert av vår betalningsleverantör).
- Teknisk information som IP-adress och webbläsartyp vid besök på hemsidan.

**Hur vi använder uppgifterna:**
- För att fullfölja och leverera din beställning.
- För att kommunicera med dig om din order.
- För att förbättra vår webbplats och service.

**Delning av uppgifter:**
- Vi delar aldrig dina personuppgifter med tredje part, utom med betaltjänstleverantörer och fraktbolag som krävs för att fullfölja din beställning.

**Dina rättigheter:**
- Du har rätt att begära tillgång till, radering av, eller rättelse av dina personuppgifter.
- Kontakta oss på info@nackastrandcustoms.se för att utöva dina rättigheter.

**Cookies:**
- Vi använder cookies för att förbättra din upplevelse. Du kan hantera cookies via din webbläsare.`,
  },
  "anvandarvillkor": {
    title: "Användarvillkor",
    content: `Genom att använda vår webbplats och göra köp godkänner du följande villkor.

**Beställningar:**
- Alla priser anges i SEK och inkluderar moms om inte annat anges.
- En beställning är bindande när du har mottagit orderbekräftelse via e-post.
- Vi förbehåller oss rätten att annullera beställningar vid felaktig prissättning eller lagerbrist.

**Betalning:**
- Vi accepterar betalning via de metoder som visas i kassan.
- Betalning dras vid beställningstillfället.

**Leverans:**
- Leveranstider varierar beroende på produkt och destination.
- Beräknad leveranstid anges vid beställning.

**Ansvarsbegränsning:**
- Vi ansvarar inte för indirekta skador som uppstår genom användning av våra produkter.
- Vår maximala ersättning är begränsad till varans inköpspris.

**Ändringar:**
- Vi förbehåller oss rätten att uppdatera dessa villkor. Ändringarna gäller från publiceringsdatumet.`,
  },
  "leveranspolicy": {
    title: "Leveranspolicy",
    content: `Vi strävar efter att leverera din beställning så snabbt och säkert som möjligt.

**Leveranstider:**
- Standard leverans: 1-3 arbetsdagar inom Sverige.
- Leveranstider kan variera vid hög belastning eller helgdagar.

**Fraktkostnad:**
- Fraktkostnad beräknas i kassan baserat på vikt och destination.
- Fri frakt kan erbjudas vid kampanjer eller vid köp över ett visst belopp.

**Spårning:**
- Du får ett spårningsnummer via e-post när din beställning har skickats.

**Förseningar:**
- Vid eventuella förseningar kontaktar vi dig via e-post.
- Vi ansvarar inte för förseningar orsakade av fraktbolaget, men hjälper dig att lösa eventuella problem.

**Leveransadress:**
- Säkerställ att leveransadressen är korrekt vid beställning. Vi ansvarar inte för leveranser till felaktiga adresser.`,
  },
  "kontaktuppgifter": {
    title: "Kontaktuppgifter",
    content: `**Nacka Strand Customs**

Vi hjälper dig gärna med frågor om beställningar, produkter eller annat.

**E-post:**
info@nackastrandcustoms.se

**Svarstider:**
- Vi svarar på e-post inom 1–2 arbetsdagar.`,
  },
};

const PolicyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? policies[slug] : null;

  if (!policy) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-heading font-bold text-foreground">Sidan hittades inte</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Tillbaka till startsidan</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={`${policy.title} – Nacka Strand Customs`} canonical={`/policy/${slug}`} />
      <Header />
      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Tillbaka</span>
        </Link>
        <div className="glass rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">{policy.title}</h1>
          <div className="prose prose-invert max-w-none space-y-4">
            {policy.content.split('\n\n').map((paragraph, i) => (
              <div key={i}>
                {paragraph.split('\n').map((line, j) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={j} className="text-lg font-heading font-semibold text-foreground mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={j} className="text-muted-foreground ml-4 list-disc">{line.slice(2)}</li>;
                  }
                  // Handle inline bold
                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={j} className="text-muted-foreground leading-relaxed">
                      {parts.map((part, k) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={k} className="text-foreground font-medium">{part.replace(/\*\*/g, '')}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
