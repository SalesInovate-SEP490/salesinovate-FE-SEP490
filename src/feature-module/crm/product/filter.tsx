import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { COMPARE_STRING } from "../../../core/data/json/compare";

const activeList = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

export const ProductFilter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any
}> = ({ show, setShow, search, setQuery }) => {
    const [data, setData] = useState<any>({});
    const { t } = useTranslation();
    
    const [listCompare, setListCompare] = useState<any>({
        isActive: "@",
        productName: "@",
        productCode: "@",
        productDescription: "@",
    });

    const handChangeCompare = (e: any, name: any) => {
        setListCompare((prevState: any) => ({
            ...prevState,
            [name]: e.value
        }));
    }

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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value } = e.target;
            setData({
                ...data,
                [name]: value
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
            handleSearch(true);
        }
    };


    const togglePopup = () => {
        setShow(!show);
    };

    const clearFilter = () => {
        setData({
            active: null,
            productName: null,
            productCode: null,
            productDescription: null,
        });

        setListCompare({
            isActive: "@",
            productName: "@",
            productCode: "@",
            productDescription: "@",
        });
        handleSearch(true);
        setQuery(null);
    }

    const handleSearch = (isSetQuery: any = false) => {
        const fieldMappings = [
            { key: 'productName', query: 'productName', compare: listCompare.productName },
            { key: 'productCode', query: 'productCode', compare: listCompare.productCode },
            { key: 'productDescription', query: 'productDescription', compare: listCompare.productDescription },
            { key: 'active.activeId', query: 'isActive', compare: listCompare.isActive },
        ];

        let searchQuery = fieldMappings
            .map(({ key, query, compare }) => {
                const keys = key.split('.');
                let value = data;
                for (let k of keys) {
                    value = value?.[k];
                    if (value === undefined || value === null) break;
                }
                return (value !== undefined && value !== null) ? `&search=${query}${compare}${value}` : '';
            })
            .filter(Boolean)
            .join('');
        searchQuery = searchQuery.length > 0 ? searchQuery.substring(1) : searchQuery;
        setQuery(searchQuery);
        if (!isSetQuery)
            search(1, 10, searchQuery);
    }

    return (
        <>
            {/* Filter */}
            <div className={`toggle-popup ${show ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.PRODUCT.SEARCH_PRODUCT")}</h4>
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
                                            {t("PRODUCT.IS_ACTIVE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="isActive"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare.isActive)}
                                                    onChange={e => handChangeCompare(e, 'isActive')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={activeList}
                                                    styles={customStyles}
                                                    value={data?.active ? activeList.find((item: any) => item?.value === data?.active?.activeId) : null}
                                                    name="salution"
                                                    onChange={e => handleChange(e, 'active', 'activeId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("PRODUCT.PRODUCT_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="productName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.productName)}
                                                    onChange={e => handChangeCompare(e, 'productName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="productName"
                                                    onChange={(e) => handleChange(e)} value={data?.productName} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* PRODUCT_CODE */}
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("PRODUCT.PRODUCT_CODE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="productCode"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.productCode)}
                                                    onChange={e => handChangeCompare(e, 'productCode')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="productCode"
                                                    onChange={(e) => handleChange(e)} value={data?.productCode} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* productDescription */}
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("PRODUCT.PRODUCT_DESCRIPTION")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="productDescription"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.productDescription)}
                                                    onChange={e => handChangeCompare(e, 'productDescription')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="productDescription"
                                                    onChange={(e) => handleChange(e)} value={data?.productDescription} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShow(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-light sidebar-close"
                                        onClick={() => clearFilter()}
                                    >
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Filter */}
        </>
    )
}