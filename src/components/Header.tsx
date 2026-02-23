import { motion } from "framer-motion";
import { CartDrawer } from "./CartDrawer";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
          NACKA STRAND CUSTOMS
        </a>
        <CartDrawer />
      </div>
    </motion.header>
  );
};
