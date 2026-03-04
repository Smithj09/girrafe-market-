import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  // Generate random rating for demo purposes
  const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
  const reviewCount = Math.floor(Math.random() * 100) + 10; // Random review count

  return (
    <div className="card group">
      <div 
        onClick={() => onViewDetails(product)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="text-xs font-medium text-pink-600 uppercase tracking-wide">
                {product.category}
              </span>
              <h3 className="text-sm font-semibold text-black mb-1 line-clamp-1">
                {product.name}
              </h3>
            </div>
            <div className="flex items-center bg-pink-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-black ml-1">{rating}.0</span>
            </div>
          </div>
          
          <p className="text-xs text-pink-600 mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-black">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center gap-1 btn-primary px-2 py-1 text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3 h-3" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}