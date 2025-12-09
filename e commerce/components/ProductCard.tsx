import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      <div 
        className="relative pt-[100%] bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="ml-1 text-xs font-semibold text-gray-700">{product.rating}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                {product.category}
            </span>
        </div>
        <h3 
            className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => setSelectedProduct(product)}
        >
            {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
            }}
            className="p-2 rounded-full bg-gray-900 text-white hover:bg-indigo-600 transition-colors shadow-sm active:transform active:scale-95"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};