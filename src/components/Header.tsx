import { motion } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import logo from "@/assets/nscustoms-logo.png";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong">

      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/">
          <img src={logo} alt="Nacka Strand Customs" className="h-10 w-auto border-black/0 border-0 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        </a>
        <CartDrawer />
      </div>
    </motion.header>);

};