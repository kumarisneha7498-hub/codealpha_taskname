import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingCart, Check } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useStore();

  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            onClick={() => setSelectedProduct(null)}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
                <div className="aspect-w-16 aspect-h-9 w-full h-64 sm:h-96 bg-gray-100 relative">
                    <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="p-6 sm:p-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                                {selectedProduct.name}
                            </h3>
                            <p className="mt-1 text-sm text-indigo-600 font-medium">
                                {selectedProduct.category}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ${selectedProduct.price.toFixed(2)}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h4 className="sr-only">Description</h4>
                        <p className="text-base text-gray-500 leading-relaxed">
                            {selectedProduct.description}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                addToCart(selectedProduct);
                                setSelectedProduct(null);
                            }}
                            className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </button>
                        <button
                             type="button"
                             className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             onClick={() => setSelectedProduct(null)}
                        >
                            Close
                        </button>
                    </div>
                    
                    <div className="mt-6 flex items-center text-sm text-gray-500">
                        <Check className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" />
                        In stock and ready to ship
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};