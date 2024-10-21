import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { getIndustryList } from "../../../services/lead";
import { useTranslation } from "react-i18next";
import { getAccounts, getListType } from "../../../services/account";
import { COMPARE, COMPARE_STRING } from "../../../core/data/json/compare";
import { deleteFilter, getListFilter, saveFilters } from "../../../services/filter";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';

const type = 2;
export const Filter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any, newFilter?: any
}> = ({ show, setShow, search, setQuery, newFilter }) => {
    const [data, setData] = useState<any>({});
    const [listSelect, setListSelect] = useState<{
        type?: { value: number; label: string }[];
        industry?: { value: number; label: string }[];
        accounts?: { value: number; label: string }[];
    }>({
        type: [],
        industry: [],
        accounts: [],
    });
    const [listCompare, setListCompare] = useState<any>({
        industry: '@',
        accountType: '@',
        phone: '@',
        accountName: '@',
        website: '@',
        shippingStreet: '@',
        shippingCity: '@',
        shippingProvince: '@',
        shippingPostalCode: '@',
        shippingCountry: '@',
        billingStreet: '@',
        billingCity: '@',
        billingProvince: '@',
        billingPostalCode: '@',
        billingCountry: '@',
        fromDate: '>',
        toDate: '<'
    });
    const { t } = useTranslation();
    const [filterData, setFilterData] = useState<any>(null);
    const [filter, setFilter] = useState<any>(null);
    const [listFilterOption, setListFilterOption] = useState<any>([]);

    useEffect(() => {
        if (newFilter) {
            setFilter(newFilter);
        }
    }, [newFilter])

    useEffect(() => {
        getIndustryList()
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        industry: response.data.map((item: any) => {
                            return {
                                value: item.industryId,
                                label: item.industryStatusName
                            }
                        })
                    }));
                }
            })
            .catch(err => {

            })
        getAccounts(1, 100)
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        accounts: response.data.items.map((item: any) => ({
                            value: item.accountId,
                            label: item.accountName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });
        getListType()
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        type: response.data.map((item: any) => ({
                            value: item.accountTypeId,
                            label: item.accountTypeName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });
        getFilterData();
    }, [])

    const customStyles: StylesConfig = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#E41F07" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#E41F07",
            },
        }),
    };

    const handleChange = (e: any, name?: any, nameChild?: any, isNumber?: any) => {
        // if isNumber true=> this field only number only
        /* 
            Write for me the to handle isNumber event
        */
        if (e?.target) {
            const { name, value } = e.target;
            let updatedValue = value;
            if (isNumber) {
                updatedValue = value.replace(/[^0-9]/g, '');
            }
            setData({
                ...data,
                [name]: updatedValue
            });
        } else {
            if (nameChild) {
                setData({
                    ...data,
                    [name]: {
                        [nameChild]: e?.value,
                        label: e?.label
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setData({
                    ...data,
                    [name]: e?.value
                });
            }
        }
    };

    const handChangeCompare = (e: any, name: any) => {
        setListCompare((prevState: any) => ({
            ...prevState,
            [name]: e.value
        }));
    }

    const togglePopup = () => {
        setShow(!show);
    };

    const clearFilter = () => {
        setData({
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
        });
        setListCompare({
            industry: '@',
            accountType: '@',
            phone: '@',
            accountName: '@',
            website: '@',
            shippingStreet: '@',
            shippingCity: '@',
            shippingProvince: '@',
            shippingPostalCode: '@',
            shippingCountry: '@',
            billingStreet: '@',
            billingCity: '@',
            billingProvince: '@',
            billingPostalCode: '@',
            billingCountry: '@'
        });
        setQuery(null);
    }

    const handleSearch = () => {
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
        setQuery(searchQuery);
        search(searchQuery);
    }

    const handleSearch2 = (data: any) => {
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
                return value ? `&search=${query}${compare}${value}` : '';
            })
            .filter(Boolean)
            .join('');
        setQuery(searchQuery);
        search(searchQuery);
    }

    const getFilterData = () => {
        getListFilter(type)
            .then((res) => {
                if (res.code === 1) {
                    setFilterData(res.data);
                    setListFilterOption(res.data.map((item: any) => {
                        return {
                            value: item.filterStoreId,
                            label: item.filterName
                        }
                    }));
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getQuery = () => {
        const fieldMappings = [
            { key: 'accountName', query: 'accountName', compare: listCompare.accountName },
            { key: 'industry.industryId', query: 'industry_industryId', compare: listCompare.industry },
            { key: 'accountType.accountTypeId', query: 'accountType_accountTypeId', compare: listCompare.accountType },
            { key: 'industry.label', query: 'industry_label', compare: listCompare.industry },
            { key: 'accountType.label', query: 'accountType_label', compare: listCompare.accountType },
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
            { key: 'fromDate', query: 'fromDate', compare: listCompare.fromDate },
            { key: 'toDate', query: 'toDate', compare: listCompare.toDate },
        ];
        let searchQuery = fieldMappings
            .map(({ key, query, compare }) => {
                const keys = key.split('.');
                let value = data;
                for (let k of keys) {
                    value = value?.[k];
                    if (!value) break;
                }
                return value ? `${query}$$$${compare}$$$${value},` : '';
            })
            .filter(Boolean)
            .join('');
        console.log("Search Query: ", searchQuery);
        return searchQuery;
    }

    const saveFilter = () => {
        Swal.fire({
            title: t("FILTER.FILTER_NAME"),
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: t("ACTION.SAVE"),
            showLoaderOnConfirm: true,
            preConfirm: async (name) => {
                const body = {
                    filterName: name,
                    search: getQuery(),
                    type
                }
                try {
                    const response = await saveFilters(body)
                    return response;
                } catch (err) {
                    Swal.showValidationMessage(
                        `Request failed: ${err}`
                    );
                }


            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                const response = result.value;
                if (response.code === 1) {
                    getFilterData();
                    toast.success("Save filter success");
                } else {
                    toast.error(response.message);
                }
            }
        });
    }

    const removeFilter = () => {
        if (!filter) {
            toast.error("Please select filter to delete");
        } else
            deleteFilter(filter?.value)
                .then((res) => {
                    if (res.code === 1) {
                        getFilterData();
                        clearFilter();
                        setFilter(null);
                        toast.success("Delete filter success");
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
    }

    useEffect(() => {
        if (filter) {
            const myFilter: any = filterData?.find((item: any) => item?.filterStoreId === filter?.value);
            if (myFilter) {
                const filterText = myFilter.filterSearch.split(',');
                let obj: any = {};
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
                    }
                    const compare = item.split('$$$')[1];
                    const value = item.split('$$$')[2];
                    obj = {
                        ...obj,
                        [key]: value
                    }
                    setListCompare((prevState: any) => ({
                        ...prevState,
                        [key]: compare
                    }));
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
                setData(dataField);
                handleSearch2(dataField);
            }
        } else {
            clearFilter();
        }
    }, [filter]);


    return (
        <>
            {/* Filter */}
            <div className={`toggle-popup ${show ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.ACCOUNTS.SEARCH_ACCOUNT")}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => togglePopup()}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form >
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("FILTER.FILTER_SAVED")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <Select
                                                    className="select"
                                                    options={listFilterOption}
                                                    value={filter ? listFilterOption.find((item: any) => item?.value === filter?.value) : null}
                                                    styles={customStyles}
                                                    placeholder={t("FILTER.SELECT_FILTER")}
                                                    onChange={(e) => { setFilter(e); }}
                                                    isClearable={true}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Link to="#" onClick={() => removeFilter()} className="btn btn-primary">
                                                    {t("ACTION.DELETE_FILTER")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label className="col-form-label">
                                                {t("COMMON.FROM_DATE")}
                                            </label>
                                            <div className="col-md-12">
                                                <DatePicker
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    selected={data?.fromDate}
                                                    onChange={(date: any) => handleChange({ target: { name: 'fromDate', value: date } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="col-form-label">
                                                {t("COMMON.TO_DATE")}
                                            </label>
                                            <div className="col-md-12">
                                                <DatePicker
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    selected={data?.toDate}
                                                    onChange={(date: any) => handleChange({ target: { name: 'toDate', value: date } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.INDUSTRY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="industry"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.industry)}
                                                    onChange={e => handChangeCompare(e, 'industry')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={listSelect.industry}
                                                    styles={customStyles}
                                                    value={data?.industry ? listSelect.industry?.find((item: any) => item.value === data?.industry?.industryId) : null}
                                                    name="industry"
                                                    onChange={e => handleChange(e, 'industry', 'industryId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.TYPE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="accountType"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.accountType)}
                                                    onChange={e => handChangeCompare(e, 'accountType')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={listSelect.type}
                                                    styles={customStyles}
                                                    value={data?.accountType ? listSelect.type?.find((item: any) => item.value === data?.accountType?.accountTypeId) : null}
                                                    name="accountType"
                                                    onChange={e => handleChange(e, 'accountType', 'accountTypeId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.ACCOUNT_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="accountName"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.accountName)}
                                                    onChange={e => handChangeCompare(e, 'accountName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="accountName"
                                                    onChange={(e) => handleChange(e)} value={data?.accountName} />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.PHONE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="phone"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.phone)}
                                                    onChange={e => handChangeCompare(e, 'phone')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="phone"
                                                    onChange={(e) => handleChange(e, undefined, undefined, true)} value={data?.phone} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.WEBSITE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="website"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.website)}
                                                    onChange={e => handChangeCompare(e, 'website')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="website"
                                                    onChange={(e) => handleChange(e)} value={data?.website} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_STREET")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="shippingStreet"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.shippingStreet)}
                                                    onChange={e => handChangeCompare(e, 'shippingStreet')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="shippingStreet"
                                                    onChange={(e) => handleChange(e)} value={data?.shippingStreet} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_CITY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="shippingCity"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.shippingCity)}
                                                    onChange={e => handChangeCompare(e, 'shippingCity')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="shippingCity"
                                                    onChange={(e) => handleChange(e)} value={data?.shippingCity} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_STATE_PROVINCE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="shippingProvince"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.shippingCity)}
                                                    onChange={e => handChangeCompare(e, 'shippingProvince')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="shippingProvince"
                                                    onChange={(e) => handleChange(e)} value={data?.shippingProvince} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_ZIP_POSTAL_CODE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="shippingPostalCode"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.shippingPostalCode)}
                                                    onChange={e => handChangeCompare(e, 'shippingPostalCode')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="shippingPostalCode"
                                                    onChange={(e) => handleChange(e)} value={data?.shippingPostalCode} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_COUNTRY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="shippingCountry"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.shippingCountry)}
                                                    onChange={e => handChangeCompare(e, 'shippingCountry')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="shippingCountry"
                                                    onChange={(e) => handleChange(e)} value={data?.shippingCountry} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Same but billing */}
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.BILLING_STREET")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="billingStreet"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.billingStreet)}
                                                    onChange={e => handChangeCompare(e, 'billingStreet')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="billingStreet"
                                                    onChange={(e) => handleChange(e)} value={data?.billingStreet} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.BILLING_CITY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="billingCity"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.billingCity)}
                                                    onChange={e => handChangeCompare(e, 'billingCity')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="billingCity"
                                                    onChange={(e) => handleChange(e)} value={data?.billingCity} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.BILLING_STATE_PROVINCE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="billingProvince"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.billingProvince)}
                                                    onChange={e => handChangeCompare(e, 'billingProvince')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="billingProvince"
                                                    onChange={(e) => handleChange(e)} value={data?.billingProvince} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.SHIPPING_ZIP_POSTAL_CODE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="billingPostalCode"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.billingPostalCode)}
                                                    onChange={e => handChangeCompare(e, 'billingPostalCode')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="billingPostalCode"
                                                    onChange={(e) => handleChange(e)} value={data?.billingPostalCode} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.BILLING_COUNTRY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="billingCountry"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.billingCountry)}
                                                    onChange={e => handChangeCompare(e, 'billingCountry')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="billingCountry"
                                                    onChange={(e) => handleChange(e)} value={data?.billingCountry} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="submit-button text-end mt-1">
                                        <Link to="#" onClick={() => setShow(false)} className="btn btn-light sidebar-close">
                                            {t("ACTION.CANCEL")}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="btn btn-light sidebar-close"
                                            onClick={() => clearFilter()} >
                                            {t("ACTION.CLEAR_FILTER")}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="btn btn-primary"
                                            onClick={() => saveFilter()}
                                        >
                                            {t("ACTION.SAVE")}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="btn btn-primary"
                                            onClick={() => handleSearch()}
                                        >
                                            {t("ACTION.SEARCH")}
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div >
            </div >
            {/* /Filter */}
        </>
    )
}