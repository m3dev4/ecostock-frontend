import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Warehouse, MapPin, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWarehouse } from '@/stores/warehouse.store';
import { DrawerNested } from '@/components/warehouse/createWarehouse';
import { useAuthStore } from '@/stores/auth.store';
import { Navigate } from 'react-router-dom';

const Warehouses = () => {
  const { warehouses, loading, error } = useWarehouse();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
     
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>

          <p className="mt-1 text-sm text-slate-500">
            Gérez tous vos entrepôts.
          </p>
        </div>

         <DrawerNested />
      </div>

      {/* Grid */}
      {warehouses.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-16 text-center text-slate-500">
          Aucun entrepôt disponible.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Link key={warehouse.id} to={`/warehouse/${warehouse.id}`}>
              <Card className="border border-slate-200 shadow-none hover:border-cyan-500 transition-colors">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                      <Warehouse className="h-5 w-5 text-slate-700" />
                    </div>

                    <div>
                      <h3 className="font-semibold">{warehouse.name}</h3>

                      <p className="text-sm text-slate-500">
                        {warehouse.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">{warehouse.capacity}</p>

                    <p className="text-xs text-slate-500">unités</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Warehouses;
