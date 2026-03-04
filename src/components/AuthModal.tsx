import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSwitchMode: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-3 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-black mb-2">
              {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
            </h2>
            <p className="text-pink-600 text-center mb-6">
              {mode === 'login' 
                ? 'Enter your credentials to continue' 
                : 'Get started with our marketplace today'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={mode === 'register'}
                      className="w-full px-4 py-3 pl-11 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                      placeholder="John Doe"
                    />
                    <User className="w-5 h-5 text-pink-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-11 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                    placeholder="you@example.com"
                  />
                  <Mail className="w-5 h-5 text-pink-400 absolute left-3 top-3.5" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pl-11 pr-12 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                    placeholder="••••••••"
                  />
                  <Lock className="w-5 h-5 text-pink-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-pink-400 hover:text-pink-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={mode === 'register'}
                      className="w-full px-4 py-3 pl-11 pr-12 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                      placeholder="••••••••"
                    />
                    <Lock className="w-5 h-5 text-pink-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              )}
              
              {mode === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-sm text-pink-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 mt-2"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-pink-600">
                {mode === 'login' 
                  ? "Don't have an account?" 
                  : "Already have an account?"}
                {' '}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="text-pink-600 font-medium hover:underline"
                >
                  {mode === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}