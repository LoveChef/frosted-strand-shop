import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import logoImg from "@/assets/nscustoms-logo.png";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

export const ProductSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    fetchProducts(10).
    then(setProducts).
    catch(console.error).
    finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>);

  }

  if (products.length === 0) {
    return (
      <section id="product" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-lg">Inga produkter hittades.</p>
        </div>
      </section>);

  }

  const product = products[0];
  const images = product.node.images.edges;
  const variant = product.node.variants.edges[0]?.node;
  const price = variant?.price || product.node.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });
    toast.success("Tillagd i varukorgen!", { position: "top-center" });
  };

  return (
    <section id="product" className="py-24" aria-label="Produkter">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-5 md:p-12"
          style={{ boxShadow: "var(--shadow-card)" }}>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20">
                {images[selectedImage] &&
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.node.title}
                  className="w-full h-full object-cover" />

                }
              </div>
              {images.length > 1 &&
              <div className="flex gap-3">
                  {images.map((img, i) =>
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? "border-primary" : "border-transparent"}`
                  }>

                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                )}
                </div>
              }
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                
                <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3 break-words">
                  {product.node.title}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                  {product.node.description || "Premium magnetisk registreringsskyltshållare. Enkel montering, ingen borrning krävs."}
                </p>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold gradient-text">
                  {parseFloat(price.amount).toFixed(0)}
                </span>
                <span className="text-lg text-muted-foreground">{price.currencyCode}</span>
                {variant?.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(price.amount) &&
                <span className="text-lg text-muted-foreground line-through opacity-60">
                    {parseFloat(variant.compareAtPrice.amount).toFixed(0)} {variant.compareAtPrice.currencyCode}
                  </span>
                }
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Stark magnetisk fästning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Ingen borrning krävs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Passar alla standardskyltar
                </li>
              </ul>

              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !variant?.availableForSale}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-display font-medium text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>

                {isCartLoading ?
                <Loader2 className="w-5 h-5 animate-spin" /> :

                <>
                    <ShoppingCart className="w-5 h-5" />
                    Lägg i Varukorg
                  </>
                }
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

};