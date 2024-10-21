import axiosInstance from "./axiosInstance";
const endpoint = "/pricebook";

export const getPriceBook = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-pricebook`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterPriceBook = async (param, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter${query ? `?${query}` : ''}`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const exportExcel = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/export-excel`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createPriceBook = async (priceBook) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-pricebook`, priceBook);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTotalPriceBook = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePriceBook = async (priceBook) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${priceBook?.id}`, priceBook);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchPriceBook = async (priceBook, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-pricebook/${id}`, priceBook);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deletePriceBook = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPriceBookById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProductsByPriceBook = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-products`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchProductsToAdd = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/search-products`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addProducts = async (body, param) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-product`, body, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProductFromPriceBook = async (param) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/product`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchProduct = async (body, priceBookId, productId) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-product/${priceBookId}/${productId}`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}