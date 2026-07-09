import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layout';
import Login from './pages/Login';
import Warehouse from './pages/warehouse';
import Product from './pages/product';
import DetailWarehouse from './components/warehouse/detailWarehouse';
import ProductDetail from './components/product/productDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/warehouse', element: <Warehouse /> },
      { path: '/products', element: <Product /> },
      { path: '/warehouse/:id', element: <DetailWarehouse /> },
      { path: '/product/:id', element: <ProductDetail /> },
    ],
  },
  { path: '/login', element: <Login /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
