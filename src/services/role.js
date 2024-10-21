import axiosInstance from "./axiosInstance";
const endpoint = "/roles";

export const getRoles = async (pageNo, pageSize) => {
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

export const getTotalRole = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createRole = async (role) => {
    try {
        const response = await axiosInstance.post(`${endpoint}`, role);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateRole = async (role) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${role?.id}`, role);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteRole = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRoleById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}