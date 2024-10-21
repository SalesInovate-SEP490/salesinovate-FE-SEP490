import axiosInstance from "./axiosInstance";
import axiosLogin from './axiosInstance_authen'
const endpoint = "/user";

export const getUsers = async (params) => {
    const param = {
        page: 0,
        size: 1000,
    }
    try {
        const response = await axiosInstance.get(`${endpoint}/user-filter`, { params: param });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const filterUser = async (query, params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/user-filter${query ? `?${query}` : ''}`, { params: params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyProfileForUser = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/profile-user`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const patchUser = async (user) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-user`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const adminFilter = async (query, params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/admin-filter${query ? `?${query}` : ''}`, { params: params });
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

export const getTotalUser = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAllUserByRole = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/role`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createUser = async (user) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/user`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (user) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-user`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addRoleToUser = async (user, id, roleName) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/users/${id}/roles/${roleName}`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/detail-user`, { params: { userId: id } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const loginSystem = async (data) => {
    try {
        const response = await axiosLogin.post('/master/protocol/openid-connect/token', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

export const logOut = async (data) => {
    try {
        const response = await axiosLogin.post('/master/protocol/openid-connect/logout', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
}

export const getUserRole = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-roles`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const addRoleToUserByAdmin = async (id, body) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-role/${id}`, body);
        return response.data;
    } catch (error) {
        throw error;
    }
}