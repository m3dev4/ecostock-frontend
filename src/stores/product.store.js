import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  moveProduct,
  updateProduct,
} from '@/apis/products.api';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useProductStore = create(
  persist((set) => ({
    products: [],
    product: null,
    loading: false,
    error: null,

    //action

    fetchAllProducts: async () => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await getAllProducts();
        if (response.status) {
          set({
            products: response.data,
            loading: false,
            error: null,
          });
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to fetch products',
        });
      }
    },

    fetchProduct: async (id) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await getProduct(id);
        if (response.data) {
          set({
            product: response.data,
            loading: false,
            error: null,
          });
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to fetch product',
        });
        return false;
      }
    },

    productCreate: async (data) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await createProduct(data);
        if (response.data) {
          set((state) => ({
            products: [...state.products, response.data],
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set((state) => ({
          loading: false,
          error: error.response?.data?.detail || 'Failed to create product',
        }));
        return false;
      }
    },

    productUpdate: async (id, data) => {
      set({
        lodaing: true,
        error: null,
      });
      try {
        const response = await updateProduct(id, data);
        if (response.status) {
          set((state) => ({
            products: state.product.map((p) =>
              p.id === id ? response.data : p,
            ),
            loading: false,
            error: null,
          }));
        }
      } catch (error) {
        set({
          lodaing: false,
          error: error.response?.data?.detail || 'Failed to update product',
        });
        return false;
      }
    },

    productDelete: async (id) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const response = await deleteProduct(id);
        if (response.status) {
          set((state) => ({
            products: products.filter((p) => p.id !== id),
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to delete product',
        });
        return false;
      }
    },

    productMove: async (id, data) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const response = await moveProduct(id, data);
        if (response.status) {
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? response.data : p,
            ),
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to move product',
        });
        return false;
      }
    },
  })),
);
