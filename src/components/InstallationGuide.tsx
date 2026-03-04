import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import step1Img from "@/assets/install-step1.jpg";
import step2Img from "@/assets/install-step2.jpg";
import step3Img from "@/assets/install-step3.jpg";
import step4Img from "@/assets/install-step4.jpg";
import step5Img from "@/assets/install-step5.jpg";

const steps = [
  {
    number: 1,
    image: step1Img,
    title: "Fäst 3M-tejpen",
    description: "Dra av skyddsfilmen och fäst 3M-tejpen på magnetens baksida.",
  },
  {
    number: 2,
    image: step2Img,
    title: "Skruva i magneten",
    description: "Använd den medföljande skruven för att fästa magneten i hålet.",
  },
  {
    number: 3,
    image: step3Img,
    title: "Skruva fast ordentligt",
    description: "Dra åt skruven med en skruvmejsel tills magneten sitter stadigt.",
  },
  {
    number: 4,
    image: step4Img,
    title: "Montera på bilen",
    description: "Placera magneterna i de befintliga skruvhålen på bilens front.",
  },
  {
    number: 5,
    image: step5Img,
    title: "Klart!",
    description: "Skylten snäpper fast magnetiskt – enkelt att ta av och sätta på.",
  },
];

export const InstallationGuide = () => {
  return (
    <section id="installation" className="py-24" aria-label="Monteringsguide">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Monteringsguide
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Montera på under 5 minuter – inga specialverktyg krävs.
          </p>
        </motion.div>

        {/* IKEA-style instruction grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-xl overflow-hidden group"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {/* Step number badge */}
                <div className="relative">
                  <div className="aspect-square bg-secondary/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-lg">
                    {step.number === 5 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                </div>

                {/* Text content */}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
