import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export const HeroBanner = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const scrollToProduct = () => {
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden" aria-label="Hjältebanner">
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <img
          src={heroBanner}
          alt="Magnetisk registreringsskyltshållare monterad på bil"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0" style={{ background: "var(--gradient-radial-glow)" }} />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-28 md:pb-32"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-primary mb-8"
          />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6 text-foreground tracking-tight">
            Magnetisk
            <br />
            <span className="gradient-text">Skyltshållare</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
            Fäst och lossa din registreringsskylt på sekunder.
            <br className="hidden md:block" />
            Ingen borrning. Inga skador. Ren design.
          </p>
          <motion.button
            onClick={scrollToProduct}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-lg font-display font-semibold text-primary-foreground text-lg transition-shadow duration-300"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            Köp Nu
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs font-display text-muted-foreground tracking-widest uppercase">Scrolla</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};
