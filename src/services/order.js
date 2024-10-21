import axiosInstance from "./axiosInstance";
const enpoint = "/contract";

export const getListOrder = async (params) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list-order-contract`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListStatus = async () => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list-order-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOrderContractDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/order-contract-detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createOrderContract = async (data) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/create-order-contract-template`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteOrderContract = async (id) => {
    try {
        const response = await axiosInstance.delete(`${enpoint}/delete-order-contract/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListProductOrder = async (params) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list-order-contract-product`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOrderProductDetail = async (param) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-detail-order-contract-product`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListPriceBookOrder = async (params) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list-product-price-book`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListProducts = async (params) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list-product-add-order`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addPriceBookProduct = async ({ PriceBookId, orderId }) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/create-price-book-product?PriceBookId=${PriceBookId}&orderId=${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const findPriceBookIdByOrderId = async (orderId) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/processing-order-contract-detail/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addListProductToOrder = async (data) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/create-list-product-oder`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateOrderContract = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`${enpoint}/update-order-contract-template/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}