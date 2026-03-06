import { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../lib/db';

interface OrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Orders({ isOpen, onClose }: OrdersProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadOrders();
    }
  }, [isOpen, user]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      const data = await fetchUserOrders(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes Commandes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">Commande #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">{order.total_amount} FCFA</p>
                    <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span>{item.products?.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
