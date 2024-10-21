import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { useTranslation } from "react-i18next";
import { COMPARE_STRING } from "../../../core/data/json/compare";

const activeList = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" },
];

export const PriceBookFilter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any
}> = ({ show, setShow, search, setQuery }) => {
    const [data, setData] = useState<any>({});
    const { t } = useTranslation();
    const [listCompare, setListCompare] = useState<any>({
        priceBookName: "@",
        priceBookDescription: "@",
        isActive: ":",
        isStandardPriceBook: ":",
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
            priceBookName: "",
            priceBookDescription: "",
            isActive: null,
            isStandardPriceBook: null,
        });

        setListCompare({
            priceBookName: "@",
            priceBookDescription: "@",
            isActive: ":",
            isStandardPriceBook: ":",
        });
        handleSearch(true);
        setQuery(null);
    }

    const handleSearch = (isSetQuery: any = false) => {
        const fieldMappings = [
            { key: 'priceBookName', query: 'priceBookName', compare: listCompare.priceBookName },
            { key: 'priceBookDescription', query: 'priceBookDescription', compare: listCompare.priceBookDescription },
            { key: 'active.activeId', query: 'isActive', compare: listCompare.isActive },
            { key: 'standardPriceBook.standardPriceBookId', query: 'isStandardPriceBook', compare: listCompare.isStandardPriceBook },

        ];

        let searchQuery = fieldMappings
            .map(({ key, query, compare }) => {
                const keys = key.split('.');
                let value = data;
                for (let k of keys) {
                    value = value?.[k];
                    if (value === undefined || value === null) break;
                }
                console.log("query", query, "value", value, "compare", compare);
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
                                            {t("PRICE_BOOK.PRICE_BOOK_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="priceBookName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.priceBookName)}
                                                    onChange={e => handChangeCompare(e, 'priceBookName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="priceBookName"
                                                    onChange={(e) => handleChange(e)} value={data?.priceBookName} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* productDescription */}
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.PRICE_BOOK.PRICE_BOOK_DESCRIPTION")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="priceBookDescription"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.priceBookDescription)}
                                                    onChange={e => handChangeCompare(e, 'priceBookDescription')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="priceBookDescription"
                                                    onChange={(e) => handleChange(e)} value={data?.priceBookDescription} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("PRICE_BOOK.ACTIVE")}
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
                                                    name="active"
                                                    onChange={e => handleChange(e, 'active', 'activeId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("PRICE_BOOK.IS_STANDARD_PRICE_BOOK")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="isStandardPriceBook"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare.isStandardPriceBook)}
                                                    onChange={e => handChangeCompare(e, 'isStandardPriceBook')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={activeList}
                                                    styles={customStyles}
                                                    value={data?.standardPriceBook ? activeList.find((item: any) => item?.value === data?.standardPriceBook?.activeId) : null}
                                                    name="standardPriceBook"
                                                    onChange={e => handleChange(e, 'standardPriceBook', 'standardPriceBookId')}
                                                    isClearable={true}
                                                />
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