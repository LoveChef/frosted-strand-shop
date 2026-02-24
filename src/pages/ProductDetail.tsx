import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2, ArrowLeft } from "lucide-react";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import logoImg from "@/assets/nscustoms-logo.png";
import { useCartStore } from "@/stores/cartStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    fetchProductByHandle(handle)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground">Produkten hittades inte.</p>
        </div>
      </div>
    );
  }

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
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Tillagd i varukorgen!", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8 md:p-12"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary/20">
                  {images[selectedImage] && (
                    <img
                      src={images[selectedImage].node.url}
                      alt={images[selectedImage].node.altText || product.node.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === selectedImage ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <img src={logoImg} alt="Nacka Strand Customs" className="h-8 w-auto mb-2" style={{ filter: "brightness(0) invert(1)" }} />
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                    {product.node.title}
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.node.description || "Premium magnetisk registreringsskyltshållare."}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold gradient-text">
                    {parseFloat(price.amount).toFixed(0)}
                  </span>
                  <span className="text-lg text-muted-foreground">{price.currencyCode}</span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isCartLoading || !variant?.availableForSale}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-display font-medium text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  {isCartLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Lägg i Varukorg
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
