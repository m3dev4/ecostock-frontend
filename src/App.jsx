import React, { useEffect } from 'react';
import { useAuthStore } from './stores/auth.store';
import { Navigate } from 'react-router-dom';
import { Loader2, Building2, Package, Boxes, TrendingUp } from 'lucide-react';
import CardHead from './components/cardHead';
import { useWarehouse } from './stores/warehouse.store';
import { useProductStore } from './stores/product.store';
import { DrawerNested } from './components/warehouse/createWarehouse';
import { CreateProduct } from './components/createProduct';

const App = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const { warehouses, fetchAllWarehouses } = useWarehouse();
  const { products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllWarehouses();
      fetchAllProducts();
    }
  }, [isAuthenticated, fetchAllWarehouses, fetchAllProducts]);

  const totalWarehouse = warehouses.length;
  const totalProducts = products.length;

  const largestWarehouses =
    warehouses.reduce(
      (acc, val) => ((val.capacity || 0) > (acc?.capacity || 0) ? val : acc),
      warehouses[0],
    )?.capacity || 0;

  const totalQuantity = products.reduce(
    (acc, val) => acc + (val.quantity || 0),
    0,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue d'ensemble de votre inventaire.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="flex flex-wrap gap-2">
            <DrawerNested />
            <CreateProduct />
          </div>
        ) : null}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardHead
          title="Entrepôts"
          quantity={totalWarehouse}
          icon={Building2}
        />
        <CardHead title="Produits" quantity={totalProducts} icon={Package} />
        <CardHead
          title="Plus grande capacité"
          capacity={largestWarehouses}
          icon={TrendingUp}
        />
        <CardHead
          title="Total de quantité"
          quantity={totalQuantity}
          icon={Boxes}
        />
      </div>
    </div>
  );
};

export default App;
