import axiosInstance from "./axiosInstance";
const endpoint = "/campaign";

export const getCampaign = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-campaign`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterCampaign = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCampaignStatus = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCampaignType = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/type`);
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

export const createCampaign = async (campaign) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-campaign`, campaign);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTotalCampaign = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateCampaign = async (campaign) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${campaign?.id}`, campaign);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteCampaign = async (params) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete`, { params: params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCampaignById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchCampaign = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


