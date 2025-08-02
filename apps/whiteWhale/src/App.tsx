import { Outlet } from 'react-router-dom';
import './App.css';
import Main from './pages/BackGroundPage';
import { AuthProvider } from './Dummys/AuthContextDummy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/ui/radixUi/Header';
import { ProductCategoryProvider } from './components/context/ProductCategoryContext';
import PageHeader from './components/ui/PageHeader';
import { CartProvider } from './components/context/CartContext';
import SideDrawer from './components/ui/SideDrawer';
import Footer from './components/ui/Footer';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AuthProvider>
          <ProductCategoryProvider>
            <div
              className="w-full h-screen flex:1 flex-col justify-start  bg-slate-300 "
              id="mainSection"
            >
              <Header />
              <SideDrawer />
              <PageHeader />
              <Main />
              {/* <div className="flex-grow"> */}
              <Outlet />
              {/* </div> */}
              <Footer />
            </div>
          </ProductCategoryProvider>
        </AuthProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
