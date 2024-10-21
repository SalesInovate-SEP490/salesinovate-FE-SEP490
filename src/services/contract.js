import axiosInstance from "./axiosInstance";
const endpoint = "/contract";

export const getListContract = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-contract`, params);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListOrderStatus = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-order-status`);
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

export const getTotalContact = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createContract = async (contract) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-contract-template`, contract);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContract = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOrderContractDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/order-contract-detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getContractById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateContract = async (contract, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/update-contract-template/${id}`, contract);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListContractStatus = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-contract-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListOrderContractBy = async (contractNumber) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-order-contract-by/${contractNumber}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFilesContract = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-contract-file/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const uploadContractFile = async (file, id) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ContractId', id);
        const response = await axiosInstance.post(`${endpoint}/upload-contract-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContractFile = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-file/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const downloadFile = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/down-contract-files/${id}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}