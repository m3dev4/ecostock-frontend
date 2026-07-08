import instance from '@/utils/axios';

export const warehouses = async () => {
  return instance.get('warehouses/');
};

export const warehouse = async (id) => {
  return instance.get(`warehouses/${id}/`);
};

export const createWarehouse = async (data) => {
  return instance.post('warehouses/', data);
};

export const updateWarehouse = async (data, id) => {
  return instance.patch(`warehouses/${id}/`, data);
};

export const deleteWarehouse = async (id) => {
  return instance.delete(`warehouses/${id}/`);
};

export const auditWarehouse = async (id) => {
  return instance.get(`warehouses/${id}/audit/`);
};
