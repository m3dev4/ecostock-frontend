'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
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
import { useWarehouse } from '@/stores/warehouse.store';
import { useState } from 'react';
import { Warehouse } from 'lucide-react';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useProductStore } from '@/stores/product.store';
import { Calendar } from './ui/calendar';
import { PRODUCT_STATUS } from '@/constants/enumProduct';
import { getErrorMessage } from '@/utils/errors';

const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateStr);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export function CreateProduct() {
  const isMobile = useIsMobile();
  const { productCreate, loading } = useProductStore();
  const { warehouses } = useWarehouse();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiration_date: '',
    warehouse: '',
    status: '',
  });
  const [date, setDate] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await productCreate(formData);
      if (response) {
        setFormData({
          name: '',
          quantity: '',
          expiration_date: '',
          warehouse: '',
          status: '',
        });
        setDate(undefined);
        toast.success('Produit créé avec succès');
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, 'Erreur lors de la création du produit'));
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (selectedDate) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    const formatted = formatDate(selectedDate);
    const expired = isPastDate(formatted);

    setFormData((prev) => {
      let newStatus = prev.status;
      if (expired) {
        newStatus = 'perime';
      } else if (prev.status === 'perime') {
        newStatus = '';
      }
      return {
        ...prev,
        expiration_date: formatted,
        status: newStatus,
      };
    });
  };

  const swipeDirection = isMobile ? 'down' : 'right';

  return (
    <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>
      <Toaster />
      <DrawerTrigger
        render={
          <Button variant="outline" className="gap-2">
            <Warehouse className="h-4 w-4" />
            <span>Ajouter un produit</span>
          </Button>
        }
      />
      <DrawerContent
        className="bg-card border-border rounded-t-xl"
      >
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Ajouter un produit
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Remplissez les informations suivantes pour créer un nouvel produit
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Nom du produit
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Ex : Riz"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quantity"
              className="text-sm font-medium text-foreground"
            >
              Quantité
            </label>
            <Input
              type="number"
              id="quantity"
              placeholder="Ex : 500"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="expiration_date"
              className="text-sm font-medium text-foreground"
            >
              Date d'expiration
            </label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    id="expiration_date"
                    className="justify-start font-normal"
                  >
                    {date ? formatDate(date) : 'Choisir une date'}
                  </Button>
                }
              />

              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="warehouse"
              className="text-sm font-medium text-foreground"
            >
              Entrepôt
            </label>
            <select
              id="warehouse"
              value={formData.warehouse}
              onChange={(e) =>
                setFormData({ ...formData, warehouse: e.target.value })
              }
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Choisir un entrepôt</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-sm font-medium text-foreground">Statut</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }));
              }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Sélectionner un statut</option>
              {PRODUCT_STATUS.map((status) => {
                const expired = isPastDate(formData.expiration_date);
                const isDisabled = expired
                  ? status.label !== 'perime'
                  : status.label === 'perime';
                return (
                  <option
                    value={status.label}
                    key={status.value}
                    disabled={isDisabled}
                  >
                    {status.label}
                  </option>
                );
              })}
            </select>
          </div>

          <Button
            type="submit"
            className="mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Créer l'entrepôt"
            )}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
