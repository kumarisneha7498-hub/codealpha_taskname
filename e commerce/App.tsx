import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AIChatBot } from './components/AIChatBot';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductList />
        </div>
        <ProductModal />
        <CartDrawer />
        <AuthModal />
        <AIChatBot />
        <Toaster position="bottom-center" />
      </Layout>
    </StoreProvider>
  );
};

export default App;