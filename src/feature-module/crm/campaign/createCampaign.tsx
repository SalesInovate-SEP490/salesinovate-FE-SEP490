import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createCampaign, getCampaignById, getCampaignStatus, getCampaignType, patchCampaign } from "../../../services/campaign";
import { initCampaign } from "./data";
import Select, { StylesConfig } from "react-select";

import "./campaign.scss"

export const CreateCampaign: React.FC<{
    showPopup?: boolean;
    setShowPopup?: any;
    data?: any;
    id?: any;
    isEdit?: any;
    getList?: any;
    getDetail?: any;
}> = ({ data, getDetail, getList, id, isEdit, setShowPopup, showPopup }) => {
    const [campaign, setCampaign] = useState<any>(data || initCampaign);
    const [errors, setErrors] = useState<any>({});
    const [statusOptions, setStatusOptions] = useState<any>([]);
    const [typeOptions, setTypeOptions] = useState<any>([]);
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

    useEffect(() => {
        if (showPopup) {
            getCampaignStatus()
                .then(response => {
                    if (response.code === 1) {
                        const status = response?.data?.map((item: any) => {
                            return {
                                value: item?.campaignStatusId,
                                label: item?.campaignStatusName
                            }
                        });
                        setStatusOptions(status);
                        // set campaign status default value
                        if (!isEdit) {
                            setCampaign((prev: any) => ({ ...prev, campaignStatus: status[0]?.value }));
                        }
                    } else {
                        toast.error(response?.message);
                    }
                })
                .catch(errors => {
                    console.log("errors: ", errors);
                })
            getCampaignType()
                .then(response => {
                    if (response.code === 1) {
                        const type = response?.data?.map((item: any) => {
                            return {
                                value: item?.campaignTypeId,
                                label: item?.campaignTypeName
                            }
                        });
                        setTypeOptions(type);
                        // set campaign type default value
                        if (!isEdit) {
                            setCampaign((prev: any) => ({ ...prev, campaignType: type[0]?.value }));
                        }
                    } else {
                        toast.error(response?.message);
                    }
                })
                .catch(errors => {
                    console.log("errors: ", errors);
                })
            if (isEdit) {
                getCampaignById(id)
                    .then(response => {
                        if (response.code === 1) {
                            setCampaign(response.data);
                        }
                    })
                    .catch(errors => {
                        console.log("errors: ", errors);
                    })
            }
        }
    }, [showPopup])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setCampaign({
                ...campaign,
                [name]: value,
            });
        } else {
            if (nameChild) {
                setCampaign({
                    ...campaign,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setCampaign({
                    ...campaign,
                    [name]: e.value,
                });
            }
        }
    };

    const validate = () => {
        let tempErrors: { campaignName?: string; isActive?: string; status?: string } = {};
        // Check required fields
        if (!campaign.campaignName?.trim()) tempErrors.campaignName = t("MESSAGE.ERROR.REQUIRED");

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    // console.log("date: ", new Date())

    const handleCreate = () => {
        if (validate()) {
            if (typeof campaign?.campaignStatus === "object") {
                campaign.campaignStatus = campaign?.campaignStatus?.campaignStatusId;
            }
            if (typeof campaign?.campaignType === "object") {
                campaign.campaignType = campaign?.campaignType?.campaignTypeId;
            }
            const newCampaign = {
                campaignName: campaign?.campaignName,
                isActive: campaign?.isActive,
                campaignStatus: campaign?.campaignStatus ? campaign?.campaignStatus : 1,
                startDate: campaign?.startDate ? new Date(campaign?.startDate).toISOString() : undefined,
                endDate: campaign?.endDate ? new Date(campaign?.endDate).toISOString() : undefined,
                description: campaign?.description ? campaign?.description : undefined,
                num_Sent: campaign?.num_Sent ? campaign?.num_Sent : undefined,
                budgetedCost: campaign?.budgetedCost ? campaign?.budgetedCost : undefined,
                expectedResponse: campaign?.expectedResponse ? campaign?.expectedResponse : undefined,
                actualCost: campaign?.actualCost ? campaign?.actualCost : undefined,
                expectedRevenue: campaign?.expectedRevenue ? campaign?.expectedRevenue : undefined,
                campaignType: campaign?.campaignType ? campaign?.campaignType : 1,
            };
            if (isEdit) {
                patchCampaign(id, newCampaign)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Update campaign successfully!");
                            setCampaign(initCampaign);
                            setShowPopup(false);
                            getDetail();
                        }
                    })
                    .catch(err => {
                        toast.error("Failed to update campaign.");
                    });
            } else {
                createCampaign(newCampaign)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Create campaign successfully!");
                            setCampaign(initCampaign);
                            setShowPopup(false);
                            getList(1, 10);
                        }
                    })
                    .catch(err => {
                        toast.error("Failed to create campaign.");
                    });
            }

        }
    };

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("LABEL.CAMPAIGN.UPDATE_CAMPAIGN") : t("LABEL.CAMPAIGN.CREATE_CAMPAIGN")}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={togglePopup}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="row">
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("CAMPAIGN.CAMPAIGN_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.CAMPAIGN_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="campaignName"
                                                onChange={handleChange}
                                                value={campaign?.campaignName || ''}
                                            />
                                            {errors.campaignName && <div className="text-danger">{errors.campaignName}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label" style={{ marginRight: '40px' }}>
                                                {t("CAMPAIGN.ACTIVE")}
                                            </label>
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                className="form-check-input"
                                                onChange={() => handleChange({ target: { name: "isActive", value: !campaign?.isActive } })}
                                                checked={campaign?.isActive || false}
                                            />
                                            {errors.isActive && (
                                                <div className="text-danger">{errors.isActive}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.STATUS")}
                                                </label>
                                            </div>
                                            <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={statusOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "campaignStatus")
                                                }
                                                value={statusOptions.find(
                                                    (option: any) => option?.value === campaign?.campaignStatus
                                                )}
                                                placeholder={t("CAMPAIGN.SELECT_STATUS")}
                                            />
                                            {errors.campaignStatus && (
                                                <div className="text-danger">{errors.campaignStatus}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.TYPE")}
                                                </label>
                                            </div>
                                            <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={typeOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "campaignType")
                                                }
                                                value={statusOptions.find(
                                                    (option: any) => option?.value === campaign?.campaignType
                                                )}
                                                placeholder={t("CAMPAIGN.SELECT_TYPE")}
                                            />
                                            {errors.campaignType && (
                                                <div className="text-danger">{errors.campaignType}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.START_DATE")}
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="startDate"
                                                onChange={handleChange}
                                                value={campaign?.startDate || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.END_DATE")}
                                                </label>
                                            </div>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="endDate"
                                                onChange={handleChange}
                                                value={campaign?.endDate || ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.DESCRIPTION")}
                                                </label>
                                            </div>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                onChange={handleChange}
                                                value={campaign?.description || ''}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-ms-12 label-detail'>
                                    <span>
                                        {t("CAMPAIGN.PLANNING")}
                                    </span>
                                </div>
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.NUM_SENT_IN_CAMPAIGN")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="num_Sent"
                                                onChange={handleChange}
                                                value={campaign?.num_Sent || ''}
                                            />
                                            {errors.num_Sent && <div className="text-danger">{errors.num_Sent}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.BUDGETED_COST_IN_CAMPAIGN")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="budgetedCost"
                                                onChange={handleChange}
                                                value={campaign?.budgetedCost || ''}
                                            />
                                            {errors.budgetedCost && <div className="text-danger">{errors.budgetedCost}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.EXPECTED_RESPONSE")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="expectedResponse"
                                                onChange={handleChange}
                                                value={campaign?.expectedResponse || ''}
                                            />
                                            {errors.expectedResponse && <div className="text-danger">{errors.expectedResponse}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.ACTUAL_COST_IN_CAMPAIGN")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="actualCost"
                                                onChange={handleChange}
                                                value={campaign?.actualCost || ''}
                                            />
                                            {errors.actualCost && <div className="text-danger">{errors.actualCost}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.EXPECTED_REVENUE_IN_CAMPAIGN")}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="expectedRevenue"
                                                onChange={handleChange}
                                                value={campaign?.expectedRevenue || ''}
                                            />
                                            {errors.expectedRevenue && <div className="text-danger">{errors.expectedRevenue}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        {t("ACTION.CANCEL")}
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleCreate}
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