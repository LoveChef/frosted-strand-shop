import { motion } from "framer-motion";
import logo from "@/assets/nscustoms-logo.png";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.img
        src={logo}
        alt="Nacka Strand Customs"
        className="h-16 md:h-24 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="flex items-baseline gap-0 font-display text-xl md:text-3xl tracking-wide text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span>Arbete pågår</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default UnderConstruction;
