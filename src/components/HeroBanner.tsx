import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

export const HeroBanner = () => {
  const scrollToProduct = () => {
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroBanner}
        alt="Magnetisk registreringsskyltshållare monterad på bil"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-foreground">
            Magnetisk<br />
            <span className="gradient-text">Skyltshållare</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Fäst och lossa din registreringsskylt på sekunder. Ingen borrning. Inga skador. Ren design.
          </p>
          <button
            onClick={scrollToProduct}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-display font-medium text-primary-foreground transition-all duration-300 hover:scale-105"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Köp Nu
          </button>
        </motion.div>
      </div>
    </section>
  );
};
