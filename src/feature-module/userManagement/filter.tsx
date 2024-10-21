import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { useTranslation } from "react-i18next";
import { COMPARE, COMPARE_STRING } from "../../core/data/json/compare";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DatePicker from 'react-datepicker';

const roles = [
    { value: "ad", label: "administrator" },
    { value: 2, label: "marketing" },

    { value: 4, label: "sales" },
    { value: 5, label: "salesmanager" },
]


export const Filter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any, newFilter?: any
}> = ({ show, setShow, search, setQuery }) => {
    const [data, setData] = useState<any>({});
    const [listCompare, setListCompare] = useState<any>({
        userName: '@',
        firstName: '@',
        lastName: '@',
        email: '@',
        phone: '@',
        from: ">",
        to: "<",
        role: '@',
    });
    const { t } = useTranslation();

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
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            from: "",
            to: "",
            role: null,
        });
        setListCompare({
            firstName: '@',
            lastName: '@',
            email: '@',
            phone: '@',
            from: ">",
            to: "<",
            role: '@',
        });
        setQuery(null);
    }

    const handleSearch = () => {
        const fieldMappings = [
            { key: 'firstName', query: 'firstName', compare: listCompare.firstName },
            { key: 'lastName', query: 'lastName', compare: listCompare.lastName },
            { key: 'email', query: 'email', compare: listCompare.email },
            { key: 'phone', query: 'phone', compare: listCompare.phone },
            { key: 'role.label', query: 'role_role_name', compare: listCompare.role },
            { key: 'fromDate', query: 'createDate', compare: ">" },
            { key: 'toDate', query: 'createDate', compare: "<" },
            { key: 'shippingStreet', query: 'address_street', compare: listCompare.shippingStreet },
            { key: 'shippingCity', query: 'address_city', compare: listCompare.shippingCity },
            { key: 'shippingProvince', query: 'address_province', compare: listCompare.shippingProvince },
            { key: 'shippingPostalCode', query: 'address_postalCode', compare: listCompare.shippingPostalCode },
            { key: 'shippingCountry', query: 'address_country', compare: listCompare.shippingCountry },
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

    return (
        <>
            {/* Filter */}
            <div className={`toggle-popup ${show ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("USER_MANAGE.SEARCH_USER")}</h4>
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
                                    {/* // userName */}
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("MANAGER_USER.USER_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="userName"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.userName)}
                                                    onChange={e => handChangeCompare(e, 'userName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="userName"
                                                    onChange={(e) => handleChange(e)} value={data?.userName} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* // firstName */}
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
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.firstName)}
                                                    onChange={e => handChangeCompare(e, 'firstName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="firstName"
                                                    onChange={(e) => handleChange(e)} value={data?.firstName} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* // lastName */}
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
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.lastName)}
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
                                            {t("MANAGER_USER.ROLES")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="role"
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.role)}
                                                    onChange={e => handChangeCompare(e, 'role')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={roles}
                                                    styles={customStyles}
                                                    value={data?.role ? roles.find((item: any) => item.value === data?.role?.value) : null}
                                                    name="role"
                                                    onChange={e => handleChange(e, 'role', 'roleName')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Email */}
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
                                                    value={COMPARE_STRING.find((item: any) => item.value === listCompare.email)}
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