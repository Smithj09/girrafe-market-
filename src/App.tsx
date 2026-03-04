import { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { TypingAnimation } from './components/TypingAnimation';
import { products } from './data/products';
import { Product } from './types';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-pink-800 text-white min-h-[70vh] sm:min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/264925/pexels-photo-264925.jpeg?auto=compress&cs=tinysrgb&w=1920" 
            alt="Market background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <TypingAnimation 
                text="Bienvenue sur DorMark" 
                className="inline-block"
              />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl sm:max-w-3xl mx-auto opacity-90">
              Produits de qualité, prix compétitifs
            </p>
            <div className="flex justify-center">
                <button className="bg-white text-pink-700 font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-pink-50 transition-colors shadow-lg">
                  Acheter Maintenant
                </button>
              </div>
          </div>
        </div>
      </section>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className="section-title text-2xl sm:text-3xl">
              Produits
            </h2>
            <p className="section-subtitle text-base sm:text-lg">
              Sélection faite par DorMark
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