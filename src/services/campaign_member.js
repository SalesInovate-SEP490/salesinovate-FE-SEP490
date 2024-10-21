import axiosInstance from "./axiosInstance";
const endpoint = "/campaign_members";

export const getListCampainMemberStatus = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/member-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addLeadToCampaign = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-lead`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addContactToCampaign = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-contact`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const viewLeadMember = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/view-leads`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const viewContactMember = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/view-contacts`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteLeadMember = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-lead`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchLeadMember = async (body) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-lead`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContactMember = async (body) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-contact`, { data: body });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchContactMember = async (body) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-contact`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getInfluenceOpportunity = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/influenced-opportunities`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createMemberStatus = async (status) => {
    try {
        // param instead of body, it should be member-status?staus=xxx
        const response = await axiosInstance.post(`${endpoint}/member-status?status=${status}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchMemberStatus = async (status, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/member-status?status=${status}&id=${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteMemberStatus = async (params) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/member-status`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListCampaignsByLead = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/by-leads`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListCampaignsByContact = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/by-contact`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}