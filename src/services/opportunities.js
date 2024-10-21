import axiosInstance from "./axiosInstance";
const endpoint = "/opportunity";

export const getOpportunity = async (param, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/opportunity-filter${query ? `?${query}` : ''}`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTotalRecord = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        response.code = 1;
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOpportunityDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createOpportunity = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-opportunity`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateOpportunity = async (data) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/update-opportunity`, data);
        console.log("Data: ", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteOpportunity = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListStage = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-stage`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListForecast = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-forecast-category`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchOpportunity = async (data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-opportunity/${data.id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const convertNewFromLead = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/convert-new-from-lead`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getByAccountId = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-opportunity-by-account`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const convertOpportunityFromExisting = async (contactId, opportunityId, leadId, data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/convert-exist-from-lead/${leadId}/${contactId}/${opportunityId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListType = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-type`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListSource = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-leadsource`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListOpportunityByAccount = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-opportunity-by-account`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getOpportunityByContact = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-opportunity-by-contact`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchPriceBookToAdd = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/search-pricebook`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addPriceBook = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-pricebook`, null, { params: data });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const searchProductToAdd = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/search-product`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addProductToOpportunity = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-product`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getProductList = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-product`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchProdcut = async (data, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-product/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchListProduct = async (data, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/${id}/patch-product`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (opportunityId, productId) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${opportunityId}/delete-product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const countProduct = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/count-product`, { params: params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListContactRole = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/contact-role`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updatePrimaryContact = async (data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/contact-role/primary`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addContactRole = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/contact-role`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchListContact = async (data, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/contact-role`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCampaignInfluence = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/campaign-influence`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListRoles = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-role`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteContactRole = async (params) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/contact-role`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addUserToOpportunity = async (data, opportunityId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-users/${opportunityId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListUserInOpportunity = async (opportunityId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-user/${opportunityId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchCampaignInfluence = async (data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/campaign-influence`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}