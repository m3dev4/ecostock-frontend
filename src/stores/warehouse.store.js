import {
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
  warehouse,
  warehouses,
} from '@/apis/warehouse.api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWarehouse = create(
  persist((set) => ({
    warehouses: [],
    warehouse: null,
    loading: false,
    error: null,

    //Actions
    fetchAllWarehouses: async () => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await warehouses();
        if (response.status) {
          set({
            warehouses: response.data,
            loading: false,
            error: null,
          });
          return response;
        }
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to fetch warehouses',
        });
        return false;
      }
    },

    fetchWarehouse: async (id) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await warehouse(id);
        if (response.status) {
          set({
            warehouse: response.data,
            loading: false,
            error: null,
          });
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to fetch warehouse',
        });
        return false;
      }
    },

    warehouseCreate: async (data) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await createWarehouse(data);
        if (response.status) {
          set({
            warehouses: [...this.warehouses, response.data],
            loading: false,
            error: null,
          });
        }
        return response;
      } catch (error) {
        set((state) => ({
          loading: false,
          error: error.response?.data?.detail || 'Failed to create warehouse',
        }));
        return false;
      }
    },

    warehouseUpdate: async (id, data) => {
      set({
        loading: true,
        error: null,
      });

      try {
        const response = await updateWarehouse(id, data);
        if (response.data) {
          set((state) => ({
            warehouses: state.warehouses.map((w) =>
              w.id === id ? response.data : w,
            ),
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set((state) => ({
          loading: false,
          error: error.response?.data?.detail || 'Failed to update warehouse',
        }));
        return false;
      }
    },

    warehouseDelete: async (id) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await deleteWarehouse(id);
        if (response.status) {
          set((state) => ({
            warehouses: state.warehouses.filter((w) => w.id !== id),
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.detail || 'Failed to delete warehouse',
        });
        return false;
      }
    },

    warehouseAudit: async (id) => {
      set({
        loading: true,
        error: null,
      });
      try {
        const response = await warehouseAudit(id);
        if (response.status) {
          set((state) => ({
            warehouses: state.warehouses.map((w) =>
              w.id === id ? response.data : w,
            ),
            loading: false,
            error: null,
          }));
        }
        return response;
      } catch (error) {
        set((state) => ({
          loading: false,
          error: error.response?.data?.detail || 'Failed to audit warehouse',
        }));
        return false;
      }
    },
  })),
);
