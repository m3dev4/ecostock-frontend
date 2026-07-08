import instance from '@/utils/axios';

export const getAllProducts = async () => {
  return instance.get('products/');
};

export const getProduct = async (id) => {
  return instance.get(`products/${id}/`);
};

export const createProduct = async (productData) => {
  return instance.post('products/', productData);
};

export const updateProduct = async (id, productData) => {
  return instance.patch(`product/${id}/`, productData);
};

export const deleteProduct = async (id) => {
  return instance.delete(`product/${id}/`);
};

export const moveProduct = async (id, data) => {
  return instance.post(`product/${id}/move/`, data)
}