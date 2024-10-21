import axiosInstance from "./axiosInstance";
const endpoint = "/account";

export const getAccounts = async (pageNo, pageSize) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-account?currentPage=${pageNo}&perPage=${pageSize}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTotalAccounts = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListType = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/list-account-type`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListIndustries = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-industry`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createAccount = async (account) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-account`, account);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAccount = async (account) => {
    try {
        const response = await axiosInstance.put(`${endpoint}/update-account`, account);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchAccount = async (account, id) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-account/${id}`, account);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteAccount = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAccountById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const convertNewLead = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/convert-new`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterAccountForManager = async (param, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/account-filter-manager${query ? `?${query}` : ''}`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterAccount = async (filter) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/account-filter`, { params: filter });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterAccounts = async (param, query) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/account-filter${query ? `?${query}` : ''}`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const importAccount = async (formData) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/upload-account-data`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const exportAccount = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/export-file`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addUserToAccounts = async (data, accountId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-users/${accountId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListUserInAccounts = async (accountId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-user/${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const assignUserToAccount = async (body) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/assign-users-manager`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}