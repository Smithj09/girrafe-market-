import { useState } from 'react';
import { ShoppingCart, Store, Menu, X, User, Search, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { AdminLoginModal } from './AdminLoginModal';

interface HeaderProps {
  onCartClick: () => void;
  onDashboardClick?: () => void;
  isAdminLoggedIn?: boolean;
  onAdminLogin?: (email: string, password: string) => Promise<boolean>;
  onAdminLogout?: () => void;
  onProfileClick?: () => void;
  onOrdersClick?: () => void;
  ordersCount?: number;
  onContactClick?: () => void;
  onOffersClick?: () => void;
}

export function Header({ onCartClick, onDashboardClick, isAdminLoggedIn = false, onAdminLogin, onAdminLogout, onProfileClick, onOrdersClick, ordersCount = 0, onContactClick, onOffersClick }: HeaderProps) {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  const toggleAuthModal = () => {
    setAuthModalOpen(!authModalOpen);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDashboardClick = () => {
    if (isAdminLoggedIn) {
      onDashboardClick?.();
    } else {
      setAdminLoginModalOpen(true);
    }
  };

  const handleAdminLogin = async (username: string, password: string): Promise<boolean> => {
    const ok = await onAdminLogin?.(username, password);
    if (ok) {
      setAdminLoginModalOpen(false);
      onDashboardClick?.();
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    onAdminLogout?.();
    setDropdownOpen(false);
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                DorMark
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <nav className="flex gap-6 items-center">
                <a href="#hero" className="text-white hover:text-pink-300 font-medium transition-colors">Accueil</a>
                <a href="#products" className="text-white hover:text-pink-300 font-medium transition-colors">Catégories</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onOffersClick?.(); }} className="text-white hover:text-pink-300 font-medium transition-colors">Offres Spéciales</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onContactClick?.(); }} className="text-white hover:text-pink-300 font-medium transition-colors">Contact</a>
                <a href="#" className="text-white hover:text-pink-300 font-medium transition-colors" onClick={(e) => {
                  e.preventDefault();
                  handleDashboardClick();
                }}>Dashboard</a>
                {isAdminLoggedIn && (
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                )}
              </nav>
              
              <div className="relative flex-grow max-w-md">
                <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    className="w-full pl-9 pr-3 py-1 text-sm bg-white border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-black"
                  />
                <Search className="w-4 h-4 text-pink-400 absolute left-2.5 top-1" />
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
                       className="w-full pl-9 pr-3 py-1 text-sm bg-white border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-black"
                     />
                    <Search className="w-4 h-4 text-pink-400 absolute left-2.5 top-1" />
                  </div>
                </div>
                <nav className="flex-1 flex flex-col p-4 space-y-2">
                  <a href="#hero" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Accueil
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#products" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={toggleMobileMenu}>
                    Catégories
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={(e) => { e.preventDefault(); onOffersClick?.(); toggleMobileMenu(); }}>
                    Offres Spéciales
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={(e) => { e.preventDefault(); onContactClick?.(); toggleMobileMenu(); }}>
                    Contact
                    <span className="text-pink-500">›</span>
                  </a>
                  <a href="#" className="text-black hover:text-pink-700 font-medium py-3 px-4 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-between" onClick={(e) => {
                    e.preventDefault();
                    handleDashboardClick();
                    toggleMobileMenu();
                  }}>
                    Dashboard
                    <span className="text-pink-500">›</span>
                  </a>
                  {isAdminLoggedIn && (
                    <button
                      onClick={() => {
                        handleAdminLogout();
                        toggleMobileMenu();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  )}
                </nav>
                
                {/* Mobile User Actions */}
                <div className="p-4 border-t border-pink-200">
                  {user ? (
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
                          <button 
                            onClick={() => { onOrdersClick?.(); setDropdownOpen(false); toggleMobileMenu(); }}
                            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                          >
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Mes Commandes
                            </div>
                            {ordersCount > 0 && (
                              <span className="bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {ordersCount}
                              </span>
                            )}
                          </button>
                          <button 
                            onClick={() => { onProfileClick?.(); setDropdownOpen(false); toggleMobileMenu(); }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                          >
                            <User className="w-4 h-4" />
                            Profil
                          </button>
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
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-pink-100 rounded-lg transition-colors"
                  >
                    <User className="w-6 h-6 text-pink-700" />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-pink-200 py-2 z-50">
                      <button 
                        onClick={() => { onOrdersClick?.(); setDropdownOpen(false); }}
                        className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Mes Commandes
                        </div>
                        {ordersCount > 0 && (
                          <span className="bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {ordersCount}
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => { onProfileClick?.(); setDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-pink-700 hover:bg-pink-100"
                      >
                        <User className="w-4 h-4" />
                        Profil
                      </button>
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

      <AdminLoginModal 
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onLogin={handleAdminLogin}
      />
    </>
  );
}