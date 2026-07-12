import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWarehouse } from '@/stores/warehouse.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Warehouse,
  MapPin,
  Boxes,
  ClipboardCheck,
  ArrowLeft,
  Hash,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const DetailWarehouse = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();

  const { warehouse, loading, error, fetchWarehouse, warehouseAudit } =
    useWarehouse();

  const [audit, setAudit] = useState(null);

  useEffect(() => {
    if (id) {
      fetchWarehouse(id);
    }
  }, [id, fetchWarehouse]);

  const handleAudit = async () => {
    const response = await warehouseAudit(id);

    if (response) {
      setAudit(response.data);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-destructive">
        Erreur : {error}
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Entrepôt introuvable.
      </div>
    );
  }

  const infoItems = [
    { icon: Hash, label: 'ID', value: warehouse.id },
    { icon: MapPin, label: 'Adresse', value: warehouse.location },
    { icon: Boxes, label: 'Capacité', value: `${warehouse.capacity} unités` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link to="/warehouse">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {warehouse.name}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Détails de l'entrepôt
            </p>
          </div>
        </div>
        {isAuthenticated ? (
          <Button onClick={handleAudit} className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Lancer un audit
          </Button>
        ) : null}
      </div>

      {/* Info card */}
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Warehouse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {warehouse.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Informations générales
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {infoItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit result */}
      {audit && (
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Résultat de l'audit
                </h2>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Entrepôt</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {audit.warehouse}
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  Nombre total de produits
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {audit.total_products}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailWarehouse;
