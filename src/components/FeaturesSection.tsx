import { motion } from "framer-motion";
import { Magnet, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Magnet,
    title: "Superstarka magneter",
    description: "Neodymium-magneter som håller skylten säkert på plats i alla väderförhållanden.",
    stat: "N52",
    statLabel: "Magnet",
  },
  {
    icon: Shield,
    title: "Skadefri montering",
    description: "Montera magneterna i dina befintliga hål. Din bil förblir helt orörd.",
    stat: "0",
    statLabel: "Skador",
  },
  {
    icon: Zap,
    title: "Sekunders montering",
    description: "Fäst och lossa din registreringsskylt på under 5 sekunder.",
    stat: "<5s",
    statLabel: "Montering",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden" aria-label="Produktfördelar">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, hsl(200 80% 60% / 0.06) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[2px] bg-primary mx-auto mb-6"
          />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Varför <span className="gradient-text">Oss?</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group glass rounded-2xl p-8 relative overflow-hidden transition-shadow duration-500"
              style={{ boxShadow: "var(--shadow-card)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsl(200 80% 60% / 0.06) 0%, transparent 60%)" }}
              />

              <div className="relative">
                {/* Stat highlight */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-display font-bold gradient-text">{feature.stat}</span>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{feature.statLabel}</p>
                  </div>
                </div>

                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
