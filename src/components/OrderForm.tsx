import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

export function OrderForm({ isOpen, onClose, onSubmit }: OrderFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Vos informations</h2>
          <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Nom complet</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Envoyer la commande
          </button>
        </form>
      </div>
    </div>
  );
}
