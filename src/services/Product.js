import axiosInstance from "./axiosInstance";
const endpoint = "/product";

export const getProduct = async (params) => {
    try{
        const response = await axiosInstance.get(`${endpoint}/list-product`, params) ;
        return response.data;
    } catch (error){
        throw error;
    }
}

export const exportExcel = async () => {
    try{
        const response = await axiosInstance.get(`${endpoint}/export-excel`, {responseType: 'blob'});
        return response.data;
    }catch(error){
        throw error;
    }
}

export const createProduct = async (product) => {
    try{
        const response = await axiosInstance.post(`${endpoint}/create-product`, product);
        return response.data;
    } catch(error){
        throw error;
    }
}

export const getTotalProduct = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const patchProduct = async (product, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-product/${id}`, product);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (id) => {
    try{
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    }catch(error){
        throw error;
    }
}

export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch(error){
        throw error;
    }
}

export const getPriceBookByProduct = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-pricebooks`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterProduct = async (param, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter${query ? `?${query}` : ''}`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListProductFamily = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-productfamily`);
        return response.data;
    } catch(error){
        throw error;
    }
}

export const DeleteProductFamily = async (id) => {
    try{
        const response = await axiosInstance.delete(`${endpoint}/product-family/${id}`);
        return response.data;
    }catch(error){
        throw error;
    }
}

export const createProductFamily = async (product) => {
    try{
        const response = await axiosInstance.post(`${endpoint}/product-family`, product);
        return response.data;
    } catch(error){
        throw error;
    }
}


