import axiosInstance from "./axiosInstance";
const endpoint = "/file-manager";

export const getListFile = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-file`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const uploadFile = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const shareFileToOther = async (body) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/share-file`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const removeFile = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-file/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFileById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/files/${id}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const uploadAvatar = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/upload-avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAvatarAPI = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/update-avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAvatar = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-avatar`, { params: { userId: id } });
        return response.data;
    } catch (error) {
        throw error;
    }
}