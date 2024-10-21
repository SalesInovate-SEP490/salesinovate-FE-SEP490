import axiosInstance from "./axiosInstance";
const leadEnpoint = "/report";

export const generateReport = async (userId) => {
    try {
        const response = await axiosInstance.post(`${leadEnpoint}/create-report-file/upload?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const downloadFileJson = async (id) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/get-string-file/${id}`,);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const downloadFileFromDrive = async (id) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/${id}`,);
        return response.data;
    } catch (error) {
        throw error;
    }
}