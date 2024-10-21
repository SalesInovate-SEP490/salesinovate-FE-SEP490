import axiosInstance from "./axiosInstance";
const endpoint = "/log-email";

export const createLogEmail = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogEmailInLead = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-lead/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogEmailInContact = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogEmailInAccount = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-account/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterLogEmailInOpportunity = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-opportunity/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDetailLogEmail = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListStatus = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteLogEmail = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}