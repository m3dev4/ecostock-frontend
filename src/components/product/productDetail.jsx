import { useProductStore } from '@/stores/product.store';
import { useWarehouse } from '@/stores/warehouse.store';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Package,
  CalendarDays,
  Warehouse,
  ArrowRightLeft,
  Boxes,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const ProductDetail = () => {
  const { id } = useParams();

  const { product, fetchProduct, productMove, loading } = useProductStore();

  const { warehouses, fetchAllWarehouses } = useWarehouse();
  const { isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    warehouse: '',
  });

  useEffect(() => {
    fetchProduct(id);
    fetchAllWarehouses();
  }, [id]);

  useEffect(() => {
    if (product) {
      setFormData({
        warehouse: '',
      });
    }
  }, [product]);

  const handleMove = async (e) => {
    e.preventDefault();
    if (!formData.warehouse) {
      toast.error('Veuillez sélectionner un entrepôt');
      return;
    }

    try {
      const response = await productMove(id, {
        warehouse: Number(formData.warehouse),
      });

      if (response) {
        toast.success(response.data?.message || 'Produit déplacé avec succès');

        await fetchProduct(id);

        setFormData({
          warehouse: '',
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Erreur lors du déplacement',
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        Chargement du produit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center text-destructive">
        Produit introuvable
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      disponible: 'bg-emerald-50 text-emerald-700',
      reserve: 'bg-amber-50 text-amber-700',
      perime: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-muted text-muted-foreground';
  };

  const infoItems = [
    { icon: Boxes, label: 'Quantité', value: product.quantity },
    {
      icon: CalendarDays,
      label: "Date d'expiration",
      value: product.expiration_date,
    },
    {
      icon: Warehouse,
      label: 'Entrepôt actuel',
      value: product.warehouse_name,
    },
  ];

  return (
    <div className="space-y-6">
      <Toaster
        richColors
        position="top-right"
        expand
        closeButton
        duration={5000}
      />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/products">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Détail du produit
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Consultez les informations et gérez le déplacement du produit.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product info */}
        <Card className="lg:col-span-2 border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 pb-5 border-b border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {product.name}
                </h2>
                <span
                  className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadge(
                    product.status,
                  )}`}
                >       
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {infoItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Move product */}
        {isAuthenticated ? (
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  Déplacer
                </h2>
              </div>

              <form onSubmit={handleMove} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nouvel entrepôt
                  </label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) =>
                      setFormData({
                        warehouse: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Sélectionner un entrepôt</option>
                    {warehouses
                      ?.filter((w) => w.id !== product.warehouse)
                      .map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    product.expiration_date <
                    new Date().toISOString().split('T')[0]
                  }
                >
                  Déplacer le produit
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
