import { useState } from 'react';
import { Tag, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductDetail } from './ProductDetail';

interface SpecialOffersProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onViewDetails: (product: Product) => void;
}

export function SpecialOffers({ isOpen, onClose, products, onViewDetails }: SpecialOffersProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  if (!isOpen) return null;

  const specialProducts = products.filter(p => p.price < 80);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-800 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:text-pink-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Offres Spéciales</h1>
              <p className="text-pink-100 mt-1">Profitez de nos meilleures promotions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {specialProducts.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Aucune offre spéciale pour le moment</h2>
            <p className="text-gray-500">Revenez bientôt pour découvrir nos promotions!</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 mb-8 text-center">
              <p className="text-pink-800 font-bold text-xl">
                🎉 {specialProducts.length} produits en promotion - Économisez jusqu'à 50%!
              </p>
              <p className="text-pink-600 mt-2">Offres limitées - Ne manquez pas cette occasion!</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {specialProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                    PROMO
                  </div>
                  <ProductCard
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
