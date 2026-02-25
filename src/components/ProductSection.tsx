import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { triggerFlyToCart } from "./FlyToCartAnimation";
import { useNavigate } from "react-router-dom";

export const ProductSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Record<number, number>>({});
  const [addedVariants, setAddedVariants] = useState<Set<string>>(new Set());
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(10)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-lg">Inga produkter hittades.</p>
        </div>
      </section>
    );
  }

  const handleAddToCart = async (product: ShopifyProduct, index: number) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    const imgUrl = product.node.images.edges[0]?.node.url;
    const btn = btnRefs.current[index];
    if (imgUrl && btn) {
      const rect = btn.getBoundingClientRect();
      triggerFlyToCart(imgUrl, rect.left + rect.width / 2, rect.top);
    }

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    setAddedVariants((prev) => new Set(prev).add(variant.id));
    setTimeout(() => {
      setAddedVariants((prev) => {
        const next = new Set(prev);
        next.delete(variant.id);
        return next;
      });
    }, 2000);

    toast.success("Tillagd i varukorgen!", { position: "top-center" });
  };

  return (
    <section id="product" className="py-20 md:py-32 relative" aria-label="Produkter">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-radial-glow)" }} />

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
            Våra <span className="gradient-text">Produkter</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Premium-tillbehör för din bil, designade med precision.
          </p>
        </motion.div>

        <div className={`grid gap-8 ${products.length === 1 ? "max-w-2xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {products.map((product, index) => {
            const images = product.node.images.edges;
            const variant = product.node.variants.edges[0]?.node;
            const price = variant?.price || product.node.priceRange.minVariantPrice;
            const selectedImg = selectedImages[index] || 0;
            const justAdded = variant && addedVariants.has(variant.id);

            return (
              <motion.div
                key={product.node.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group glass rounded-2xl overflow-hidden transition-shadow duration-500"
                style={{ boxShadow: "var(--shadow-card)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
                }}
              >
                {/* Image area */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.node.handle}`)}
                >
                  {images[selectedImg] && (
                    <motion.img
                      key={selectedImg}
                      src={images[selectedImg].node.url}
                      alt={images[selectedImg].node.altText || product.node.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Thumbnail strip on hover */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {images.slice(0, 4).map((img, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImages((prev) => ({ ...prev, [index]: i }));
                          }}
                          className={`w-10 h-10 rounded-md overflow-hidden border-2 transition-all ${
                            i === selectedImg
                              ? "border-primary scale-110"
                              : "border-white/20 hover:border-white/50"
                          }`}
                        >
                          <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-full glass-strong font-display font-bold text-sm text-foreground">
                      {parseFloat(price.amount).toFixed(0)} {price.currencyCode}
                    </div>
                  </div>
                </div>

                {/* Info area */}
                <div className="p-6">
                  <h3
                    className="font-display font-semibold text-lg text-foreground mb-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
                    {product.node.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                    {product.node.description || "Premium-tillbehör för din bil."}
                  </p>

                  {variant?.compareAtPrice &&
                    parseFloat(variant.compareAtPrice.amount) > parseFloat(price.amount) && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-muted-foreground line-through">
                          {parseFloat(variant.compareAtPrice.amount).toFixed(0)} {variant.compareAtPrice.currencyCode}
                        </span>
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          Spara{" "}
                          {(
                            parseFloat(variant.compareAtPrice.amount) - parseFloat(price.amount)
                          ).toFixed(0)}{" "}
                          {price.currencyCode}
                        </span>
                      </div>
                    )}

                  <motion.button
                    ref={(el) => { btnRefs.current[index] = el; }}
                    onClick={() => handleAddToCart(product, index)}
                    disabled={isCartLoading || !variant?.availableForSale}
                    whileTap={{ scale: 0.95 }}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg font-display font-medium text-primary-foreground transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100"
                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                  >
                    <AnimatePresence mode="wait">
                      {isCartLoading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </motion.div>
                      ) : justAdded ? (
                        <motion.div
                          key="added"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          Tillagd!
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Lägg i Varukorg
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
