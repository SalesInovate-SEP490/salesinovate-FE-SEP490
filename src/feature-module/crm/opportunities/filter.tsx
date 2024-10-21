import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getListForecast, getListSource, getListStage, getListType } from "../../../services/opportunities";
import { getAccounts } from "../../../services/account";
import { COMPARE_STRING } from "../../../core/data/json/compare";
import { deleteFilter, getListFilter, saveFilters } from "../../../services/filter";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';

const type = 4;
export const OpportunityFilter: React.FC<{
    show?: any, setShow?: any, search?: any, setQuery?: any, newFilter?: any
}> = ({ show, setShow, search, setQuery, newFilter }) => {
    const [data, setData] = useState<any>({});
    const { t } = useTranslation();
    const [listSelect, setListSelect] = useState<{
        forecast?: { value: number; label: string }[];
        stage?: { value: number; label: string }[];
        account?: { value: number; label: string }[];
        type?: { value: number; label: string }[];
        leadSource?: { value: number; label: string }[];
        campaignSource?: { value: number; label: string }[];
    }>({
        forecast: [],
        stage: [],
        account: [],
        type: [],
        leadSource: [],
        campaignSource: []
    });
    const [listCompare, setListCompare] = useState<any>({
        accountName: "@",
        stage: "@",
        opportunityName: "@",
        nextStep: "@",
        leadSource: "@",
        forecast: "@",
        type: "@",
        fromDate: ">",
        toDate: "<"
    });
    const [filterData, setFilterData] = useState<any>(null);
    const [filter, setFilter] = useState<any>(null);
    const [listFilterOption, setListFilterOption] = useState<any>([]);

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
    }, [newFilter]);

    useEffect(() => {
        getListStage()
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        stage: response?.data?.map((item: any) => ({
                            value: item.id,
                            label: item.stageName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });

        getListForecast()
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        forecast: response?.data?.map((item: any) => ({
                            value: item.id,
                            label: item.forecastName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });

        getAccounts(1, 100)
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        account: response?.data?.items?.map((item: any) => ({
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
                        type: response?.data?.map((item: any) => ({
                            value: item.id,
                            label: item.typeName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });
        getListSource()
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        leadSource: response?.data?.map((item: any) => ({
                            value: item.leadSourceId,
                            label: item.leadSourceName
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
            handleSearch(true);
        }
    };


    const togglePopup = () => {
        setShow(!show);
    };

    const clearFilter = () => {
        setData({
            opportunityName: "",
            stage: null,
            accountName: null,
            nextStep: "",
            leadSource: null,
            forecast: null,
            type: null
        });

        setListCompare({
            accountName: "@",
            stage: "@",
            opportunityName: "@",
            nextStep: "@",
            leadSource: "@",
            forecast: "@",
            type: "@"
        });
        handleSearch(true);
        setQuery(null);
    }

    const handleSearch = (isSetQuery: any = false) => {
        const fieldMappings = [
            { key: 'opportunityName', query: 'opportunityName', compare: listCompare.opportunityName },
            { key: 'stage.label', query: 'rating_stageName', compare: listCompare.stage },
            { key: 'account.accountId', query: 'accountId', compare: listCompare.accountName },
            { key: 'nextStep', query: 'nextStep', compare: listCompare.nextStep },
            { key: 'leadSource.label', query: 'source_leadSourceName', compare: listCompare.leadSource },
            { key: 'forecast.label', query: 'industry_forecastName', compare: listCompare.forecast },
            { key: 'type.label', query: 'type_typeName', compare: listCompare.type },
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
        searchQuery = searchQuery.length > 0 ? searchQuery.substring(1) : searchQuery;
        setQuery(searchQuery);
        if (!isSetQuery)
            search(1, 10, searchQuery);
    }

    const handleSearch2 = (data: any) => {
        const fieldMappings = [
            { key: 'opportunityName', query: 'opportunityName', compare: listCompare.opportunityName },
            { key: 'stage.label', query: 'rating_stageName', compare: listCompare.stage },
            { key: 'account.accountId', query: 'accountId', compare: listCompare.accountName },
            { key: 'nextStep', query: 'nextStep', compare: listCompare.nextStep },
            { key: 'leadSource.label', query: 'source_leadSourceName', compare: listCompare.leadSource },
            { key: 'forecast.label', query: 'industry_forecastName', compare: listCompare.forecast },
            { key: 'type.label', query: 'type_typeName', compare: listCompare.type },
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
        searchQuery = searchQuery.length > 0 ? searchQuery.substring(1) : searchQuery;
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
            { key: 'opportunityName', query: 'opportunityName', compare: listCompare.opportunityName },
            { key: 'stage.label', query: 'stage_label', compare: listCompare.stage },
            { key: 'stage.stageId', query: 'stage_stageId', compare: listCompare.stage },
            { key: 'account.accountId', query: 'accountId', compare: listCompare.accountName },
            { key: 'nextStep', query: 'nextStep', compare: listCompare.nextStep },
            { key: 'leadSource.label', query: 'leadSource_label', compare: listCompare.leadSource },
            { key: 'leadSource.leadSourceId', query: 'leadSource_leadSourceId', compare: listCompare.leadSource },
            { key: 'forecast.label', query: 'forecast_label', compare: listCompare.forecast },
            { key: 'forecast.forecastId', query: 'forecast_forecastId', compare: listCompare.forecast },
            { key: 'type.label', query: 'type_typeName', compare: listCompare.type },
            { key: 'type.typeId', query: 'type_typeId', compare: listCompare.type },
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
                    opportunityName: "",
                    stage: null,
                    accountName: null,
                    nextStep: "",
                    leadSource: null,
                    forecast: null,
                    type: null
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
                        <h4>{t("LABEL.OPPORTUNITIES.SEARCH_OPPORTUNITY")}</h4>
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
                                    {/* <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.ACCOUNT_NAME")}
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
                                                    <div className="form-wrap w-100">
                                                        <Select
                                                            className="select"
                                                            options={listSelect.account}
                                                            styles={customStyles}
                                                            value={listSelect.account?.find((item: any) => item.value === data?.account?.accountId)}
                                                            name="status"
                                                            onChange={e => handleChange(e, 'account', 'accountId')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
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
                                            {t("LABEL.OPPORTUNITIES.STAGE")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="stage"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare.stage)}
                                                    onChange={e => handChangeCompare(e, 'stage')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    className="select"
                                                    options={listSelect.stage}
                                                    styles={customStyles}
                                                    value={data?.stage ? listSelect.stage?.find((item: any) => item?.value === data.stage.stageId) : null}
                                                    name="salution"
                                                    onChange={e => handleChange(e, 'stage', 'stageId')}
                                                    isClearable={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="opportunityName"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.opportunityName)}
                                                    onChange={e => handChangeCompare(e, 'opportunityName')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="opportunityName"
                                                    onChange={(e) => handleChange(e)} value={data?.opportunityName} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="col-form-label">
                                            {t("LABEL.OPPORTUNITIES.NEXT_STEP")}
                                        </label>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Select
                                                    className="select"
                                                    options={COMPARE_STRING}
                                                    styles={customStyles}
                                                    name="nextStep"
                                                    value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.nextStep)}
                                                    onChange={e => handChangeCompare(e, 'nextStep')}
                                                />
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="nextStep"
                                                    onChange={(e) => handleChange(e)} value={data?.nextStep} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* listSelect.leadSource */}
                                <div className="col-md-12">
                                    <label className="col-form-label">
                                        {t("LABEL.OPPORTUNITIES.LEAD_SOURCE")}
                                    </label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Select
                                                className="select"
                                                options={COMPARE_STRING}
                                                styles={customStyles}
                                                name="leadSource"
                                                value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.leadSource)}
                                                onChange={e => handChangeCompare(e, 'leadSource')}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <Select
                                                className="select"
                                                options={listSelect.leadSource}
                                                styles={customStyles}
                                                value={data?.leadSource ? listSelect.leadSource?.find((item: any) => item?.value === data.leadSource.leadSourceId) : null}
                                                name="salution"
                                                onChange={e => handleChange(e, 'leadSource', 'leadSourceId')}
                                                isClearable={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* forecast  */}
                                <div className="col-md-12">
                                    <label className="col-form-label">
                                        {t("LABEL.OPPORTUNITIES.FORECAST")}
                                    </label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Select
                                                className="select"
                                                options={COMPARE_STRING}
                                                styles={customStyles}
                                                name="forecast"
                                                value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.forecast)}
                                                onChange={e => handChangeCompare(e, 'forecast')}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <Select
                                                className="select"
                                                options={listSelect.forecast}
                                                styles={customStyles}
                                                value={data?.forecast ? listSelect.forecast?.find((item: any) => item?.value === data.forecast.forecastId) : null}
                                                name="salution"
                                                onChange={e => handleChange(e, 'forecast', 'forecastId')}
                                                isClearable={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* type */}
                                <div className="col-md-12">
                                    <label className="col-form-label">
                                        {t("LABEL.OPPORTUNITIES.TYPE")}
                                    </label>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Select
                                                className="select"
                                                options={COMPARE_STRING}
                                                styles={customStyles}
                                                name="type"
                                                value={COMPARE_STRING.find((item: any) => item?.value === listCompare?.type)}
                                                onChange={e => handChangeCompare(e, 'type')}
                                            />
                                        </div>
                                        <div className="col-md-9">
                                            <Select
                                                className="select"
                                                options={listSelect.type}
                                                styles={customStyles}
                                                value={data?.type ? listSelect.type?.find((item: any) => item?.value === data.type.typeId) : null}
                                                name="salution"
                                                onChange={e => handleChange(e, 'type', 'typeId')}
                                                isClearable={true}
                                            />
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