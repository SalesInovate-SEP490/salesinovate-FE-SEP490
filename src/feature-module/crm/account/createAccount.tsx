import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { Account } from "./type";
import { useTranslation } from "react-i18next";
import { createAccount, getAccountById, getAccounts, getListIndustries, getListType, patchAccount } from "../../../services/account";
import { initAccount } from "./data";
import { getIndustryList } from "../../../services/lead";
import { accountMaxLength } from "../../../core/data/validate";
import { formatString } from "../../../utils/commonUtil";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";



export const CreateAccount: React.FC<{
    data?: any; showPopup: boolean; setShowPopup: any; getList?: any;
    id?: any; isEdit?: any; getDetail?: any;
}> = ({ data, showPopup, setShowPopup, getList, id, isEdit, getDetail }) => {
    const [account, setAccount] = useState<any>(data || initAccount);
    const [errors, setErrors] = useState<any>({});
    const [types, setTypes] = useState<any>([]);
    const [industry, setIndustry] = useState<any>([]);
    const [listAccount, setListAccount] = useState<any>([]);
    const { t } = useTranslation();
    const userName = useState(useSelector((state: any) => state.userName));


    useEffect(() => {
        getIndustryList()
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
                            value: item.accountTypeId,
                            label: item.accountTypeName
                        }
                    }));
                }
            })
            .catch(err => {

            })
        getAccounts(1, 100)
            .then(response => {
                if (response.code === 1) {
                    setListAccount(
                        response.data.items.map((item: any) => ({
                            value: item.accountId,
                            label: item.accountName
                        })));
                }
            })
            .catch(err => {
                // Handle error
            });
    }, [])

    useEffect(() => {
        if (isEdit && showPopup) {
            Swal.showLoading();
            getAccountById(id)
                .then(response => {
                    Swal.close();
                    if (response.code === 1) {
                        setAccount({
                            ...response.data,
                            typeId: response?.data?.accountType?.accountTypeId,
                            accountTypeId: response?.data?.accountType?.accountTypeId,
                            industryId: response?.data?.industry?.industryId,
                        });
                    }
                })
                .catch(error => {
                    // Handle error
                    Swal.close();
                })
        }
    }, [showPopup])

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
        console.log("E: ", e, name);
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

    const handleChangeAddress = (e: any, fieldName: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setAccount({
                ...account,
                [fieldName]: {
                    ...account[fieldName],
                    [name]: value
                }
            });
        }
    }

    const validate = () => {
        let tempErrors: {
            accountName?: string; phone?: string; type?: string; industry?: string;
            website?: string; description?: string; employees?: string;
            shippingInformation?: { street?: string; city?: string; province?: string; postalCode?: string; country?: string; };
            billingInformation?: { street?: string; city?: string; province?: string; postalCode?: string; country?: string; };
        } = {};
        if (!account.accountName) tempErrors.accountName = t("MESSAGE.ERROR.REQUIRED");
        // Check phone pattern vietnamese : 10 digits, start with 0, not required
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (account.phone && !phoneRegex.test(account.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
        }
        if (!account?.accountTypeId) tempErrors.type = t("MESSAGE.ERROR.REQUIRED");
        if (!account?.industryId) tempErrors.industry = t("MESSAGE.ERROR.REQUIRED");
        if (account?.accountName && account?.accountName?.length > accountMaxLength?.accountName) tempErrors.accountName = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.accountName);
        if (account?.website && account?.website?.length > accountMaxLength?.website) tempErrors.website = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.website);
        if (account?.description && account?.description?.length > accountMaxLength?.description) tempErrors.description = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.description);
        if (account?.employees && account?.employees?.length > accountMaxLength?.noEmployee) tempErrors.employees = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.noEmployee);
        if (account?.billingInformation?.street && account?.billingInformation?.street?.length > accountMaxLength.street) tempErrors.billingInformation = { ...tempErrors.billingInformation, street: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.street) };
        if (account?.billingInformation?.city && account?.billingInformation?.city?.length > accountMaxLength.city) tempErrors.billingInformation = { ...tempErrors.billingInformation, city: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.city) };
        if (account?.billingInformation?.province && account?.billingInformation?.province?.length > accountMaxLength.province) tempErrors.billingInformation = { ...tempErrors.billingInformation, province: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.province) };
        if (account?.billingInformation?.postalCode && account?.billingInformation?.postalCode?.length > accountMaxLength.postalCode) tempErrors.billingInformation = { ...tempErrors.billingInformation, postalCode: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.postalCode) };
        if (account?.billingInformation?.country && account?.billingInformation?.country?.length > accountMaxLength.country) tempErrors.billingInformation = { ...tempErrors.billingInformation, country: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.country) };
        if (account?.shippingInformation?.street && account?.shippingInformation?.street?.length > accountMaxLength.street) tempErrors.shippingInformation = { ...tempErrors.shippingInformation, street: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.street) };
        if (account?.shippingInformation?.city && account?.shippingInformation?.city?.length > accountMaxLength.city) tempErrors.shippingInformation = { ...tempErrors.shippingInformation, city: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.city) };
        if (account?.shippingInformation?.province && account?.shippingInformation?.province?.length > accountMaxLength.province) tempErrors.shippingInformation = { ...tempErrors.shippingInformation, province: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.province) };
        if (account?.shippingInformation?.postalCode && account?.shippingInformation?.postalCode?.length > accountMaxLength.postalCode) tempErrors.shippingInformation = { ...tempErrors.shippingInformation, postalCode: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.postalCode) };
        if (account?.shippingInformation?.country && account?.shippingInformation?.country?.length > accountMaxLength.country) tempErrors.shippingInformation = { ...tempErrors.shippingInformation, country: formatString(t("MESSAGE.ERROR.MAX_LENGTH"), accountMaxLength.country) };
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            Swal.showLoading();
            const newAccount = {
                accountName: account?.accountName,
                parentAccountId: account?.parentAccountId,
                accountTypeId: account?.accountTypeId,
                phone: account?.phone,
                industryId: account?.industryId,
                website: account?.website,
                description: account?.description,
                noEmployee: account?.employees,
                billingInformation: {
                    street: account?.billingInformation?.street,
                    city: account?.billingInformation?.city,
                    province: account?.billingInformation?.province,
                    postalCode: account?.billingInformation?.postalCode,
                    country: account?.billingInformation?.country
                },
                shippingInformation: {
                    street: account?.shippingInformation?.street,
                    city: account?.shippingInformation?.city,
                    province: account?.shippingInformation?.province,
                    postalCode: account?.shippingInformation?.postalCode,
                    country: account?.shippingInformation?.country
                },
            }
            if (isEdit) {
                patchAccount(newAccount, id)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Update account successfully!");
                            setShowPopup(false);
                            getDetail();
                        }
                    })
                    .catch(error => {

                    })
            } else {
                createAccount(newAccount)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Create account successfully!");
                            setShowPopup(false);
                            getList(1, 10);
                            setAccount(initAccount);
                        }
                    })
                    .catch(err => { });
            }
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("LABEL.ACCOUNTS.UPDATE_ACCOUNT") : t("LABEL.ACCOUNTS.CREATE_ACCOUNT")}</h4>
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
                                            {t("LABEL.ACCOUNTS.ACCOUNT_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("LABEL.ACCOUNTS.ACCOUNT_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="accountName"
                                                onChange={(e) => handleChange(e)} value={account?.accountName} />
                                            {errors.accountName && <div className="text-danger">{errors.accountName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.PARENT_ACCOUNT")}
                                        </label>
                                        <div className="form-wrap w-100">
                                            <Select
                                                className="select"
                                                options={listAccount}
                                                styles={customStyles}
                                                value={listAccount?.find((item: any) => item.value === account?.parentAccountId)}
                                                name="parentAccountId"
                                                onChange={e => handleChange(e, 'parentAccount', 'parentAccountId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="col-form-label">
                                            {t("LABEL.ACCOUNTS.ACCOUNT_OWNER")}
                                        </label>
                                        <div className="form-wrap w-100">
                                            <span>{userName}</span>
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
                                            {errors.type && <div className="text-danger">{errors.type}</div>}
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
                                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
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
                                            {errors.industry && <div className="text-danger">{errors.industry}</div>}
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("LABEL.ACCOUNTS.ADDITIONAL_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.ACCOUNTS.WEBSITE")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="website"
                                                onChange={(e) => handleChange(e)} value={account?.website} />
                                            {errors.website && <div className="text-danger">{errors.website}</div>}
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
                                            {errors.phone && <div className="text-danger">{errors.phone}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.ACCOUNTS.DESCRIPTION")}
                                                </label>
                                            </div>
                                            <textarea className="form-control" name="description"
                                                onChange={(e) => handleChange(e)} value={account?.description} />
                                            {errors.description && <div className="text-danger">{errors.description}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("LABEL.ACCOUNTS.EMPLOYEES")}
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="employees"
                                                onChange={(e) => handleChange(e)} value={account?.employees} />
                                            {errors.employees && <div className="text-danger">{errors.employees}</div>}
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("LABEL.ACCOUNTS.ADDRESS_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <span className="col-md-12">{t("LABEL.ACCOUNTS.BILLING_ADDRESS")}</span>
                                            <div className="col-md-12">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Street</label>
                                                    <textarea className="form-control" name="street"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={account?.billingInformation?.street} >
                                                    </textarea>
                                                    {errors.billingInformation?.street && <div className="text-danger">{errors.billingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={account?.billingInformation?.city} />
                                                    {errors.billingInformation?.city && <div className="text-danger">{errors.billingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={account?.billingInformation?.province} />
                                                    {errors.billingInformation?.province && <div className="text-danger">{errors.billingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={account?.billingInformation?.postalCode} />
                                                    {errors.billingInformation?.postalCode && <div className="text-danger">{errors.billingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={account?.billingInformation?.country} />
                                                    {errors.billingInformation?.country && <div className="text-danger">{errors.billingInformation.country}</div>}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <span className="col-md-12">{t("LABEL.ACCOUNTS.SHIPPING_ADDRESS")}</span>
                                            <div className="col-md-12">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Street</label>
                                                    <textarea className="form-control" name="street"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={account?.shippingInformation?.street} >
                                                    </textarea>
                                                    {errors.shippingInformation?.street && <div className="text-danger">{errors.shippingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={account?.shippingInformation?.city} />
                                                    {errors.shippingInformation?.city && <div className="text-danger">{errors.shippingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={account?.shippingInformation?.province} />
                                                    {errors.shippingInformation?.province && <div className="text-danger">{errors.shippingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={account?.shippingInformation?.postalCode} />
                                                    {errors.shippingInformation?.postalCode && <div className="text-danger">{errors.shippingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={account?.shippingInformation?.country} />
                                                    {errors.shippingInformation?.country && <div className="text-danger">{errors.shippingInformation.country}</div>}
                                                </div>
                                            </div>
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