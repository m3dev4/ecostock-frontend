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
      {audit && (() => {
        const products = Array.isArray(audit.products) ? audit.products : [];
        const warehouseName = audit.warehouse ?? '';
        return (
          <Card className="border border-border">
            <CardContent className="p-6">
              {/* Audit header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Résultat de l'audit{warehouseName ? ` — ${warehouseName}` : ''}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Products table */}
              {products.length === 0 ? (
                <div className="mt-6 flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground rounded-lg border border-dashed border-border">
                  <ClipboardCheck className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Aucun produit dans cet entrepôt.</p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-border">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Nom
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Quantité
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Date d'expiration
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {products.map((product, index) => {
                        const isExpired =
                          product.expiration_date <
                          new Date().toISOString().split('T')[0];
                        return (
                          <tr
                            key={product.id ?? index}
                            className="transition-colors hover:bg-muted/30"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-foreground">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                                  isExpired
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {product.expiration_date}
                                {isExpired ? ' · Périmé' : ''}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

    </div>
  );
};

export default DetailWarehouse;
