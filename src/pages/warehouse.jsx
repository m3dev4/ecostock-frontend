import { Card, CardContent } from '@/components/ui/card';
import { Warehouse, MapPin, ChevronRight } from 'lucide-react';
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
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Warehouses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez tous vos entrepôts.
          </p>
        </div>

        <DrawerNested />
      </div>

      {/* Grid */}
      {warehouses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Aucun entrepôt disponible.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {warehouses.map((warehouse) => (
            <Link key={warehouse.id} to={`/warehouse/${warehouse.id}`}>
              <Card className="border border-border transition-colors hover:border-primary/40">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Warehouse className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {warehouse.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{warehouse.location}</span>
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">Capacité</span>
                    <span className="text-sm font-semibold text-foreground">
                      {warehouse.capacity} unités
                    </span>
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
