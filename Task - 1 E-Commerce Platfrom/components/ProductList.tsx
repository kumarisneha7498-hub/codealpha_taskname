import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductList: React.FC = () => {
  const { filteredProducts } = useStore();

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-600">No products found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};