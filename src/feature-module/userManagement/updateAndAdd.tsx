import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getAllUserByRole, getUsers, createUser, updateUser, getUserById, addRoleToUser, addRoleToUserByAdmin } from "../../services/user";
import { User } from "./type";
import Select, { StylesConfig } from "react-select";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./user.scss"

const roleOptions = [
    { value: "1", label: 'Administrator' },
    { value: "2", label: 'Marketing' },
    { value: "3", label: 'SDR' },
    { value: "4", label: 'Sales' },
    { value: "5", label: 'Sales Manager' }
];

export const UpdateAndAdd: React.FC<{
    setShowPopup?: any, id?: any, getUser?: any,
    showPopup?: any, isEdit?: any
}> = ({ getUser, setShowPopup, showPopup, isEdit, id }) => {
    const [title, setTitle] = useState<any>("");
    const [user, setUser] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();
    const [selectedRoles, setSelectedRoles] = useState<any>([]);

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
            setUser({
                ...user,
                [name]: value
            });
        } else {
            if (nameChild) {
                setUser({
                    ...user,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setUser({
                    ...user,
                    [name]: e.value
                });
            }
        }

    };

    useEffect(() => {
        if (isEdit) {
            getUserById(id)
                .then((res: any) => {
                    if (res.code === 1) {
                        const data = res.data;
                        setUser(data);
                        setSelectedRoles(data.roles.map((role: any) => roleOptions.find(option => option.value === role.id)));
                        console.log("data check: ", selectedRoles);
                    }
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } else {
            setUser({
                userName: "",
                firstName: "",
                lastName: "",
                email: "",
                passWord: "",
                phone: ""
            });
            setSelectedRoles([]);
        }
    }, [id, isEdit, t, showPopup]);

    useEffect(() => {
        if (!showPopup) {
            setUser({
                userName: "",
                firstName: "",
                lastName: "",
                email: "",
                passWord: "",
                phone: ""
            });
            setSelectedRoles([]);
        }
    }, [showPopup])

    const validate = () => {
        let tempErrors: any = {};
        // Check required fields
        if (!user.userName?.trim()) tempErrors.userName = t("MESSAGE.ERROR.REQUIRED");
        if (!user.passWord?.trim() && !isEdit) tempErrors.passWord = t("MESSAGE.ERROR.REQUIRED");
        if (!user.lastName?.trim()) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
        if (!user.email?.trim()) tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        if (selectedRoles.length === 0) tempErrors.roles = t("MESSAGE.ERROR.REQUIRED");
        // Check email field
        if (!user.email?.trim()) {
            tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user.email.trim())) {
                tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
            }
        }
        // Check roles field
        if (selectedRoles.length === 0) {
            tempErrors.roles = t("MESSAGE.ERROR.REQUIRED");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validate()) {
            const UserData = {
                userId: id,
                userName: user?.userName,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                passWord: user?.passWord ?? undefined,
                phone: user?.phone,
            }
            if (isEdit) {
                updateUser(UserData)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Update user successfully!");
                            setShowPopup(false);
                            if (getUser) {
                                getUser();
                            }
                            if (selectedRoles.length > 0) {
                                // convert label to lower case, keep object
                                const selectedRolesChange = selectedRoles.map((role: any) => {
                                    return {
                                        id: role?.value,
                                        name: role?.label?.toLowerCase()
                                    }
                                });
                                addRoleToUserByAdmin(id, selectedRolesChange)
                                    .then(response => {
                                    })
                                    .catch(err => {
                                    });
                            }
                        } else {
                            toast.error("Update user failed!");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                createUser(UserData)
                    .then(response => {
                        if (response.code === 1) {
                            setUser({
                                userName: "",
                                firstName: "",
                                lastName: "",
                                email: "",
                                passWord: ""
                            })
                            setSelectedRoles([]);
                            setShowPopup(false);
                            getUser();
                        } else {
                            toast.error("Create user failed!");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("LABEL.USER.EDIT_USER") : t("LABEL.USER.ADD_NEW_USER")}</h4>
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
                                                {t("LABEL.USER.FIRST_NAME")}
                                            </label>
                                            <input type="text" className="form-control" name="firstName"
                                                onChange={(e) => handleChange(e)} value={user?.firstName} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.LAST_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="lastName"
                                                onChange={(e) => handleChange(e)} value={user?.lastName} />
                                            {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.USER_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="userName"
                                                onChange={(e) => handleChange(e)} value={user?.userName}
                                                autoComplete="new-password"
                                            />
                                            {errors.userName && <p className="text-danger">{errors.userName}</p>}
                                        </div>
                                    </div>
                                </div>
                                {/* // passWord */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.PASSWORD")} {isEdit ? "" : <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="passWord"
                                                onChange={(e) => handleChange(e)} value={user?.passWord}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.EMAIL")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="email"
                                                onChange={(e) => handleChange(e)} value={user?.email} />
                                            {errors.email && <p className="text-danger">{errors.email}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.PHONE")}
                                            </label>
                                            <input type="text" className="form-control" name="phone"
                                                onChange={(e) => handleChange(e)} value={user?.phone} />
                                            {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.USER.ROLES")} <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                isMulti
                                                value={selectedRoles}
                                                onChange={setSelectedRoles}
                                                options={roleOptions}
                                                styles={customStyles}
                                            />
                                            {errors.roles && <p className="text-danger">{errors.roles}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end mt-5">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        {t("LABEL.USER.CANCEL")}
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