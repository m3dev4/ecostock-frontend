import { CreateProduct } from '@/components/createProduct';
import { Toaster } from '@/components/ui/sonner';
import { useProductStore } from '@/stores/product.store';
import { useWarehouse } from '@/stores/warehouse.store';
import { Eye, Trash2, Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Product = () => {
  const { products, fetchAllProducts, productDelete } = useProductStore();
  const { fetchAllWarehouses } = useWarehouse();

  useEffect(() => {
    fetchAllProducts();
    fetchAllWarehouses();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      const response = await productDelete(id);
      if (response) {
        toast.success('Produit supprimé');
        await fetchAllProducts();
      }
    } catch (error) {
      console.log(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      disponible: 'bg-emerald-50 text-emerald-700',
      reserve: 'bg-amber-50 text-amber-700',
      perime: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez tous vos produits.
          </p>
        </div>

        <CreateProduct />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Quantité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date d'expiration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Entrepôt</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-card">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 text-sm font-medium text-foreground">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {product.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {product.expiration_date}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {product.warehouse_name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadge(
                      product.status,
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/product/${product.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      type="button"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => handleDeleteProduct(product.id)}
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
