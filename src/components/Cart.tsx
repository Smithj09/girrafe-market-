import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, isLoading } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-2 border-pink-200">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-pink-800">
              DorMakSmellsgood Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-pink-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Loader2 className="w-10 h-10 animate-spin text-pink-600 mb-4" />
              <p className="text-pink-800">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-pink-100 p-6 rounded-full mb-6">
                <ShoppingBag className="w-16 h-16 text-pink-400" />
              </div>
              <p className="text-pink-800 text-xl font-medium mb-2">Your cart is empty</p>
              <p className="text-pink-600 mb-6">Add some products to get started!</p>
              <button
                onClick={onClose}
                className="btn-primary px-6 py-3"
              >
                Continue Shopping on DorMakSmellsgood
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-4 rounded-xl border-2 border-pink-200 shadow-sm"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-pink-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-pink-600 mt-1">
                      ${item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-pink-100 rounded-full transition-colors border-2 border-pink-200"
                      >
                        <Minus className="w-4 h-4 text-pink-700" />
                      </button>
                      <span className="w-10 text-center font-medium bg-pink-100 py-1 rounded text-pink-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-pink-100 rounded-full transition-colors border-2 border-pink-200"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4 text-pink-700" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto p-1.5 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isLoading && cartItems.length > 0 && (
          <div className="border-t-2 border-pink-200 p-6 bg-white">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-pink-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-600">Shipping</span>
                <span className="font-medium">$5.99</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-600">Tax</span>
                <span className="font-medium">${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-pink-200 pt-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-pink-800">Total</span>
                  <span className="text-2xl font-bold text-black">
                    ${(cartTotal + 5.99 + (cartTotal * 0.08)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 text-pink-600 font-medium py-3 hover:bg-pink-50 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}