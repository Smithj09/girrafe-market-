import { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

export function ProductGrid({ products, onViewDetails }: ProductGridProps) {
  console.log('ProductGrid received products:', products);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [sortOption, setSortOption] = useState<string>('featured');

  const categories = ['Tous', ...Array.from(new Set(products.map((p) => p.category)))];

  let filteredProducts = selectedCategory === 'Tous'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Apply sorting based on selected option
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
      default:
        return 0; // Keep original order for featured
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-600 to-pink-800 text-white shadow-md'
                  : 'bg-white text-black hover:bg-pink-100 border border-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-white border-2 border-pink-200 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none w-full"
          >
            <option value="featured">Produits en vedette</option>
            <option value="price-low">Prix: Du plus bas au plus élevé</option>
            <option value="price-high">Prix: Du plus élevé au plus bas</option>
            <option value="name">Nom: De A à Z</option>
          </select>
          <ChevronDown className="w-5 h-5 text-pink-500 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit disponible.</p>
        </div>
      )}
    </div>
  );
}