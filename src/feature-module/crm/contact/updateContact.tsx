import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { getContactById, patchContact } from "../../../services/Contact";
import { useTranslation } from "react-i18next";
import { Contact } from "./type";
import { initContact } from "./data";


export const UpdateContact = (prop: any) => {
    const [contact, setContact] = useState<any>({});
    const [errors, setErrors] = useState<{ firstName?: string; middleName?: string; lastName?: string; phone?: string; email?: string; mobile?: string }>({});
    const { t } = useTranslation();
    const [listOpen, setListOpen] = useState<any>({
        address: true
    });
    const [salutation, setSalutation] = useState<any>(null);

    useEffect(() => {
        getContactDetail();
    }, []);

    const getContactDetail = () => {
        getContactById(prop.id)
            .then(response => {
                console.log("Response: detail ", response);
            // if (response.code === 1) {
                setContact(response);
            // }
            })
            .catch(err => { });
    };

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
            setContact({
                ...contact,
                [name]: value
            });
        } else {
            if (nameChild) {
                setContact({
                    ...contact,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setContact({
                    ...contact,
                    [name]: e.value
                });
            }
        }

    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const validate = () => {
        let tempErrors: {  firstName?: string; middleName?: string; lastName?: string; phone?: string; email?: string; mobile?: string } = {};
        const contactName = `${contact.firstName} ${contact.middleName} ${contact.lastName}`;
         // Check required fields
         if (!contact.firstName?.trim()) tempErrors.firstName = t("MESSAGE.ERROR.REQUIRED");
         if (!contact.lastName?.trim()) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
         if (!contact.phone?.trim()) tempErrors.phone = t("MESSAGE.ERROR.REQUIRED");
         if (!contact.email?.trim()) tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (contact.phone && !phoneRegex.test(contact.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
        }
        // Check mobile pattern Vietnamese: 10 digits, start with 0, not required
        const mobileRegex = /^(84|0[3|5|7|8|9])+([0-9]{8})$/;
        if (contact.mobile && !mobileRegex.test(contact.mobile)) {
            tempErrors.mobile = t("MESSAGE.ERROR.INVALID_MOBILE_VIETNAMESE");
        }
        // check form email 
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (contact.email && !emailRegex.test(contact.email)) {
            tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleUpdate = () => {
        // if (validate()) {
            // contact.roleId = contact?.role?.roleId || 1;
            patchContact(contact)
                .then(response => {
                    // if (response.code === 1) {
                        toast.success("Update Contact successfully!");
                        prop.getContactDetail();
                        prop.setShowPopup(false);
                        prop.getLeads(1,10);

                    // }
                })
                .catch(err => { 
                    // toast.error("Failed to update contact.");
                });
        // }
    }

    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.CONTACTS.UPDATE_CONTACT")}</h4>
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
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONTACT.FIRST_NAME")} 
                                            </label>
                                            <input type="text" className="form-control" name="firstName"
                                                onChange={(e) => handleChange(e)} value={contact?.firstName} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.MIDDLE_NAME")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="middleName"
                                                onChange={(e) => handleChange(e)} value={contact?.middleName} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.LAST_NAME")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="lastName"
                                                onChange={(e) => handleChange(e)} value={contact?.lastName} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.TITLE")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="title"
                                                onChange={(e) => handleChange(e)} value={contact?.title} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.PHONE")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="phone"
                                                onChange={(e) => handleChange(e)} value={contact?.phone} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.EMAIL")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="email"
                                                onChange={(e) => handleChange(e)} value={contact?.email} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.MOBILE")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="mobile"
                                                onChange={(e) => handleChange(e)} value={contact?.mobile} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.DEPARTMENT")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="department"
                                                onChange={(e) => handleChange(e)} value={contact?.department} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.FAX")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="fax"
                                                onChange={(e) => handleChange(e)} value={contact?.fax} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CONTACT.SUFFIX")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="suffix"
                                                onChange={(e) => handleChange(e)} value={contact?.suffix} />
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
                                        // onClick={() => handleUpdate()}
                                        onClick={handleUpdate}
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