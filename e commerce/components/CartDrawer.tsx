import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, clearCart, user, setIsAuthModalOpen } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!user) {
        setIsCartOpen(false);
        setIsAuthModalOpen(true);
        toast.error("Please sign in to checkout");
        return;
    }

    setIsCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
        setIsCheckingOut(false);
        clearCart();
        setIsCartOpen(false);
        toast.success("Order placed successfully! Check your email.");
    }, 2000);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div 
            className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            onClick={() => setIsCartOpen(false)}
        ></div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 sm:duration-700 translate-x-0">
            <div className="h-full flex flex-col bg-white shadow-xl">
              
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-indigo-600" />
                    Shopping Cart
                </h2>
                <button
                  type="button"
                  className="-mr-2 -mt-2 p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsCartOpen(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                        <button 
                            className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
                            onClick={() => setIsCartOpen(false)}
                        >
                            Continue Shopping &rarr;
                        </button>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button 
                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-2 font-medium text-gray-900">{item.quantity}</span>
                                    <button 
                                        className="p-1 hover:bg-gray-100 text-gray-600"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="font-medium text-red-500 hover:text-red-700 flex items-center"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove
                                </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                      <p>Subtotal</p>
                      <p>${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <p>Tax Estimate (8%)</p>
                      <p>${tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 mb-6 pt-4 border-t border-gray-200">
                      <p>Total</p>
                      <p>${total.toFixed(2)}</p>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                      >
                        {isCheckingOut ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <>Checkout <ArrowRight className="ml-2 w-5 h-5" /></>
                        )}
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="text-indigo-600 font-medium hover:text-indigo-500"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};