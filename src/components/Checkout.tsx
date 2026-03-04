import { useState } from 'react';
import { X, CreditCard, CheckCircle, MapPin, Mail, User, Lock, Truck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Checkout({ isOpen, onClose }: CheckoutProps) {
  const { cartItems, cartTotal, clearCart, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);

    setTimeout(() => {
      clearCart();
      setOrderComplete(false);
      setFormData({
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
      });
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number as user types
    if (name === 'cardNumber') {
      let formattedValue = value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      formattedValue = formattedValue.match(/.{1,4}/g)?.join(' ') || '';
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {orderComplete ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-pink-600" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Order Confirmed!</h2>
              <p className="text-black text-lg mb-2">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <p className="text-pink-600">
                Order ID: #{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 border-b border-black">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-pink-600 to-pink-800 p-2 rounded-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-black">Checkout</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-pink-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-600 mb-4" />
                    <p className="text-black">Loading your cart details...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-pink-100 p-6 rounded-full inline-block mb-6">
                      <Truck className="w-12 h-12 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">Your cart is empty</h3>
                    <p className="text-pink-600">Add some products to your cart before checking out.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-pink-600" />
                        Shipping Information
                      </h3>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1 flex items-center gap-1">
                              <User className="w-4 h-4" />
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-black mb-1 flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Address
                          </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg mt-6 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-pink-600" />
                          Payment Information
                        </h3>

                        <div>
                          <label className="block text-sm font-medium text-black mb-1 flex items-center gap-1">
                            <CreditCard className="w-4 h-4" />
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            maxLength={19}
                            className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              required
                              maxLength={5}
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              placeholder="123"
                              required
                              maxLength={3}
                              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full btn-primary py-4 mt-6 flex items-center justify-center gap-2"
                        >
                          <Lock className="w-5 h-5" />
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay $${(cartTotal + 5.99 + (cartTotal * 0.08)).toFixed(2)}`
                          )}
                        </button>
                      </form>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-pink-600" />
                        Order Summary
                      </h3>
                      
                      <div className="bg-pink-50 p-6 rounded-xl">
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-black last:border-0 last:pb-0">
                              <img 
                                src={item.product.image_url} 
                                alt={item.product.name} 
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-black truncate">{item.product.name}</h4>
                                <p className="text-sm text-pink-600">Qty: {item.quantity}</p>
                                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-3 mt-6 pt-4 border-t border-black">
                          <div className="flex justify-between">
                            <span className="text-pink-600">Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-600">Shipping</span>
                            <span>$5.99</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-pink-600">Tax</span>
                            <span>${(cartTotal * 0.08).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-black font-bold text-lg">
                            <span>Total</span>
                            <span className="text-pink-600">${(cartTotal + 5.99 + (cartTotal * 0.08)).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}