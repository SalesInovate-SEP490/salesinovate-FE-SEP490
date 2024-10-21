import axiosInstance from "./axiosInstance";
const endpoint = "/notification";

export const getListNotification = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDetailNotification = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAsRead = async (id) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/mark-read?notificationId=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async () => {
    try {
        const response = await axiosInstance.post(`${endpoint}/mark-all-read`);
        return response.data;
    } catch (error) {
        throw error;
    }
}