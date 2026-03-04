import { useState } from 'react';
import { ShoppingCart, Store, Menu, X, User, Search, LogOut, Package } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
      <header className="sticky top-0 z-50 bg-[#131921] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                DorMark
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <nav className="flex gap-6">
                <a href="#" className="text-white hover:text-pink-300 font-medium transition-colors">Accueil</a>
                <a href="#" className="text-white hover:text-pink-300 font-medium transition-colors">Catégories</a>
                <a href="#" className="text-white hover:text-pink-300 font-medium transition-colors">Offres</a>
                <a href="#" className="text-white hover:text-pink-300 font-medium transition-colors">Contact</a>
              </nav>
              
              <div className="relative flex-grow max-w-md">
                <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                  />
                <Search className="w-4 h-4 text-pink-400 absolute left-2.5 top-2" />
              </div>
            </div>
            
            {/* Mobile Menu - Hidden on desktop */}
            <div className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex flex-col h-full pt-16">
                {/* Close button inside mobile menu */}
                <button 
                  onClick={toggleMobileMenu}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-100 transition-colors z-50"
                >
                  <X className="w-6 h-6 text-pink-700" />
                </button>
                
                <div className="relative px-4 py-3 border-b border-pink-200">
                  <div className="relative">
                    <input
                       type="text"
                       placeholder="Rechercher des produits..."
                       className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                     />
                    <Search className="w-5 h-5 text-pink-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <nav className="flex-1 flex flex-col p-4 space-y-2">
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Accueil
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Catégories
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Offres
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Contact
                    <span className="text-pink-500">›</span>
                  </a>
                </nav>
                
                {/* Mobile User Actions */}
                <div className="p-4 border-t border-pink-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center gap-2 p-3 bg-pink-100 rounded-lg transition-colors"
                      >
                        <User className="w-5 h-5 text-pink-700" />
                        <span className="text-pink-700 font-medium">Mon Compte</span>
                      </button>
                      
                      {dropdownOpen && (
                        <div className="mt-2 w-full bg-white rounded-lg shadow-lg border-2 border-pink-200 py-2 z-50">
                          <a 
                            href="#" 
                            className="flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                          >
                            <Package className="w-4 h-4" />
                            Mes Commandes
                          </a>
                          <a 
                            href="#" 
                            className="flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                          >
                            <User className="w-4 h-4" />
                            Profil
                          </a>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={toggleAuthModal}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-pink-600 text-white rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Se Connecter</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onCartClick}
                    className="w-full mt-2 relative flex items-center justify-center gap-2 p-3 bg-pink-100 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-pink-700" />
                    <span className="text-pink-700 font-medium">Panier</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
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
                        Mes Commandes
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <User className="w-4 h-4" />
                        Profil
                      </a>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
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
              
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-pink-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-pink-700" />
                ) : (
                  <Menu className="w-6 h-6 text-pink-700" />
                )}
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