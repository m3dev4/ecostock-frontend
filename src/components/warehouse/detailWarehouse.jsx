import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWarehouse } from '@/stores/warehouse.store';

const DetailWarehouse = () => {
  const { id } = useParams();

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
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!warehouse) {
    return <div>Entrepôt introuvable.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">{warehouse.name}</h1>

        <div className="space-y-2">
          <p>
            <strong>ID :</strong> {warehouse.id}
          </p>

          {warehouse.location && (
            <p>
              <strong>Adresse :</strong> {warehouse.location}
            </p>
          )}

          {warehouse.capacity && (
            <p>
              <strong>Capacité :</strong> {warehouse.capacity}
            </p>
          )}
        </div>

        <button
          onClick={handleAudit}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Lancer un audit
        </button>

        {audit && (
          <div className="mt-6 rounded border bg-gray-50 p-4">
            <h2 className="text-lg font-semibold mb-2">Résultat de l'audit</h2>

            <p>
              <strong>Entrepôt :</strong> {audit.warehouse}
            </p>

            <p>
              <strong>Nombre total de produits :</strong> {audit.total_products}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailWarehouse;
