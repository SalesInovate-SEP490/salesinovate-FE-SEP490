import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { Opportunity } from "./type";
import { useTranslation } from "react-i18next";
import { getListForecast, getListStage, getOpportunityDetail, getTotalRecord, updateOpportunity } from "../../../services/opportunities";
import DatePicker from 'react-datepicker';
import { initOpportunity } from "./data";


export const UpdateOpportunity = (prop: any) => {
    const [opportunity, setOpportunity] = useState<Opportunity>(prop.data || initOpportunity);
    const [forecast, setForecast] = useState<any>([]);
    const [stage, setStage] = useState<any>([]);
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };


    useEffect(() => {
        getListStage()
            .then(response => {
                if (response.code === 1) {
                    setStage(response.data.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.stageName

                        }
                    }))
                }
            })
            .catch(err => {

            })
        getListForecast()
            .then(response => {
                if (response.code === 1) {
                    setForecast(response.data.map((item: any) => {
                        return {
                            value: item.id,
                            label: item.forecastName
                        }
                    }))
                }
            })
            .catch(err => {

            })
        getOpportunityDetail(prop.id)
            .then(response => {
                if (response.code === 1) {
                    setOpportunity(response.data);
                }
            })
            .catch(err => {

            })
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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value } = e.target;
            setOpportunity({
                ...opportunity,
                [name]: value
            });
        } else {
            if (nameChild) {
                setOpportunity({
                    ...opportunity,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setOpportunity({
                    ...opportunity,
                    [name]: e.value
                });
            }
        }
        console.log("Opportunity: ", opportunity)
    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const handleUpdate = () => {
        opportunity.last_modified_by = 1;
        opportunity.closeDate = selectedDate ? selectedDate?.toISOString() : '';
        opportunity.stageId = opportunity.stage.stageId;
        opportunity.forecastCategoryId = opportunity.forecast.forecastCategoryId;
        updateOpportunity(opportunity)
            .then(response => {
                if (response.code === 1) {
                    toast.success("Update opportunity successfully!");
                    prop.setShowPopup(false);
                    prop.getDetail();
                }
            })
            .catch(err => { });
    }

    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Update Opportunity</h4>
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
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.ACCOUNT_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="accountId"
                                                onChange={(e) => handleChange(e)} value={opportunity?.accountId} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.OPPORTUNITIES.PROBABILITY")} <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="probability"
                                                onChange={(e) => handleChange(e)} value={opportunity?.probability} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.OPPORTUNITIES.FORECAST_CATEGORY")} <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-wrap w-100">
                                            <Select
                                                className="select"
                                                options={forecast}
                                                styles={customStyles}
                                                value={forecast?.find((item: any) => item.value === opportunity?.forecast?.forecastCategoryId)}
                                                name="forecast"
                                                onChange={e => handleChange(e, 'forecast', 'forecastCategoryId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.STAGE")} <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select"
                                                options={stage}
                                                styles={customStyles}
                                                value={stage?.find((item: any) => item.value === opportunity?.stage?.stageId)}
                                                name="stage"
                                                onChange={e => handleChange(e, 'stage', 'stageId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME")}</label>
                                            <input type="text" className="form-control" name="opportunityName"
                                                onChange={(e) => handleChange(e)} value={opportunity?.opportunityName} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.NEXT_STEP")}</label>
                                            <input type="text" className="form-control" name="nextStep"
                                                onChange={(e) => handleChange(e)} value={opportunity?.nextStep} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.AMOUNT")}</label>
                                            <input type="text" className="form-control" name="amount"
                                                onChange={(e) => handleChange(e)} value={opportunity?.amount} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            Follow Up Date <span className="text-danger"> *</span>
                                        </label>
                                        <div className="icon-form">
                                            <span className="form-icon">
                                                <i className="ti ti-calendar-check" />
                                            </span>
                                            <DatePicker
                                                className="form-control datetimepicker deals-details w-100"
                                                selected={selectedDate}
                                                onChange={handleDateChange}
                                                dateFormat="dd-MM-yyyy"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => prop.setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={() => handleUpdate()}
                                    >
                                        Update
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}