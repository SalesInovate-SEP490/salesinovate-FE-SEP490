import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { createOpportunity, getListForecast, getListSource, getListStage, getListType, getOpportunityDetail, patchOpportunity } from "../../../services/opportunities";
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker';
import { initOpportunity } from "./data";
import { getAccounts } from "../../../services/account";
import { formatString, getTimeCorrectTimeZone } from "../../../utils/commonUtil";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getCampaign } from "../../../services/campaign";

const maxLengthObject = {
    nextStep: 255,
    opportunityName: 255,
    description: 1000,
    amount: 20,
}
export const CreateOpportunity: React.FC<{
    showPopup: boolean; isEdit?: any;
    setShowPopup: (show: boolean) => void;
    data?: any; id?: any; getDetail?: any;
    getOpportunities?: any; accountId?: any;
}> = ({ showPopup, setShowPopup, data, getOpportunities, isEdit, id, getDetail, accountId }) => {
    const [opportunity, setOpportunity] = useState<any>(data || initOpportunity);
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
    const [errors, setErrors] = useState<{
        accountName?: string; probability?: string; forecast_category?: string; stage?: string;
        closeDate?: string; opportunityName?: string; amount?: string; nextStep?: string; description?: string;
    }>({});
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>();
    const userName = useState(useSelector((state: any) => state.userName));


    const validate = () => {
        let tempErrors: {
            accountName?: string; probability?: string; forecast_category?: string;
            stage?: string; closeDate?: string; opportunityName?: string; amount?: string;
            nextStep?: string; description?: string;
        } = {};
        if (!opportunity.accountId) {
            tempErrors.accountName = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!opportunity?.probability) {
            tempErrors.probability = t("MESSAGE.ERROR.REQUIRED");
        } else if (parseFloat(opportunity?.probability) < 0 || parseFloat(opportunity?.probability) > 100) {
            tempErrors.probability = t("MESSAGE.ERROR.PROBABILITY_RANGE");
        }
        if (!opportunity?.forecastCategoryId) {
            tempErrors.forecast_category = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!opportunity?.stageId) {
            tempErrors.stage = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!selectedDate) {
            tempErrors.closeDate = t("MESSAGE.ERROR.REQUIRED");
        }
        if (opportunity?.opportunityName && opportunity.opportunityName.length > maxLengthObject.opportunityName) {
            tempErrors.opportunityName = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), maxLengthObject.opportunityName);
        }
        if (opportunity?.amount && opportunity.amount.length > maxLengthObject.amount) {
            tempErrors.amount = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), maxLengthObject.amount);
        }
        if (opportunity?.nextStep && opportunity.nextStep.length > maxLengthObject.nextStep) {
            tempErrors.nextStep = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), maxLengthObject.nextStep);
        }
        if (opportunity?.description && opportunity.description.length > maxLengthObject.description) {
            tempErrors.description = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), maxLengthObject.description);
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };


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

        getAccounts(0, 1000)
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        account: response?.data?.items.map((item: any) => ({
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
        getCampaign({pageNo: 0, pageSize: 1000})
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        campaignSource: response?.data?.items.map((item: any) => ({
                            value: item.campaignId,
                            label: item.campaignName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });
    }, []);

    useEffect(() => {
        if (accountId) {
            setOpportunity({
                ...opportunity,
                accountId: parseInt(accountId)
            });
        }
    }, [accountId]);

    useEffect(() => {
        if (isEdit && id) {
            getOpportunityDetail(id)
                .then(response => {
                    if (response.code === 1) {
                        setOpportunity({
                            ...response.data,
                            forecastCategoryId: response?.data?.forecast?.forecastCategoryId,
                            stageId: response?.data?.stage?.stageId,
                            type: response?.data?.type,
                            leadSource: response?.data?.leadSource,
                            campaignSource: response?.data?.campaignSource,
                        });
                        setSelectedDate(new Date(response.data.closeDate));
                    }
                })
                .catch(err => {
                    // Handle error
                });
        }
    }, [id])

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
            let updatedValue = value;

            if (name === 'amount') {
                // Remove any non-numeric characters for 'amount' field
                updatedValue = value.replace(/[^0-9]/g, '');
            }
            if (name === 'probability') {
                // accept only number and '.' for 'probability' field
                updatedValue = value.replace(/[^0-9.]/g, '');
            }
            setOpportunity({
                ...opportunity,
                [name]: updatedValue
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
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };



    const handleCreate = () => {
        if (validate()) {
            opportunity.last_modified_by = 1;
            opportunity.closeDate = getTimeCorrectTimeZone(selectedDate);
            const newOpportunity: any = {
                accountId: opportunity?.accountId,
                amount: opportunity?.amount,
                closeDate: opportunity?.closeDate,
                description: opportunity?.description,
                forecast: opportunity?.forecast?.forecastCategoryId,
                leadSourceId: opportunity?.leadSource?.leadSourceId,
                nextStep: opportunity?.nextStep,
                opportunityName: opportunity?.opportunityName,
                probability: opportunity?.probability,
                stage: opportunity?.stage?.stageId,
                type: opportunity?.type?.typeId,
                primaryCampaignSourceId: opportunity?.campaignSource?.campaignSourceId ? opportunity?.campaignSource?.campaignSourceId : undefined,
                leadSource: opportunity?.leadSource?.leadSourceId ? opportunity?.leadSource?.leadSourceId : undefined,
            }
            Swal.showLoading();
            if (isEdit) {
                newOpportunity.id = opportunity?.opportunityId;
                patchOpportunity(newOpportunity)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Update opportunity successfully!");
                            setShowPopup(false);
                            getDetail();
                        } else {
                            toast.error("Update opportunity failed!");
                        }
                    })
                    .catch(err => {
                        Swal.close();
                    });
            } else {
                createOpportunity(newOpportunity)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Create opportunity successfully!");
                            setShowPopup(false);
                            getOpportunities(1, 10);
                            setOpportunity(initOpportunity);
                        }
                    })
                    .catch(err => {
                        Swal.close();
                    });
            }
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("LABEL.OPPORTUNITIES.UPDATE_OPPORTUNITY") : t("LABEL.OPPORTUNITIES.CREATE_OPPORTUNITY")}</h4>
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
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("LABEL.OPPORTUNITIES.OPPORTUNITY_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.ACCOUNT_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select"
                                                options={listSelect?.account}
                                                styles={customStyles}
                                                value={listSelect?.account?.find((item: any) => item.value === opportunity?.accountId)}
                                                name="account"
                                                onChange={e => handleChange(e, 'account', 'accountId')}
                                            />
                                            {errors.accountName && <span className="text-danger">{errors.accountName}</span>}
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
                                            {errors.probability && <span className="text-danger">{errors.probability}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.OPPORTUNITIES.OPPORTUNITY_OWNER")}
                                                </label>
                                            </div>
                                            <div className="form-wrap w-100">
                                                <span>{userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.OPPORTUNITIES.FORECAST_CATEGORY")} <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-wrap w-100">
                                            <Select
                                                className="select"
                                                options={listSelect?.forecast}
                                                styles={customStyles}
                                                value={listSelect?.forecast?.find((item: any) => item.value === opportunity?.forecast?.forecastCategoryId)}
                                                name="forecast_category"
                                                onChange={e => handleChange(e, 'forecast', 'forecastCategoryId')}
                                            />
                                            {errors.forecast_category && <span className="text-danger">{errors.forecast_category}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.STAGE")} <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select"
                                                options={listSelect?.stage}
                                                styles={customStyles}
                                                value={listSelect?.stage?.find((item: any) => item.value === opportunity?.stage?.stageId)}
                                                name="stage"
                                                onChange={e => handleChange(e, 'stage', 'stageId')}
                                            />
                                            {errors.stage && <span className="text-danger">{errors.stage}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME")}</label>
                                            <input type="text" className="form-control" name="opportunityName"
                                                onChange={(e) => handleChange(e)} value={opportunity?.opportunityName} />
                                            {errors.opportunityName && <span className="text-danger">{errors.opportunityName}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.NEXT_STEP")}</label>
                                            <input type="text" className="form-control" name="nextStep"
                                                onChange={(e) => handleChange(e)} value={opportunity?.nextStep} />
                                            {errors.nextStep && <span className="text-danger">{errors.nextStep}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.AMOUNT")}</label>
                                            <input type="text" className="form-control" name="amount"
                                                onChange={(e) => handleChange(e)} value={opportunity?.amount} />
                                            {errors.amount && <span className="text-danger">{errors.amount}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.OPPORTUNITIES.CLOSE_DATE")} <span className="text-danger"> *</span>
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
                                            {errors.closeDate && <span className="text-danger">{errors.closeDate}</span>}
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("LABEL.OPPORTUNITIES.ADDITIONAL_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.OPPORTUNITIES.TYPE")}
                                            </label>
                                            <Select
                                                className="select"
                                                options={listSelect?.type}
                                                styles={customStyles}
                                                value={listSelect?.type?.find((item: any) => item.value === opportunity?.type?.typeId)}
                                                name="account"
                                                onChange={e => handleChange(e, 'type', 'typeId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("LABEL.OPPORTUNITIES.LEAD_SOURCE")}
                                                </label>
                                                <Select
                                                    className="select"
                                                    options={listSelect?.leadSource}
                                                    styles={customStyles}
                                                    value={listSelect?.leadSource?.find((item: any) => item.value === opportunity?.leadSource?.leadSourceId)}
                                                    name="account"
                                                    onChange={e => handleChange(e, 'leadSource', 'leadSourceId')}
                                                />
                                            </div>
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("LABEL.OPPORTUNITIES.PRIMARY_CAMPAIGN_SOURCE")}
                                                </label>
                                                <Select
                                                    className="select"
                                                    options={listSelect?.campaignSource}
                                                    styles={customStyles}
                                                    value={listSelect?.campaignSource?.find((item: any) => item.value === opportunity?.campaignSourceId)}
                                                    name="account"
                                                    onChange={e => handleChange(e, 'campaignSource', 'campaignSourceId')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("LABEL.OPPORTUNITIES.DESCRIPTION_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("LABEL.OPPORTUNITIES.DESCRIPTION")}</label>
                                            <textarea className="form-control" name="description"
                                                onChange={(e) => handleChange(e)} value={opportunity?.description} />
                                            {errors.description && <span className="text-danger">{errors.description}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={() => handleCreate()}
                                    >
                                        {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
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