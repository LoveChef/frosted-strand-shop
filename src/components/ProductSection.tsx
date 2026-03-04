import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import logoImg from "@/assets/nscustoms-logo.png";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { triggerFlyToCart } from "./FlyToCartAnimation";

export const ProductSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const addBtnRef = useRef<HTMLButtonElement>(null);

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


  const handleAddToCart = async (e: React.MouseEvent) => {
    if (!variant) return;
    // Trigger fly animation from button position
    const imgUrl = images[0]?.node.url;
    if (imgUrl && addBtnRef.current) {
      const rect = addBtnRef.current.getBoundingClientRect();
      triggerFlyToCart(imgUrl, rect.left + rect.width / 2, rect.top);
    }
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
                {product.node.descriptionHtml ? (
                  <div
                    className="text-sm md:text-base text-muted-foreground leading-relaxed break-words prose prose-invert prose-sm max-w-none [&_ul]:space-y-1 [&_ul]:mt-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_strong]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: product.node.descriptionHtml }}
                  />
                ) : (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed break-words">
                    {product.node.description || "Premium magnetisk registreringsskyltshållare. Enkel montering, ingen borrning krävs."}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-4xl font-display font-bold gradient-text">
                  {parseFloat(price.amount).toFixed(0)}
                </span>
                <span className="text-lg text-muted-foreground">{price.currencyCode}</span>
                {variant?.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(price.amount) &&
                <>
                    <span className="text-lg text-muted-foreground line-through opacity-60">
                      {parseFloat(variant.compareAtPrice.amount).toFixed(0)} {variant.compareAtPrice.currencyCode}
                    </span>
                    <span className="inline-flex items-center rounded-md glass px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-400/20">
                      Spara {(parseFloat(variant.compareAtPrice.amount) - parseFloat(price.amount)).toFixed(0)} {price.currencyCode}
                    </span>
                  </>
                }
              </div>

              <button
                ref={addBtnRef}
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