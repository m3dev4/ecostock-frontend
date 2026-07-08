/** @format */

import React from 'react';
import { useAuthStore } from './stores/auth.store';
import { Navigate, Outlet } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Warehouse } from 'lucide-react';
import { Package } from 'lucide-react';
import CardHead from './components/cardHead';

const App = () => {
  const { isAuthenticated, loading, refreshAccessToken } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh p-6">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-1 text-sm text-slate-500">
            Bienvenue sur votre tableau de bord.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white">
            <Warehouse className="h-4 w-4" />
            Ajouter un entrepôt
          </Button>

          <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
            <Package className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <CardHead title="Entrepôts" />
        <CardHead title="Produits" />
        <CardHead title="Plus grande capacité" />
        <CardHead title="Total de quantité" />
      </div>
    </div>
  );
};

export default App;
