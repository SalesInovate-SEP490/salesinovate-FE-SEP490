import axiosInstance from "./axiosInstance";
const endpoint = "/quote";

// Function to create a quote opportunity
export const createQuoteOpportunity = async (id, data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/create-quote?opportunityId=${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get opportunity information for a quote by opportunityId
export const getOpportunityInfoQuoteDTO = async (opportunityId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${opportunityId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get the details of a quote opportunity by id
export const detailQuoteOpportunity = async (id) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get the list of products to add to a quote by quoteId
export const getListProductAddToQuote = async (quoteId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-product-add-quote`, {
            params: { quoteId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to add a price book product to a quote by PriceBookId and quoteId
export const addPriceBookProductToQuote = async (PriceBookId, quoteId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-price-book-quote-to-quote`, null, {
            params: { PriceBookId, quoteId }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to add a list of products to a quote
export const addListProductToOrder = async (data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-list-product-quote`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get the list of products from the price book
export const getListProductPriceBook = async () => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-list-product-price-book`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Function to get the list of quote opportunities with pagination
export const getListQuoteOpportunity = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-all`, {
            params: param
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListQuoteOpportunityByOpportunityId = async (params) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/get-all-opp`, { params });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getListQuoteStatus = async (param) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/quote-status`, {
            params: param
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getListQuoteProduct = async (quoteId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/related/${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getPriceBookQuote = async (quoteId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/processing-quote-price-book-detail/${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addListProductQuote = async (id, data) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-product/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addPriceBookToQuote = async (PriceBookId, quoteId) => {
    try {
        const response = await axiosInstance.post(`${endpoint}/add-price-book-quote-to-quote?PriceBookId=${PriceBookId}&quoteId=${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const generateQuotePdf = async (quoteId) => {
    try {
        const response = await axiosInstance.get(`${endpoint}/export-quote/${quoteId}`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteQuoteProduct = async (params) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-product`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateQuoteProduct = async (quoteProductId, data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/edit-product/${quoteProductId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateQuote = async (quoteId, data) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/patch-quote/${quoteId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const startSync = async (quoteId) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/start-sync/${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const stopSync = async (quoteId) => {
    try {
        const response = await axiosInstance.patch(`${endpoint}/stop-sync/${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteQuote = async (quoteId) => {
    try {
        const response = await axiosInstance.delete(`${endpoint}/delete-quote/${quoteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}