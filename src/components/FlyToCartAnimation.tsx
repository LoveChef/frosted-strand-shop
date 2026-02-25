import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlyingItem {
  id: string;
  imageUrl: string;
  startX: number;
  startY: number;
}

// Global event for triggering the animation from anywhere
const FLY_EVENT = "fly-to-cart";

export function triggerFlyToCart(imageUrl: string, startX: number, startY: number) {
  window.dispatchEvent(
    new CustomEvent(FLY_EVENT, { detail: { imageUrl, startX, startY } })
  );
}

export const FlyToCartAnimation = () => {
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 });

  // Find cart icon position
  const updateCartPos = useCallback(() => {
    const cartEl = document.querySelector("[data-cart-icon]");
    if (cartEl) {
      const rect = cartEl.getBoundingClientRect();
      setCartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, []);

  useEffect(() => {
    updateCartPos();
    window.addEventListener("resize", updateCartPos);
    return () => window.removeEventListener("resize", updateCartPos);
  }, [updateCartPos]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { imageUrl, startX, startY } = (e as CustomEvent).detail;
      updateCartPos();
      const id = `${Date.now()}-${Math.random()}`;
      setItems((prev) => [...prev, { id, imageUrl, startX, startY }]);
      // Remove after animation completes
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 800);
    };
    window.addEventListener(FLY_EVENT, handler);
    return () => window.removeEventListener(FLY_EVENT, handler);
  }, [updateCartPos]);

  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="fixed pointer-events-none z-[9999]"
          initial={{
            x: item.startX - 32,
            y: item.startY - 32,
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: cartPos.x - 16,
            y: cartPos.y - 16,
            scale: 0.15,
            opacity: 0.6,
            rotate: 360,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg ring-2 ring-primary/50">
            <img
              src={item.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// Cart badge bounce animation hook
export function useCartBounce() {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const handler = () => {
      // Delay bounce to sync with arrival
      setTimeout(() => {
        setBounce(true);
        setTimeout(() => setBounce(false), 400);
      }, 650);
    };
    window.addEventListener(FLY_EVENT, handler);
    return () => window.removeEventListener(FLY_EVENT, handler);
  }, []);

  return bounce;
}
