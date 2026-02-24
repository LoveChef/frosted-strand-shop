import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: "website" | "product";
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Nacka Strand Customs";
const DEFAULT_DESCRIPTION =
  "Magnetiska registreringsskyltshållare – Montera i befintliga hål, ingen borrning krävs. Premium neodymium-magneter för alla standardskyltar.";
const SITE_URL = "https://nackastrandcustoms.se";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/Jv3pg8mvbkSs6EpuShP5ziBbHOv1/social-images/social-1771954152470-nscrektangel.webp";

export const SEOHead = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  type = "website",
  image = DEFAULT_IMAGE,
  jsonLd,
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Magnetiska Registreringsskyltshållare`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "sv_SE");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // JSON-LD
    const existingScripts = document.querySelectorAll('script[data-seo="jsonld"]');
    existingScripts.forEach((s) => s.remove());

    if (jsonLd) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo", "jsonld");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.querySelectorAll('script[data-seo="jsonld"]').forEach((s) => s.remove());
    };
  }, [fullTitle, description, canonicalUrl, type, image, jsonLd]);

  return null;
};

// Pre-built JSON-LD schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nacka Strand Customs",
  url: "https://nackastrandcustoms.se",
  logo: DEFAULT_IMAGE,
  description: DEFAULT_DESCRIPTION,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "Swedish",
  },
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nacka Strand Customs",
  url: "https://nackastrandcustoms.se",
  inLanguage: "sv",
  description: DEFAULT_DESCRIPTION,
};

export const buildProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  url: string;
  available: boolean;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  url: product.url,
  brand: {
    "@type": "Brand",
    name: "Nacka Strand Customs",
  },
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency,
    availability: product.available
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: {
      "@type": "Organization",
      name: "Nacka Strand Customs",
    },
    url: product.url,
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "SE",
      },
    },
  },
});
