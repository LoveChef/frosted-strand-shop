import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import logoImg from "@/assets/nscustoms-logo.png";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { triggerFlyToCart } from "./FlyToCartAnimation";

export const ProductSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<'both' | 'single'>('both');
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


  const actualQuantity = selectedOption === 'both' ? quantity * 2 : quantity;

  const handleAddToCart = async (e: React.MouseEvent) => {
    if (!variant) return;
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
      quantity: actualQuantity,
      selectedOptions: variant.selectedOptions || []
    });
    const label = selectedOption === 'both' ? `${actualQuantity}st (Fram & Bak)` : `${actualQuantity}st (Fram eller Bak)`;
    toast.success(`${label} tillagd i varukorgen!`, { position: "top-center" });
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
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20 relative group">
                {images[selectedImage] &&
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.node.title}
                  className="w-full h-full object-cover" />
                }
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/90"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/90"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
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

              {/* Option selector */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOption('both')}
                  className={`flex-1 px-4 py-3 rounded-lg font-display font-medium text-sm border-2 transition-all duration-200 ${
                    selectedOption === 'both'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-secondary/20 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  Fram & Bak
                  <span className="block text-xs text-muted-foreground mt-0.5">2st per set</span>
                </button>
                <button
                  onClick={() => setSelectedOption('single')}
                  className={`flex-1 px-4 py-3 rounded-lg font-display font-medium text-sm border-2 transition-all duration-200 ${
                    selectedOption === 'single'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-secondary/20 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  Fram eller Bak
                  <span className="block text-xs text-muted-foreground mt-0.5">1st</span>
                </button>
              </div>

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-foreground hover:bg-secondary/30 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg font-bold">−</span>
                  </button>
                  <span className="px-4 py-3 text-foreground font-display font-bold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-foreground hover:bg-secondary/30 transition-colors"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>

                <button
                  ref={addBtnRef}
                  onClick={handleAddToCart}
                  disabled={isCartLoading || !variant?.availableForSale}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-display font-medium text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  {isCartLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Lägg i Varukorg ({actualQuantity}st)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

};