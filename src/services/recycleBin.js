import axiosInstance from "./axiosInstance";
const endpoint = "/recycle-bin";

export const getListLeadDelete = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-delete-leads-list`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListAccountDelete = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-delete-account-list`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListContactDelete = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-delete-contact-list`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListOpportunityDelete = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-delete-opportunity-list`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListEmailTemplateDelete = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-delete-emailTemplate-list`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreLeadById = async (id) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-lead/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreAccountById = async (id) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-account/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreContactById = async (id) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreOpportunityById = async (id) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-opportunity/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreEmailTemplateById = async (id) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-emailtemplate/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreListLead = async (body) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-list-lead`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreListAccount = async (body) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-list-account`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreListContact = async (body) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-list-contact`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreListOpportunity = async (body) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-list-opportunity`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const restoreListEmailTemplate = async (body) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/restore-list-emailtemplate`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteLeadById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-leads/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteAccountById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-account/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContactById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteOpportunityById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-opportunity/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteEmailTemplateById = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-emailTemplate/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteListLead = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-list-lead`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteListAccount = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-list-account`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteListContact = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-list-contact`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteListOpportunity = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-list-opportunity`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteListEmailTemplate = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-list-emailtemplate`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}