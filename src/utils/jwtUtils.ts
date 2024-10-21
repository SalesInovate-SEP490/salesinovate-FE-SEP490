export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const setRefreshToken = (refreshToken: string): void => {
    localStorage.setItem('refreshToken', refreshToken);
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
}

export const removeToken = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
};

export const getRole = (): string[] => {
    const role = localStorage.getItem('role');
    return role ? JSON.parse(role) : ['administrator'];
}

export const setRole = (roles: any) => {
    localStorage.setItem('role', JSON.stringify(roles));
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiration = payload.exp * 1000; // Convert to milliseconds
        return Date.now() > expiration;
    } catch (e) {
        return true;
    }
};

