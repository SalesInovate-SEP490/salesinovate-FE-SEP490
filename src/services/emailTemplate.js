import axiosInstance from "./axiosInstance";
const endpoint = "/email";

export const sendEmail = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/send-mail`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('File uploaded and email sent successfully', response.data);
    } catch (error) {
        throw error;
    }
}

export const sendEmailToList = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/send-mail-to-lead-ids`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('File uploaded and email sent successfully', response.data);
    } catch (error) {
        throw error;
    }
}

export const createEmailTemplate = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-email-template`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListEmail = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-email`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEmailTemplate = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateEmailTemplate = async (data) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/update-email-template`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteEmailTemplate = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListEmailParam = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-param-email`);
        return response.data;
    } catch (error) {
        throw error;
    }
}