import axiosInstance from "./axiosInstance";
const endpoint = "/config-lead";

export const getAllConfigLead = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/all`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createConfigLead = async (configLead) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create`, configLead);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchConfigLead = async (configLead) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/update`, configLead);
        return response.data;
    } catch (error) {
        throw error;
    }
}