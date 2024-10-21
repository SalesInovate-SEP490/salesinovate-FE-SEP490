import axiosInstance from "./axiosInstance";
const endpoint = "/task";

export const getTask = async (pageNo, pageSize) => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
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

export const getTotalTask = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createTask = async (task) => {
    try {
        const response = await axiosInstance.post(`${endpoint}`, task);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateTask = async (task) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${task?.id}`, task);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteTask= async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTaskById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}