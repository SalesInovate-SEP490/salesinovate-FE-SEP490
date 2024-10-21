import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { getSalutationList } from "../../../services/lead";
import { useTranslation } from "react-i18next";
import { COMPARE_STRING } from "../../../core/data/json/compare";
import { deleteFilter, getListFilter, saveFilters } from "../../../services/filter";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';

const type = 3;
export const ContactFilter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any, newFilter?: any
}> = ({ show, setShow, search, setQuery, newFilter }) => {
    const [data, setData] = useState<any>({});
    const [salutation, setSalutation] = useState<any>(null);
    const [listCompare, setListCompare] = useState<any>({
        firstName: "@",
        lastName: "@",
        middleName: "@",
        salution: "@",
        title: "@",
        email: "@",
        phone: "@",
        department: "@",
        fax: "@",
        street: "@",
        city: "@",
        province: "@",
        postalCode: "@",
        country: "@"
    });
    const [filterData, setFilterData] = useState<any>(null);
    const [filter, setFilter] = useState<any>(null);
    const [listFilterOption, setListFilterOption] = useState<any>([]);
    const { t } = useTranslation();
    const handChangeCompare = (e: any, name: any) => {
        setListCompare((prevState: any) => ({
            ...prevState,
            [name]: e.value
        }));
    }


    useEffect(() => {
        if (newFilter) {
            setFilter(newFilter);
        }
    }, [newFilter])

    useEffect(() => {
        getSalutationList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.leadSalutionId,
                        label: item.leadSalutionName
                    }
                })
                setSalutation(data);
            })
            .catch((err) => {
                console.log(err);
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
        if (e?.target) {
            const { name, value } = e.target;
            let updatedValue = value;
            if (isNumber)
                updatedValue = value.replace(/[^0-9]/g, '');
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
        console.log("Data: ", data)
    };


    const togglePopup = () => {
        setShow(!show);
    };

    const clearFilter = () => {
        setData({
            firstName: "",
            lastName: "",
            middleName: "",
            salution: null,
            title: "",
            email: "",
            phone: "",
            department: "",
            fax: "",
            street: "",
            city: "",
            province: "",
            postalCode: "",
            country: ""
        });
        setListCompare({
            firstName: "@",
            lastName: "@",
            middleName: "@",
            salution: "@",
            status: "@",
            title: "@",
            email: "@",
            phone: "@",
            department: "@",
            fax: "@",
            street: "@",
            city: "@",
            province: "@",
            postalCode: "@",
            country: "@"
        })
        setQuery(null);
    }

    const handleSearch = (newData?: any) => {
        const fieldMappings = [
            { key: 'firstName', query: 'firstName', compare: listCompare.firstName },
            { key: 'lastName', query: 'lastName', compare: listCompare.lastName },
            { key: 'middleName', query: 'middleName', compare: listCompare.middleName },
            { key: 'salution.label', query: 'salution_leadSalutionName', compare: listCompare.salution },
            { key: 'title', query: 'title', compare: listCompare.title },
            { key: 'email', query: 'email', compare: listCompare.email },
            { key: 'phone', query: 'phone', compare: listCompare.phone },
            { key: 'department', query: 'department', compare: listCompare.department },
            { key: 'fax', query: 'fax', compare: listCompare.fax },
            { key: 'street', query: 'address_street', compare: listCompare.street },
            { key: 'city', query: 'address_city', compare: listCompare.city },
            { key: 'province', query: 'address_province', compare: listCompare.province },
            { key: 'postalCode', query: 'address_postalCode', compare: listCompare.postalCode },
            { key: 'country', query: 'address_country', compare: listCompare.country },
            { key: 'fromDate', query: 'createDate', compare: ">" },
            { key: 'toDate', query: 'createDate', compare: "<" },
        ];
        const dataSearch = newData ? newData : data;
        dataSearch.fromDate = dataSearch.fromDate ? new Date(dataSearch.fromDate).toISOString()?.replace("Z", "") : null;
        dataSearch.toDate = dataSearch.toDate ? new Date(dataSearch.toDate).toISOString()?.replace("Z", "") : null;
        let searchQuery = fieldMappings
            .map(({ key, query, compare }) => {
                const keys = key.split('.');
                let value = dataSearch;
                for (let k of keys) {
                    value = value?.[k];
                    if (!value) break;
                }
                return value ? `&search=${query}${compare} ${value}` : '';
            })
            .filter(Boolean)
            .join('');
        setQuery(searchQuery);
        search(1, 10, searchQuery);
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
            { key: 'firstName', query: 'firstName', compare: listCompare.firstName },
            { key: 'lastName', query: 'lastName', compare: listCompare.lastName },
            { key: 'middleName', query: 'middleName', compare: listCompare.middleName },
            { key: 'salution.label', query: 'salution_leadSalutionName', compare: listCompare.salution },
            { key: 'salution.leadSalutionId', query: 'salution_leadSalutionId', compare: listCompare.salution },
            { key: 'title', query: 'title', compare: listCompare.title },
            { key: 'email', query: 'email', compare: listCompare.email },
            { key: 'phone', query: 'phone', compare: listCompare.phone },
            { key: 'department', query: 'department', compare: listCompare.department },
            { key: 'fax', query: 'fax', compare: listCompare.fax },
            { key: 'street', query: 'address_street', compare: listCompare.street },
            { key: 'city', query: 'address_city', compare: listCompare.city },
            { key: 'province', query: 'address_province', compare: listCompare.province },
            { key: 'postalCode', query: 'address_postalCode', compare: listCompare.postalCode },
            { key: 'country', query: 'address_country', compare: listCompare.country },
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
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    salution: null,
                    title: "",
                    email: "",
                    phone: "",
                    department: "",
                    fax: "",
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
                setData(dataField);
                handleSearch(dataField);
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
                        <h4>{t("CONTACT.SEARCH_CONTACT")}</h4>
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
                                            {t("TITLE.LEADS.SALUTATION")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="salution"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.salution)}
                                                    onChange={e => handChangeCompare(e, 'salution')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={salutation}
                                                    styles={customStyles}
                                                    value={data?.salution ? salutation?.find((item: any) => item?.value === data?.salution?.leadSalutionId) : null}
                                                    name="salution"
                                                    onChange={e => handleChange(e, 'salution', 'leadSalutionId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.FIRST_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="firstName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.firstName)}
                                                    onChange={e => handChangeCompare(e, 'firstName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="firstName"
                                                    onChange={(e) => handleChange(e)} value={data?.firstName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.LAST_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="lastName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.lastName)}
                                                    onChange={e => handChangeCompare(e, 'lastName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="lastName"
                                                    onChange={(e) => handleChange(e)} value={data?.lastName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.MIDDLE_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="middleName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.middleName)}
                                                    onChange={e => handChangeCompare(e, 'middleName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="middleName"
                                                    onChange={(e) => handleChange(e)} value={data?.middleName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.TITLE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="title"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.title)}
                                                    onChange={e => handChangeCompare(e, 'title')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="title"
                                                    onChange={(e) => handleChange(e)} value={data?.title} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.EMAIL")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="email"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.email)}
                                                    onChange={e => handChangeCompare(e, 'email')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="email"
                                                    onChange={(e) => handleChange(e)} value={data?.email} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.PHONE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="phone"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.phone)}
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
                                            {t("CONTACT.DEPARTMENT")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="department"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.department)}
                                                    onChange={e => handChangeCompare(e, 'department')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="department"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.department}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("CONTACT.FAX")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="fax"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.fax)}
                                                    onChange={e => handChangeCompare(e, 'fax')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fax"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.fax}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.STREET")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="street"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.street)}
                                                    onChange={e => handChangeCompare(e, 'street')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="street"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.street}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.CITY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="city"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.city)}
                                                    onChange={e => handChangeCompare(e, 'city')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.city}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.PROVINCE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="province"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.province)}
                                                    onChange={e => handChangeCompare(e, 'province')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="province"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.province}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.POSTAL_CODE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="postalCode"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.postalCode)}
                                                    onChange={e => handChangeCompare(e, 'postalCode')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="postalCode"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.postalCode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("TITLE.LEADS.COUNTRY")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="country"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.country)}
                                                    onChange={e => handChangeCompare(e, 'country')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="country"
                                                    onChange={(e) => handleChange(e)}
                                                    value={data?.country}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShow(false)} className="btn btn-light sidebar-close">
                                        {t("ACTION.CANCEL")}
                                    </Link>
                                    <Link to="#" onClick={() => clearFilter()} className="btn btn-light sidebar-close">
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Filter */}
        </>
    )
}