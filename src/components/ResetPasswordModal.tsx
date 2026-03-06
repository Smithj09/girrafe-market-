import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-pink-900 mb-4">
          Réinitialiser le mot de passe
        </h2>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">Email de réinitialisation envoyé!</p>
            <button onClick={onClose} className="btn-primary">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                placeholder="Votre email"
              />
              <Mail className="w-5 h-5 text-pink-500 absolute left-3 top-3.5" />
            </div>
            
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
