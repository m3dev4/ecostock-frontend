import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Pencil, Loader2 } from 'lucide-react';
import { useProductStore } from '@/stores/product.store';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';

const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateStr);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

const SNAP_POINTS = ['31rem', 1];

const UpdateProductModal = ({ product }) => {
  const { productUpdate, fetchAllProducts } = useProductStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    status: '',
    expiration_date: '',
  });

  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || '',
        quantity: product.quantity || '',
        status: product.status || '',
        expiration_date: product.expiration_date || '',
      });
    }
  }, [product, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // On ne renvoie que les données modifiées pour éviter les erreurs de l'API (ex: date déjà passée)
    const payload = {};
    if (formData.name !== product.name) payload.name = formData.name;
    if (Number(formData.quantity) !== product.quantity)
      payload.quantity = Number(formData.quantity) || 0;
    if (formData.status !== product.status) payload.status = formData.status;
    if (
      formData.expiration_date &&
      formData.expiration_date !== product.expiration_date
    ) {
      payload.expiration_date = formData.expiration_date;
    }

    try {
      const response = await productUpdate(product.id, payload);
      setLoading(false);

      if (response) {
        setOpen(false);
        toast.success('Produit modifié avec succès');
        await fetchAllProducts();
      }
    } catch (error) {
      setLoading(false);
      toast.error(getErrorMessage(error, 'Erreur lors de la modification'));
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      snapPoints={SNAP_POINTS}
      showSwipeHandle
    >
      <DrawerTrigger asChild>
        <button
          className="text-muted-foreground hover:text-primary transition-colors"
          type="button"
        >
          <Pencil size={16} />
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Modifier {product.name}</DrawerTitle>
          <DrawerDescription>
            Mettez à jour les informations de ce produit.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Nom</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Quantité</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date d'expiration</label>
            <Input
              type="date"
              value={formData.expiration_date}
              onChange={(e) => {
                const newDate = e.target.value;
                const expired = isPastDate(newDate);
                setFormData((prev) => {
                  let newStatus = prev.status;
                  if (expired) {
                    newStatus = 'perime';
                  } else if (prev.status === 'perime') {
                    newStatus = '';
                  }
                  return {
                    ...prev,
                    expiration_date: newDate,
                    status: newStatus,
                  };
                });
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Statut</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
            >
              <option value="">Sélectionner un statut</option>
              <option value="disponible" disabled={isPastDate(formData.expiration_date)}>Disponible</option>
              <option value="reserve" disabled={isPastDate(formData.expiration_date)}>Réservé</option>
              <option value="perime" disabled={!isPastDate(formData.expiration_date)}>Périmé</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : null}
            Enregistrer
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UpdateProductModal;
