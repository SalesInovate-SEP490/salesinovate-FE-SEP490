import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { User } from "./type";
import Select, { StylesConfig } from "react-select";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getMyProfileForUser, patchUser } from "../../services/user";

export const UpdateProfile: React.FC<{
    setShowPopup?: any, getProfileDetail?: any,
    showPopup?: any, getProfile?: any, isEdit?: any
}> = ({ getProfile, setShowPopup, showPopup, isEdit, getProfileDetail }) => {
    const [title, setTitle] = useState<any>("");
    const [user, setUser] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();
    const [listOpen, setListOpen] = useState<any>({
        edit: false,
        about: true,
        address: true
    });

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
            const { name, value, type, checked } = e.target;
            setUser({
                ...user,
                [name]: type === "checkbox" ? checked : value
            });
        } else {
            if (nameChild) {
                setUser({
                    ...user,
                    [name]: {
                        ...user[name],
                        [nameChild]: e.value,
                        name: e.label
                    },
                });
            } else {
                setUser({
                    ...user,
                    [name]: e.value,
                });
            }
        }
    };
    

    useEffect(() => {
        if (isEdit) {
            setTitle(t("USER_MANAGE.EDIT_PROFILE"));
            getMyProfileForUser() 
                .then((res: any) => {
                    const data = res.data;
                    setUser(data);
                    console.log("data check: ", data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } 
    }, [isEdit, t]);
    

    const validate = () => {
        let tempErrors: {
            email?: string;
            phone?: string;
            lastName?: string;
        } = {};

        if (!user.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
        // check email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email) {
            tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        } else if (!emailPattern.test(user.email)) {
            tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
        }
        // check phone number
        const phonePattern = /^0[35789][0-9]{8}$/;
        if (!user.phone) {
            tempErrors.phone = t("MESSAGE.ERROR.REQUIRED");
        } else if (!phonePattern.test(user.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleUpdate = () => {
        if (validate()) {
            const ProfileUpdate = {
                userId: user?.userId,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                phone: user?.phone,
                background: user?.background,
                addressInformation: {
                    addressInformationId: user?.addressInformationId,
                    street: user?.street,
                    city: user?.city,
                    province: user?.province,
                    postalCode: user?.postalCode,
                    country: user?.country
                }
            }
            if (isEdit) {
                patchUser(ProfileUpdate)
                    .then(response => {
                        console.log("Response:", response);
                        if (response.code === 1) {
                            toast.success("Update success");
                            setShowPopup(false);
                            getProfileDetail();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{title}</h4>
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
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("USER_MANAGE.FIRST_NAME")}
                                            </label>
                                            <input type="text" className="form-control" name="firstName"
                                                onChange={(e) => handleChange(e)} value={user?.firstName} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("USER_MANAGE.LAST_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="lastName"
                                                onChange={(e) => handleChange(e)} value={user?.lastName} />
                                            {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("USER_MANAGE.EMAIL")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="email" className="form-control" name="email"
                                                onChange={(e) => handleChange(e)} value={user?.email} />
                                            {errors.email && <p className="text-danger">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("USER_MANAGE.PHONE")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="number" className="form-control" name="phone"
                                                onChange={(e) => handleChange(e)} value={user?.phone} />
                                            {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-ms-12 label-detail mb-3'>
                                    <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                                        <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("USER_MANAGE.ADDRESS_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.address && <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("USER_MANAGE.STREET")}
                                                </label>
                                                <input type="text" className="form-control" name="street"
                                                    onChange={(e) => handleChange(e)} value={user?.addressInformation?.street} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("USER_MANAGE.CITY")}
                                                </label>
                                                <input type="text" className="form-control" name="city"
                                                    onChange={(e) => handleChange(e)} value={user?.addressInformation?.city} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("USER_MANAGE.PROVINCE")}
                                                </label>
                                                <input type="text" className="form-control" name="province"
                                                    onChange={(e) => handleChange(e)} value={user?.addressInformation?.province} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("USER_MANAGE.POSTAL_CODE")}
                                                </label>
                                                <input type="text" className="form-control" name="postalCode"
                                                    onChange={(e) => handleChange(e)} value={user?.addressInformation?.postalCode} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("USER_MANAGE.COUNTRY")}
                                                </label>
                                                <input type="text" className="form-control" name="country"
                                                    onChange={(e) => handleChange(e)} value={user?.addressInformation?.country} />
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                <div className="submit-button text-end mt-5">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        {t("USER_MANAGE.CANCEL")}
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
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