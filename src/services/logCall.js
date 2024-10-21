import axiosInstance from "./axiosInstance";
const endpoint = "/log-call";

export const createLogCall = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogCallInLead = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-lead/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogCallInContact = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogCallInAccount = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-account/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogCallInOpportunity = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-opportunity/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDetailLogCall = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListStatusLogCall = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteLogCall = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchLogCall = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
