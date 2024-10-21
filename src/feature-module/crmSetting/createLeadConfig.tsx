import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createConfigLead, patchConfigLead } from "../../services/config";

export const CreateLeadConfig: React.FC<{
    setShowPopup?: any, id?: any, updateConfig?: any,
    showPopup?: any, getList?: any, isEdit?: any
}> = ({ setShowPopup, showPopup, isEdit, id, getList, updateConfig }) => {
    const [config, setConfig] = useState<any>({});
    const [errors, setErrors] = useState<any>({})
    const userName = useState(useSelector((state: any) => state.userName));
    const { t } = useTranslation();

    useEffect(() => {
        if (isEdit) {
            setConfig(updateConfig);
        }
    }, [updateConfig])

    useEffect(() => {
        if (!showPopup) {
            setConfig({});
            setErrors({});
        }
    }, [showPopup])

    const validate = () => {
        let tempErrors: any = {};
        if (!config?.leadStatusName) {
            tempErrors.leadStatusName = t("CONFIG.LEAD_STATUS_NAME_REQUIRED");
        }
        if (!config?.leadStatusIndex) {
            tempErrors.leadStatusIndex = t("CONFIG.LEAD_STATUS_INDEX_REQUIRED");
        }
        // leadStatusIndex must be a number
        if (config?.leadStatusIndex && isNaN(config?.leadStatusIndex)) {
            tempErrors.leadStatusIndex = t("CONFIG.LEAD_STATUS_INDEX_NUMBER");
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;

    }


    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setConfig({
                ...config,
                [name]: value
            });
        } else {
            if (nameChild) {
                setConfig({
                    ...config,
                    [name]: {
                        [nameChild]: e?.value
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setConfig({
                    ...config,
                    [name]: e.value
                });
            }
        }
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleUpdate = () => {
        if (validate()) {
            if (isEdit) {
                // Call API update
                patchConfigLead(config)
                    .then((data: any) => {
                        if (data.code == 1) {
                            toast.success(data.message);
                            setShowPopup(false);
                            if (getList) {
                                getList();
                            }
                        } else {
                            toast.error(data.message);
                        }
                    }).catch((error) => {
                        console.log("error:", error)
                    })
            } else {
                // Call API create
                createConfigLead(config)
                    .then((data: any) => {
                        if (data.code == 1) {
                            toast.success(data.message);
                            setShowPopup(false);
                            if (getList) {
                                getList();
                            }
                        } else {
                            toast.error(data.message);
                        }
                    }).catch((error) => {
                        console.log("error:", error)
                    })
            }
        }
    }

    return (
        <>
            {/* Add User */}
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("CONFIG.UPDATE_LEAD_CONFIG") : t("CONFIG.CREATE_LEAD_CONFIG")}</h4>
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
                                                {t("CONFIG.LEAD_STATUS_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="leadStatusName"
                                                onChange={(e) => handleChange(e)} value={config?.leadStatusName} />
                                            {errors.leadStatusName && <p className="text-danger">{errors.leadStatusName}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONFIG.LEAD_STATUS_INDEX")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="number" className="form-control" name="leadStatusIndex"
                                                onChange={(e) => handleChange(e)} value={config?.leadStatusIndex} />
                                            {errors.leadStatusIndex && <p className="text-danger">{errors.leadStatusIndex}</p>}
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
                                        onClick={() => handleUpdate()}
                                    >
                                        {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add User */}
        </>
    )
}