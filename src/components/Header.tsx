import { motion } from "framer-motion";
import { CartDrawer } from "./CartDrawer";
import { useCartBounce } from "./FlyToCartAnimation";
import logo from "@/assets/nscustoms-logo.png";

export const Header = () => {
  const bounce = useCartBounce();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong">

      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/">
          <img src={logo} alt="Nacka Strand Customs" className="h-10 w-auto object-contain" />
        </a>
        <motion.div
          data-cart-icon
          animate={bounce ? { scale: [1, 1.4, 0.9, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <CartDrawer />
        </motion.div>
      </div>
    </motion.header>
  );
};