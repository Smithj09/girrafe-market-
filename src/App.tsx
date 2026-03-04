import { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { SellerDashboard } from './components/SellerDashboard';
import { products } from './data/products';
import { Product } from './types';
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddProduct = () => {
    console.log('Add new product clicked');
  };

  const handleEditProduct = (product: Product) => {
    console.log('Edit product clicked', product);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product clicked', productId);
  };

  if (showSellerDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SellerDashboard 
          products={products}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-pink-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to MarketPlace</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover amazing products from trusted sellers around the world
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-pink-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                Shop Now
              </button>
              <button 
                onClick={() => setShowSellerDashboard(true)}
                className="bg-black text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sell on MarketPlace
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="mb-12 text-center">
          <h2 className="section-title">
            Featured Products
          </h2>
          <p className="section-subtitle">
            Handpicked selection of quality products just for you
          </p>
        </div>

        <ProductGrid
          products={products}
          onViewDetails={setSelectedProduct}
        />
      </main>



      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <ProductDetail
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default App;