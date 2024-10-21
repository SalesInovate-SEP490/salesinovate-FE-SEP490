import axiosInstance from "./axiosInstance";
const leadEnpoint = "/leads";

export const getLeads = async (pageNo, pageSize, query) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/filterSearch?page=${pageNo}&size=${pageSize}${query ? `&${query}` : ''}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListLeads = async (params) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/filterSearch?page=${params.currentPage}&size=${params.pageSize}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getLeadDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateLead = async (lead) => {
    try {
        const response = await axiosInstance.patch(`${leadEnpoint}/patch-leads/${lead.leadId}`, lead);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createLead = async (lead) => {
    try {
        const response = await axiosInstance.post(`${leadEnpoint}/create-leads`, lead);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const removeLead = async (id) => {
    try {
        const response = await axiosInstance.delete(`${leadEnpoint}/delete-leads/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const exportExcel = async () => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/export-file`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListStatus = async () => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/status-list`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSourceList = async () => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/source-list`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getIndustryList = async () => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/industry-list`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSalutationList = async () => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/salution-list`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchLead = async (lead, id) => {
    try {
        const response = await axiosInstance.patch(`${leadEnpoint}/patch-leads/${id}`, lead);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const importLead = async (formData) => {
    try {
        const response = await axiosInstance.post(`${leadEnpoint}/upload-leads-data`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addUserToLead = async (data, leadId) => {
    try {
        const response = await axiosInstance.post(`${leadEnpoint}/add-users/${leadId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addUsersToLeads = async (data) => {
    try {
        const response = await axiosInstance.post(`${leadEnpoint}/add-users-to-leads`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListUserInLead = async (leadId) => {
    try {
        const response = await axiosInstance.get(`${leadEnpoint}/get-user/${leadId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}