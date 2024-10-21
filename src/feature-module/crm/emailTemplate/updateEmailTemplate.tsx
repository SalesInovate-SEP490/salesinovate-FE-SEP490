import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { EmailTemplate } from "./type";
import { createEmailTemplate, getEmailTemplate, updateEmailTemplate } from "../../../services/emailTemplate";
import ReactQuill from 'react-quill';
import { formats, modules } from "../../../core/data/quill/format";

export const UpdateEmailTemplate = (prop: any) => {
    const [email, setEmail] = useState<EmailTemplate>(prop.data);
    const [errors, setErrors] = useState<{ sendTo?: string; mailSubject?: string; htmlContent?: string; }>({});
    const { t } = useTranslation();

    useEffect(() => {
        getEmailTemplate(prop.id)
            .then(response => {
                setEmail(response.data);
            })
            .catch(err => { });
    }, [])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setEmail({
                ...email,
                [name]: value
            });
        }
    };

    const handleQuillChange = (content: string) => {
        setEmail({
            ...email,
            htmlContent: content
        });
    };

    const validate = () => {
        let tempErrors: { sendTo?: string; mailSubject?: string; htmlContent?: string; } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!email.sendTo) {
        //     tempErrors.sendTo = t("MESSAGE.ERROR.REQUIRED");
        // } else if (!emailRegex.test(email.sendTo)) {
        //     tempErrors.sendTo = t("MESSAGE.ERROR.INVALID_EMAIL");
        // }
        console.log("123", email.htmlContent)
        if (!email.mailSubject) tempErrors.mailSubject = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };


    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            console.log(email);
            email.userId = localStorage.getItem("userId") || "1";
            email.id = email.emailTemplateId;
            updateEmailTemplate(email)
                .then(response => {
                    if (response.code === 1) {
                        toast.success("Update email template successfully!");
                        prop.setShowPopup(false);
                        prop.getDetail();
                    }
                })
                .catch(err => { });
        }
    }

    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.EMAIL_TEMPLATE.UPDATE_EMAIL")}</h4>
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
                                    {/* <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.EMAIL_TEMPLATE.SEND_TO")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="sendTo"
                                                onChange={(e) => handleChange(e)} value={email?.sendTo} />
                                            {errors.sendTo && <div className="text-danger">{errors.sendTo}</div>}
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.EMAIL_TEMPLATE.MAIL_SUBJECT")} <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="mailSubject"
                                                onChange={(e) => handleChange(e)} value={email?.mailSubject} />
                                            {errors.mailSubject && <div className="text-danger">{errors.mailSubject}</div>}

                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.EMAIL_TEMPLATE.HTML_VALUE")}
                                            </label>
                                            <ReactQuill
                                                value={email?.htmlContent}
                                                onChange={handleQuillChange}
                                                formats={formats}
                                                modules={modules}
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
                                        onClick={() => handleCreate()}
                                    >
                                        {t("ACTION.UPDATE")}
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