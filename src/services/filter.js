import axiosInstance from "./axiosInstance";
const enpoint = "/filter";

export const saveFilters = async ({ filterName, search, type }) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/save-filter?filterName=${filterName}&search=${search}&type=${type}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListFilter = async (filterType) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/filter-list?filterType=${filterType}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const assignFilter = async (data, id) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/assign/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteFilter = async (id) => {
    try {
        const response = await axiosInstance.delete(`${enpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}