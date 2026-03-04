import { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

export function ProductGrid({ products, onViewDetails }: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('featured');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  let filteredProducts = selectedCategory === 'All'
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
            className="appearance-none bg-white border border-black rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none w-full md:w-48"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <ChevronDown className="w-5 h-5 text-pink-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}