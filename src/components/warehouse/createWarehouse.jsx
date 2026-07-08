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
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';

export function DrawerNested() {
  const isMobile = useIsMobile();
  const { warehouseCreate, loading } = useWarehouse();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await warehouseCreate(formData);
      if (response.status) {
        setFormData({ name: '', location: '', capacity: '' });
        toast.success('Magasin créé avec succès');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const swipeDirection = isMobile ? 'down' : 'right';

  return (
    <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>
        <Toaster />
      <DrawerTrigger
        render={
          <Button className="gap-2 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20">
            <Warehouse className="h-4 w-4 text-white" />
            <span className="text-white">Ajouter un entrepôt</span>
          </Button>
        }
      />
      <DrawerContent
        className="
      bg-slate-900/40
        backdrop-blur-xl backdrop-saturate-150
        border border-white/20
        shadow-2xl shadow-black/10
        rounded-t-2xl
    "
      >
        <DrawerHeader className="border-b border-white/10 pb-4">
          <DrawerTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Ajouter un entrepôt
          </DrawerTitle>
          <DrawerDescription className="text-slate-300 font-semibold">
            Remplissez les informations suivantes pour créer un nouvel entrepôt
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Nom de l'entrepôt
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Ex : Entrepôt Dakar Nord"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-white backdrop-blur-sm border-white/30 focus-visible:ring-slate-900/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Emplacement
            </label>
            <Input
              type="text"
              id="location"
              placeholder="Ex : Zone industrielle, Dakar"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="bg-white  backdrop-blur-sm border-white/30 focus-visible:ring-slate-900/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="capacity"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Capacité (m³ / unités)
            </label>
            <Input
              type="number"
              id="capacity"
              placeholder="Ex : 500 unités"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="bg-white  backdrop-blur-sm border-white/30 focus-visible:ring-slate-900/30"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Créer l\'entrepôt'}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
