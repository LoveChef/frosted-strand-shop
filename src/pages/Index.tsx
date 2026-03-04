import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";
import { FeaturesSection } from "@/components/FeaturesSection";
// import { InstallationGuide } from "@/components/InstallationGuide";
import { Footer } from "@/components/Footer";
import { SEOHead, organizationSchema, webSiteSchema } from "@/components/SEOHead";

const combinedSchema = [organizationSchema, webSiteSchema];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        canonical="/"
        jsonLd={{ "@context": "https://schema.org", "@graph": combinedSchema }}
      />
      <Header />
      <main>
        <HeroBanner />
        <ProductSection />
        {/* <InstallationGuide /> */}
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
