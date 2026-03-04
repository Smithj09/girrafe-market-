import { useState } from 'react';
import { ShoppingCart, Store, Menu, User, Search, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { cartCount } = useCart();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // This would come from a real auth context
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleAuthModal = () => {
    setAuthModalOpen(!authModalOpen);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
                DorMakSmellsgood
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <nav className="flex gap-6">
                  <a href="#" className="text-pink-700 hover:text-pink-900 font-medium transition-colors">Home</a>
                  <a href="#" className="text-pink-700 hover:text-pink-900 font-medium transition-colors">Categories</a>
                  <a href="#" className="text-pink-700 hover:text-pink-900 font-medium transition-colors">Deals</a>
                  <a href="#" className="text-pink-700 hover:text-pink-900 font-medium transition-colors">Contact</a>
                </nav>
                
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                  <Search className="w-5 h-5 text-pink-400 absolute left-3 top-2.5" />
                </div>
              </div>
              
              {/* Mobile Search - Hidden on desktop */}
              <div className="md:hidden relative flex-grow mx-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm"
                />
                <Search className="w-4 h-4 text-pink-400 absolute left-3 top-2.5" />
              </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-pink-100 rounded-lg transition-colors"
                  >
                    <User className="w-6 h-6 text-pink-700" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-pink-200 py-2 z-50">
                      <a 
                        href="#" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={toggleAuthModal}
                  className="flex items-center gap-2 p-2 hover:bg-pink-100 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6 text-pink-700" />
                </button>
              )}
              
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-pink-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-pink-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button className="md:hidden p-2 hover:bg-pink-100 rounded-lg transition-colors">
                <Menu className="w-6 h-6 text-pink-700" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={toggleAuthModal} 
        mode={authMode} 
        onSwitchMode={switchAuthMode} 
      />
    </>
  );
}