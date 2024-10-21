import axiosInstance from "./axiosInstance";
const enpoint = "/event";

export const createEvent = async (body) => {
    try {
        const response = await axiosInstance.post(`${enpoint}/create`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEventInCalendar = async (params) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-list`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getDetailEvent = async (id) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteEventById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${enpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchEvent = async (id, body) => {
    try {
        const response = await axiosInstance.patch(`${enpoint}/${id}`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListSubject = async () => {
    try {
        const response = await axiosInstance.get(`${enpoint}/subject`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListEventPriority = async () => {
    try {
        const response = await axiosInstance.get(`${enpoint}/priority`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEventInLead = async (id) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-in-lead?leadId=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEventInContact = async (id) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-in-contact?contactId=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getEventInAccount = async (id) => {
    try {
        const response = await axiosInstance.get(`${enpoint}/get-in-account?accountId=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}