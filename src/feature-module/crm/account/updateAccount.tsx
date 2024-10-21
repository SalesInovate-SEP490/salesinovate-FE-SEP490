import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { getAccountById, getListIndustries, getListType, getTotalAccounts, updateAccount } from "../../../services/account";
import { useTranslation } from "react-i18next";
import { Account } from "./type";
import { initAccount } from "./data";


export const UpdateAccount = (prop: any) => {
    const [account, setAccount] = useState<Account>(prop.data || initAccount);
    const [errors, setErrors] = useState<{ accountName?: string; phone?: string; type?: string; industry?: string }>({});
    const [types, setTypes] = useState<any>([]);
    const [industry, setIndustry] = useState<any>([]);
    const { t } = useTranslation();

    useEffect(() => {
        getListIndustries()
            .then(response => {
                if (response.code === 1) {
                    setIndustry(response.data.map((item: any) => {
                        return {
                            value: parseInt(item.industryId),
                            label: item.industryStatusName
                        }
                    }));
                }
            })
            .catch(err => {

            })
        getListType()
            .then(response => {
                if (response.code === 1) {
                    setTypes(response.data.map((item: any) => {
                        return {
                            value: parseInt(item.accountId),
                            label: item.accountName
                        }
                    }));
                }
            })
            .catch(err => {

            })
        getAccountById(prop.id)
            .then(response => {
                console.log("Response: detail ", response)
                if (response.code === 1) {
                    setAccount(response.data);
                }
            })
            .catch(err => { });
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
        if (e?.target) {
            const { name, value } = e.target;
            setAccount({
                ...account,
                [name]: value
            });
        } else {
            if (nameChild) {
                setAccount({
                    ...account,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setAccount({
                    ...account,
                    [name]: e.value
                });
            }
        }

    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const validate = () => {
        let tempErrors: { accountName?: string; phone?: string; type?: string; industry?: string } = {};
        if (!account.accountName) tempErrors.accountName = t("MESSAGE.ERROR.REQUIRED");
        // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (account.phone && !phoneRegex.test(account.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
        }
        if (!account.accountType.accountId) tempErrors.type = t("MESSAGE.ERROR.REQUIRED");
        if (!account.industry.industryId) tempErrors.industry = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleUpdate = () => {
        if (validate()) {
            account.roleId = account?.role?.roleId || 1;
            account.accountTypeId = account.accountType.accountId;
            account.industryId = account.industry.industryId;
            updateAccount(account)
                .then(response => {
                    if (response.code === 1) {
                        toast.success("Update Account successfully!");
                        prop.setShowPopup(false);
                        prop.getAccountDetail();
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
                        <h4>{t("LABEL.ACCOUNTS.UPDATE_ACCOUNT")}</h4>
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
                                                {t("LABEL.ACCOUNTS.ACCOUNT_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="accountName"
                                                onChange={(e) => handleChange(e)} value={account?.accountName} />
                                            {errors.accountName && <p className="text-danger">{errors.accountName}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.ACCOUNTS.PHONE")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="phone"
                                                onChange={(e) => handleChange(e)} value={account?.phone} />
                                            {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.TYPE")} <span className="text-danger">*</span>
                                        </label>
                                        <div className="form-wrap w-100">
                                            <Select
                                                className="select"
                                                options={types}
                                                styles={customStyles}
                                                value={types?.find((item: any) => item.value === account?.accountType?.accountId)}
                                                name="accountType"
                                                onChange={e => handleChange(e, 'accountType', 'accountTypeId')}
                                            />
                                            {errors.type && <p className="text-danger">{errors.type}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.ACCOUNTS.INDUSTRY")} <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select"
                                                options={industry}
                                                styles={customStyles}
                                                value={industry?.find((item: any) => item.value === account?.industry?.industryId)}
                                                name="industry"
                                                onChange={e => handleChange(e, 'industry', 'industryId')}
                                            />
                                            {errors.industry && <p className="text-danger">{errors.industry}</p>}
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