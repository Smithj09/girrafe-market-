import { useState } from 'react';
import { X, Lock, User } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
}

export function AdminLoginModal({ isOpen, onClose, onLogin }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // perform login via provided handler
    try {
      const ok = await onLogin(username, password);
      if (ok) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setError('Invalid credentials.');
        setPassword('');
      }
    } catch (err) {
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-3 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-pink-900 mb-2">
              Admin Login
            </h2>
            <p className="text-pink-600 text-center mb-6 text-sm">
              Enter your credentials to access the dashboard
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-800 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-3 pl-11 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                    disabled={loading}
                  />
                  <User className="w-5 h-5 text-pink-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pl-11 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                    disabled={loading}
                  />
                  <Lock className="w-5 h-5 text-pink-500 absolute left-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-800 text-white font-semibold py-3 rounded-lg hover:from-pink-700 hover:to-pink-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 hover:bg-pink-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-pink-700" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
