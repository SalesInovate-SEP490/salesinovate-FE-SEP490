import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { createConfigLead, patchConfigLead } from "../../services/config";
import { createConfigOpportunity, patchConfigOpportunity } from "../../services/oppConfig";
import Swal from "sweetalert2";

export const CreateOppConfig: React.FC<{
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
            Swal.showLoading();
            const newConfig = {
                ...config,
                isClose: config?.isClose?.value ? 1 : 0,
                id: config?.stageId
            }
            if (isEdit) {
                // Call API update
                patchConfigOpportunity(newConfig)
                    .then((data: any) => {
                        Swal.close();
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
                        Swal.close();
                        console.log("error:", error)
                    })
            } else {
                // Call API create
                createConfigOpportunity(newConfig)
                    .then((data: any) => {
                        Swal.close();
                        if (data.code == 1) {
                            toast.success(data.message);
                            if (getList) {
                                getList();
                            }
                        } else {
                            toast.error(data.message);
                        }
                    }).catch((error) => {
                        Swal.close();
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
                            onClick={() => setShowPopup(false)}
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
                                                {t("CONFIG.OPPORTUNITY_STAGE_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="stageName"
                                                onChange={(e) => handleChange(e)} value={config?.stageName} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONFIG.OPPORTUNITY_STAGE_INDEX")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="number" className="form-control" name="index"
                                                onChange={(e) => handleChange(e)} value={config?.index} />
                                        </div>
                                    </div>
                                    {/* probability */}
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONFIG.OPPORTUNITY_PROBABILITY")}
                                            </label>
                                            <input type="number" className="form-control" name="probability"
                                                onChange={(e) => handleChange(e)} value={config?.probability} />
                                        </div>
                                    </div>
                                    {/* isClose */}
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONFIG.OPPORTUNITY_IS_CLOSE_STAGE")}
                                            </label>
                                            <Select
                                                options={[
                                                    { value: true, label: "Yes" },
                                                    { value: false, label: "No" }
                                                ]}
                                                onChange={(e) => handleChange(e, "isClose")}
                                                value={{ value: config?.isClose, label: config?.isClose ? "Yes" : "No" }}
                                            />
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