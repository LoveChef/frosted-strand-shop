import { motion } from "framer-motion";
import { Magnet, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Magnet,
    title: "Superstarka magneter",
    description: "Neodymium-magneter som håller skylten säkert på plats i alla väderförhållanden.",
  },
  {
    icon: Shield,
    title: "Skadefri montering",
    description: "Montera magneterna i dina befintliga hål. Din bil förblir helt orörd.",
  },
  {
    icon: Zap,
    title: "Sekunders montering",
    description: "Fäst och lossa din registreringsskylt på under 5 sekunder.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24" aria-label="Produktfördelar">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl p-8 text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center bg-primary/10">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
