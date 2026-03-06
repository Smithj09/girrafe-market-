import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { Footer } from './components/Footer';
import { TypingAnimation } from './components/TypingAnimation';
import { SellerDashboard } from './components/SellerDashboard';
import { AddProductForm } from './components/AddProductForm';
import { EditProductForm } from './components/EditProductForm';
import { OrderForm } from './components/OrderForm';
import { Profile } from './components/Profile';
import { Orders } from './components/Orders';
import { Contact } from './components/Contact';
import { useCart } from './context/CartContext';

import { Product } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const { cartItems, cartTotal, clearCart } = useCart();

  const handleSendOrder = () => {
    setIsOrderFormOpen(true);
  };

  const handleOrderSubmit = async (customerData: { name: string; email: string; phone: string }) => {
    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url,
      }));

      console.log('Sending order:', { customerData, orderItems, total: cartTotal });

      const result = await (await import('./lib/orders')).createOrder({
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        items: orderItems,
        total: cartTotal,
      });

      console.log('Order created:', result);
      alert('Commande envoyée avec succès!');
      clearCart();
      setIsOrderFormOpen(false);
      setIsCartOpen(false);
    } catch (err: any) {
      console.error('Order failed:', err);
      console.error('Error details:', err.message, err.code);
      alert(`Échec de l'envoi de la commande: ${err.message || 'Erreur inconnue'}`);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAdminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return false;

      // check profile for is_admin flag
      const { data: profile, error: pErr } = await supabase.from('profiles').select('is_admin').eq('id', data.user.id).single();
      if (pErr || !profile) {
        // not an admin
        await supabase.auth.signOut();
        return false;
      }

      if (profile.is_admin) {
        setIsAdminLoggedIn(true);
        setIsSellerDashboardOpen(true);
        return true;
      }
      await supabase.auth.signOut();
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
    setIsSellerDashboardOpen(false);
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    try {
      const newProduct = await (await import('./lib/db')).addProduct(productData);
      console.log('Product added:', newProduct);
      setProducts(prev => [...prev, newProduct]);
      alert('Product added successfully!');
    } catch (err) {
      console.error('Add product failed', err);
      alert('Failed to add product');
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const prod = await (await import('./lib/db')).updateProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === prod.id ? prod : p));
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await (await import('./lib/db')).deleteProduct(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id || 'anonymous';
      setUserId(id);
      
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
        if (profile?.is_admin) {
          setIsAdminLoggedIn(true);
        }
        
        // Fetch orders count
        const count = await (await import('./lib/db')).fetchUserOrdersCount(session.user.id);
        setOrdersCount(count);
      }

      const list = await (await import('./lib/db')).fetchProducts();
      console.log('Fetched products:', list);
      setProducts(list || []);

      const saved = sessionStorage.getItem(`visibleProducts_${id}`);
      if (saved) setVisibleProducts(parseInt(saved, 10));
    };
    init();
  }, []);

  useEffect(() => {
    if (userId && products.length > 0) {
      const savedScroll = sessionStorage.getItem(`scrollPosition_${userId}`);
      if (savedScroll) {
        setTimeout(() => window.scrollTo(0, parseInt(savedScroll, 10)), 100);
      }
    }
  }, [products, userId]);

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem(`visibleProducts_${userId}`, visibleProducts.toString());
    }
  }, [visibleProducts, userId]);

  useEffect(() => {
    if (!userId) return;
    const handleScroll = () => {
      sessionStorage.setItem(`scrollPosition_${userId}`, window.scrollY.toString());
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userId]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onCartClick={() => setIsCartOpen(true)} 
        onDashboardClick={() => setIsSellerDashboardOpen(!isSellerDashboardOpen)}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        onProfileClick={() => setIsProfileOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        ordersCount={ordersCount}
        onContactClick={() => setIsContactOpen(true)}
      />

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
          products={products.slice(0, visibleProducts)}
          onViewDetails={setSelectedProduct}
        />
        
        {visibleProducts < products.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleProducts(prev => prev + 8)}
              className="bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-pink-700 transition-colors shadow-md"
            >
              Voir Plus
            </button>
          </div>
        )}
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        onSendOrder={handleSendOrder}
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

      <SellerDashboard
        isOpen={isSellerDashboardOpen && isAdminLoggedIn}
        onClose={() => setIsSellerDashboardOpen(false)}
        products={products}
        onAddProduct={() => setIsAddProductOpen(true)}
        onEditProduct={(product: Product) => {
          setProductToEdit(product);
          setIsEditProductOpen(true);
        }}
        onDeleteProduct={handleDeleteProduct}
      />

      <AddProductForm
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
      />

      <EditProductForm
        isOpen={isEditProductOpen}
        product={productToEdit}
        onClose={() => setIsEditProductOpen(false)}
        onSubmit={handleEditProduct}
      />

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onSubmit={handleOrderSubmit}
      />

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <Orders
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <Contact
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

export default App;