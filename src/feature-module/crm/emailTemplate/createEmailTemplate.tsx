import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { EmailTemplate } from "./type";
import { createEmailTemplate, getListEmailParam } from "../../../services/emailTemplate";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from '../../../core/data/quill/format';

export const CreateEmailTemplate = (prop: any) => {
    const initialState = {
        sendTo: "",
        mailSubject: "",
        htmlContent: "",
        userId: "",
        emailTemplateId: 0,
        id: 0,
        isDeleted: 0
    };

    const [email, setEmail] = useState<EmailTemplate>(prop.data || initialState);
    const [errors, setErrors] = useState<{ sendTo?: string; mailSubject?: string; htmlContent?: string; }>({});
    const [listParam, setListParam] = useState<any>([]);
    const { t } = useTranslation();

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setEmail((prevEmail) => ({
            ...prevEmail,
            [name]: value
        }));
    };

    const handleQuillChange = (content: string) => {
        setEmail((prevEmail) => ({
            ...prevEmail,
            htmlContent: content
        }));
    };

    const addParam = (param: string) => {
        setEmail((prevEmail) => ({
            ...prevEmail,
            htmlContent: prevEmail.htmlContent + param
        }));
    }

    const validate = () => {
        let tempErrors: { sendTo?: string; mailSubject?: string; htmlContent?: string; } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!email.sendTo) {
        //     tempErrors.sendTo = t("MESSAGE.ERROR.REQUIRED");
        // } else if (!emailRegex.test(email.sendTo)) {
        //     tempErrors.sendTo = t("MESSAGE.ERROR.INVALID_EMAIL");
        // }
        if (!email.mailSubject) tempErrors.mailSubject = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        if (prop.setShowPopup) {
            prop.setShowPopup(!prop.showPopup);
        } else {
            console.error("prop.setShowPopup is not defined");
        }
    };

    const handleCreate = () => {
        if (validate()) {
            email.userId = localStorage.getItem("userId") ? (localStorage.getItem("userId") || "0") : "";
            createEmailTemplate(email)
                .then(response => {
                    if (response.code === 1) {
                        toast.success("Create email successfully!");
                        setEmail(initialState);
                        if (prop.setShowPopup) {
                            prop.setShowPopup(false);
                        }
                        if (prop.getEmails) {
                            prop.getEmails(1, 10);
                        }
                    }
                })
                .catch(err => {
                    console.error("Error creating email template", err);
                    toast.error("Failed to create email template");
                });
        }
    };

    useEffect(() => {
        getListEmailParams();
    }, [])

    const getListEmailParams = () => {
        getListEmailParam()
            .then(response => {
                if (response.code === 1) {
                    setListParam(response.data);
                }
            })
            .catch(err => {
                console.error("Error getting email params", err);
            });
    }


    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.EMAIL_TEMPLATE.ADD_EMAIL")}</h4>
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
                            <form >
                                <div className="row">
                                    {/* <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.EMAIL_TEMPLATE.SEND_TO")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="sendTo"
                                                onChange={handleChange} value={email.sendTo || ''} />
                                            {errors.sendTo && <div className="text-danger">{errors.sendTo}</div>}
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.EMAIL_TEMPLATE.MAIL_SUBJECT")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="mailSubject"
                                                onChange={handleChange} value={email.mailSubject || ''} />
                                            {errors.mailSubject && <div className="text-danger">{errors.mailSubject}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.EMAIL_TEMPLATE.HTML_VALUE")}
                                            </label>
                                            <ReactQuill
                                                value={email.htmlContent}
                                                onChange={handleQuillChange}
                                                modules={modules}
                                                formats={formats}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Param</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listParam.map((param: any) => (
                                                <tr key={param.id}>
                                                    <td>{param.param}</td>
                                                    <td>{param.description}</td>
                                                    <td>
                                                        <button
                                                            className=""
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                addParam(param.param);
                                                            }}
                                                        >
                                                            Add
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={togglePopup} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleCreate}
                                    >
                                        Create
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
