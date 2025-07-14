import api from "./api";


export const getCategoryService = () => {
  return api.get('products/category');
};

export const getProducts = () =>{
    return api.get('products');
}
