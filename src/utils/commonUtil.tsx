export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const PHONE_REGEX = /^\d{10,11}$/;
export const NUMBER_REGEX = /^[0-9]*$/;

export const convertTextToDate = (text: any) => {
    if (!text) return '';
    const date = new Date(text);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

export const formatString = (template: string, ...replacements: any[]) => {
    return template.replace(/\{\d\}/g, (match) => {
        const index = parseInt(match.slice(1, -1), 10);
        return replacements[index] !== undefined ? replacements[index] : match;
    });
}

export const convertTextToDateTime = (text: string) => {
    if (!text) return '';
    const date = new Date(text);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export const convertDateToLocalDateTime = (date: any) => {
    const timeZone = new Date().getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timeZone);
    return date.toISOString().replace("Z", "");
}

export const getTimeCorrectTimeZone = (date: any) => {
    if (!date) return '';
    const timeZone = new Date().getTimezoneOffset();
    date?.setMinutes(date?.getMinutes() - timeZone);
    return date?.toISOString().replace("Z", "");
}

export const generateRandomKey = () => {
    return Math.random().toString(36).substring(7);
}

export const loadFromTextLeadFilter = (text: string) => {
    const filterText = text.split(',');
    let obj: any = {};
    let listCompare: any = {};
    filterText.map((item: any) => {
        if (item === '') return;
        const key = item.split('$$$')[0];
        const objectKey = key.split('_');
        if (objectKey.length > 1) {
            const object = objectKey[0];
            const key = objectKey[1];
            if (!obj[object]) {
                obj[object] = {};
            }
            const valueNumber = item.split('$$$')[2] ? (parseInt(item.split('$$$')[2]) ? parseInt(item.split('$$$')[2]) : item.split('$$$')[2]) : item.split('$$$')[2];
            obj[object][key] = valueNumber
            obj[key] = valueNumber
            listCompare[object] = item.split('$$$')[1];
        }
        const compare = item.split('$$$')[1];
        const value = item.split('$$$')[2];
        obj = {
            ...obj,
            [key]: value
        }
        listCompare = {
            ...listCompare,
            [key]: compare,
        }
    });
    // other filed will be "" or null
    const otherField = {
        firstName: "",
        lastName: "",
        middleName: "",
        salution: null,
        status: null,
        title: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: ""
    }
    const dataField = {
        ...otherField,
        ...obj
    }
    return getQueryFromDataFiledAndListCompare(dataField, listCompare);
}

export const getQueryFromDataFiledAndListCompare = (data: any, listCompare: any) => {
    const fieldMappings = [
        { key: 'firstName', query: 'firstName', compare: listCompare.firstName },
        { key: 'lastName', query: 'lastName', compare: listCompare.lastName },
        { key: 'middleName', query: 'middleName', compare: listCompare.middleName },
        { key: 'salution.label', query: 'salution_leadSalutionName', compare: listCompare.salution },
        { key: 'salution.leadSalutionName', query: 'salution_leadSalutionName', compare: listCompare.salution },
        { key: 'status.label', query: 'status_leadStatusName', compare: listCompare.status },
        { key: 'status.leadStatusName', query: 'status_leadStatusName', compare: listCompare.status },
        { key: 'title', query: 'title', compare: listCompare.title },
        { key: 'email', query: 'email', compare: listCompare.email },
        { key: 'phone', query: 'phone', compare: listCompare.phone },
        { key: 'company', query: 'company', compare: listCompare.company },
        { key: 'website', query: 'website', compare: listCompare.website },
        { key: 'street', query: 'address_street', compare: listCompare.street },
        { key: 'city', query: 'address_city', compare: listCompare.city },
        { key: 'province', query: 'address_province', compare: listCompare.province },
        { key: 'postalCode', query: 'address_postalCode', compare: listCompare.postalCode },
        { key: 'country', query: 'address_country', compare: listCompare.country },
        { key: 'fromDate', query: 'createDate', compare: ">" },
        { key: 'toDate', query: 'createDate', compare: "<" },
    ];

    data.fromDate = data.fromDate ? new Date(data.fromDate).toISOString()?.replace("Z", "") : null;
    data.toDate = data.toDate ? new Date(data.toDate).toISOString()?.replace("Z", "") : null;
    let searchQuery = fieldMappings
        .map(({ key, query, compare }) => {
            const keys = key.split('.');
            let value = data;
            for (let k of keys) {
                value = value?.[k];
                if (!value) break;
            }
            return value ? `&search=${query}${compare} ${value}` : '';
        })
        .filter(Boolean)
        .join('');
    return searchQuery ? searchQuery.substring(1) : '';
}

export const loadFromTextAccountFilter = (text: string) => {
    const filterText = text.split(',');
    let obj: any = {};
    let listCompare: any = {};
    filterText.map((item: any) => {
        if (item === '') return;
        const key = item.split('$$$')[0];
        const objectKey = key.split('_');
        if (objectKey.length > 1) {
            const object = objectKey[0];
            const key = objectKey[1];
            if (!obj[object]) {
                obj[object] = {};
            }
            const valueNumber = item.split('$$$')[2] ? (parseInt(item.split('$$$')[2]) ? parseInt(item.split('$$$')[2]) : item.split('$$$')[2]) : item.split('$$$')[2];
            obj[object][key] = valueNumber
            obj[key] = valueNumber
            listCompare[object] = item.split('$$$')[1];
        }
        const compare = item.split('$$$')[1];
        const value = item.split('$$$')[2];
        obj = {
            ...obj,
            [key]: value
        }
        listCompare = {
            ...listCompare,
            [key]: compare,
        }
    });
    // other filed will be "" or null
    const otherField = {
        industry: null,
        accountType: null,
        phone: "",
        accountName: "",
        website: "",
        shippingStreet: "",
        shippingCity: "",
        shippingProvince: "",
        shippingPostalCode: "",
        shippingCountry: "",
        billingStreet: "",
        billingCity: "",
        billingProvince: "",
        billingPostalCode: "",
        billingCountry: ""
    }
    const dataField = {
        ...otherField,
        ...obj
    }
    return getQueryFromDataFiledAndListCompareAccount(dataField, listCompare);
}

export const getQueryFromDataFiledAndListCompareAccount = (data: any, listCompare: any) => {
    const fieldMappings = [
        { key: 'accountName', query: 'accountName', compare: listCompare.accountName },
        { key: 'industry.label', query: 'industry_industryStatusName', compare: listCompare.industry },
        { key: 'accountType.label', query: 'rating_accountTypeName', compare: listCompare.accountType },
        { key: 'phone', query: 'phone', compare: listCompare.phone },
        { key: 'website', query: 'website', compare: listCompare.website },
        { key: 'shippingStreet', query: 'shipping_street', compare: listCompare.shippingStreet },
        { key: 'shippingCity', query: 'shipping_city', compare: listCompare.shippingCity },
        { key: 'shippingProvince', query: 'shipping_province', compare: listCompare.shippingProvince },
        { key: 'shippingPostalCode', query: 'shipping_postal_code', compare: listCompare.shippingPostalCode },
        { key: 'shippingCountry', query: 'shipping_country', compare: listCompare.shippingCountry },
        { key: 'billingStreet', query: 'billing_street', compare: listCompare.billingStreet },
        { key: 'billingCity', query: 'billing_city', compare: listCompare.billingCity },
        { key: 'billingProvince', query: 'billing_province', compare: listCompare.billingProvince },
        { key: 'billingPostalCode', query: 'billing_postal_code', compare: listCompare.billingPostalCode },
        { key: 'billingCountry', query: 'billing_country', compare: listCompare.billingCountry },
        { key: 'fromDate', query: 'createDate', compare: ">" },
        { key: 'toDate', query: 'createDate', compare: "<" },
    ];

    data.fromDate = data.fromDate ? new Date(data.fromDate).toISOString()?.replace("Z", "") : null;
    data.toDate = data.toDate ? new Date(data.toDate).toISOString()?.replace("Z", "") : null;
    let searchQuery = fieldMappings
        .map(({ key, query, compare }) => {
            const keys = key.split('.');
            let value = data;
            for (let k of keys) {
                value = value?.[k];
                if (!value) break;
            }
            return value ? `&search=${query}${compare} ${value}` : '';
        })
        .filter(Boolean)
        .join('');
    return searchQuery ? searchQuery.substring(1) : '';
}