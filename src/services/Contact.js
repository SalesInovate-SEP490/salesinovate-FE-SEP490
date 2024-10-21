import axiosInstance from "./axiosInstance";
const endpoint = "/contact";

export const getContacts = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-contact`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterContacts = async (pageNo, pageSize, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/filter-contact?page=${pageNo}&size=${pageSize}${query ? `&${query}` : ''}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const exportExcel = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/export-excel`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTotalContact = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createContact = async (contact) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-contact`, contact);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContact = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-contact?id=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getContactById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/contact-detail`, { params: { id } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const convertFromLead = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-from-lead`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListContact = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-contact`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const convertFromExisting = async (data, contactId, accountId, leadId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/existing-from-lead/${leadId}/${contactId}/${accountId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const patchContact = async (contact, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-contact?id=${id}`, contact);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListContactByAccount = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-contact-by-account`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllContactByOpportunity = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-contact-by-opportunity`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchContactRole = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/search-contact-role`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const addUserToContact = async (data, contactId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-users/${contactId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListUserInContact = async (contactId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-user/${contactId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}