import { X, ShoppingCart, Package, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
  };

  // Generate random rating for demo purposes
  const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
  const reviewCount = Math.floor(Math.random() * 100) + 10; // Random review count

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] md:max-h-[80vh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b-2 border-pink-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-pink-800">Détails du Produit</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-pink-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-pink-700" />
            </button>
          </div>

          <div className="overflow-y-auto flex-grow">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Seulement {product.stock} restants
                    </span>
                  )}
                </div>
                
                <div className="flex gap-1 overflow-x-auto pb-2">
                  <div className="bg-pink-100 border-2 border-dashed rounded-lg w-16 h-16 flex-shrink-0" />
                  <div className="bg-pink-100 border-2 border-dashed rounded-lg w-16 h-16 flex-shrink-0" />
                  <div className="bg-pink-100 border-2 border-dashed rounded-lg w-16 h-16 flex-shrink-0" />
                  <div className="bg-pink-100 border-2 border-dashed rounded-lg w-16 h-16 flex-shrink-0" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-pink-700 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                    <Heart className="w-4 h-4 text-pink-700" />
                  </button>
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-pink-900 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-pink-700 font-medium">{rating}.0</span>
                  <span className="text-xs text-pink-500">({reviewCount} avis)</span>
                    </div>
                    
                    <p className="text-pink-600 text-xs md:text-sm leading-relaxed mb-2 md:mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4 text-pink-700">
                      <Package className="w-4 h-4" />
                      <span className="text-xs">
                    {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
                  </span>
                    </div>

                    <div className="border-t-2 border-pink-200 pt-4 mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl md:text-2xl font-bold text-black">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-pink-500 line-through">
                          ${(product.price * 1.2).toFixed(2)}
                        </span>
                        <span className="bg-pink-100 text-pink-800 text-xs font-medium px-1.5 py-0.5 rounded">
                        Économisez 20%
                      </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full btn-primary py-2 md:py-3 text-sm md:text-base flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
                  </button>
                  
                  <div className="mt-2 md:mt-3 grid grid-cols-2 gap-2 md:gap-3">
                    <button className="btn-secondary py-1.5 md:py-2 text-xs md:text-sm">
                      Acheter Maintenant
                    </button>
                    <button className="flex items-center justify-center gap-1.5 border-2 border-pink-200 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm hover:bg-pink-50 transition-colors">
                        <Heart className="w-4 h-4 text-pink-700" />
                        Liste de souhaits
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}