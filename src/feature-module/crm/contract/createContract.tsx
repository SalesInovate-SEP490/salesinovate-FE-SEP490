import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createContract, getContractById, getListContractStatus, updateContract } from "../../../services/contract";
import Select, { StylesConfig } from "react-select";
import DatePicker from 'react-datepicker';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./contract.scss"
import { useSelector } from "react-redux";
import { getAccounts } from "../../../services/account";
import { filterPriceBook, getPriceBook } from "../../../services/priceBook";
import { convertDateToLocalDateTime, getTimeCorrectTimeZone } from "../../../utils/commonUtil";
import { getContacts } from "../../../services/Contact";

export const CreateContract: React.FC<{
    setShowPopup?: any, id?: any, getContractDetail?: any,
    showPopup?: any, getContract?: any, isEdit?: any
}> = ({ getContract, setShowPopup, showPopup, isEdit, id, getContractDetail }) => {
    const [contract, setContract] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [listOpen, setListOpen] = useState<any>({
        system: true,
        information: true,
        address: true,
        description: true,
        Signature: true
    });
    const [listSelect, setListSelect] = useState<any>({
        account: [],
        contact: [],
        company: [],
        priceBook: [],
        status: [],
    });
    const { t } = useTranslation();
    const userName = useState(useSelector((state: any) => state.userName));


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
            setContract({
                ...contract,
                [name]: type === "checkbox" ? checked : value
            });
        } else {
            if (nameChild) {
                setContract({
                    ...contract,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setContract({
                    ...contract,
                    [name]: e.value,
                });
            }
        }
    };

    useEffect(() => {
        getAccountSelect();
        getPriceBookSelect();
        getListStatusSelects();
        getContactSelect();
    }, []);

    useEffect(() => {
        if (isEdit && id) {
            getContractById(id)
                .then((res: any) => {
                    const data = res.data;
                    setContract(data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
    }, [id, isEdit, t]);

    const getAccountSelect = () => {
        getAccounts(0, 1000)
            .then((response) => {
                const data = response.data;
                const account = data?.items?.map((item: any) => {
                    return {
                        value: item?.accountId,
                        label: item?.accountName,
                    };
                });
                setListSelect((prev: any) => (
                    {
                        ...prev,
                        account: account,
                    }
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getListStatusSelects = () => {
        const status = [
            { value: 1, label: t("CONTRACT.ACTIVE") },
            { value: 2, label: t("CONTRACT.INACTIVE") },
        ];
        getListContractStatus()
            .then((response) => {
                const data = response.data;
                const status = data.map((item: any) => {
                    return {
                        value: item?.contractStatusId,
                        label: item?.contractStatusName,
                    };
                });
                setListSelect((prev: any) => (
                    {
                        ...prev,
                        status: status,
                    }
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getPriceBookSelect = () => {
        const param = {
            pageNo: 0,
            pageSize: 1000,
        }
        filterPriceBook(param)
            .then((response) => {
                const data = response?.data;
                const priceBook = data?.items?.map((item: any) => {
                    return {
                        value: item?.priceBookId,
                        label: item?.priceBookName,
                    };
                });
                setListSelect((prev: any) => (
                    {
                        ...prev,
                        priceBook: priceBook,
                    }
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getContactSelect = () => {
        const param = {
            pageNo: 0,
            pageSize: 1000,
        }
        getContacts(param)
            .then((response) => {
                const data = response?.data;
                const contact = data?.items?.map((item: any) => {
                    return {
                        value: item?.contactId,
                        label: item?.firstName + " " + item?.lastName,
                    };
                });
                setListSelect((prev: any) => (
                    {
                        ...prev,
                        contact: contact,
                    }
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const validate = () => {
        let tempErrors: any = {};
        // Check required fields
        if (!contract?.accountId) tempErrors.accountId = t("MESSAGE.ERROR.REQUIRED");
        if (!contract?.contractStartDate) tempErrors.startDate = t("MESSAGE.ERROR.REQUIRED");
        if (!contract?.contractTerm) tempErrors.contractTerm = t("MESSAGE.ERROR.REQUIRED");

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validate()) {
            const userId = localStorage.getItem("userId") || undefined;
            const contractStartDate = contract?.contractStartDate ? getTimeCorrectTimeZone(new Date(contract?.contractStartDate)) : null;
            const ownerExpirationNotice = contract?.ownerExpirationNotice ? getTimeCorrectTimeZone(new Date(contract?.ownerExpirationNotice)) : null;
            const customerSignedDate = contract?.customerSignedDate ? getTimeCorrectTimeZone(new Date(contract?.customerSignedDate)) : null;
            const companySignedDate = contract?.companySignedDate ? getTimeCorrectTimeZone(new Date(contract?.companySignedDate)) : null;
            const contractData = {
                userId: 1,
                contractStartDate: contractStartDate,
                contractTerm: contract?.contractTerm,
                ownerExpirationNotice: ownerExpirationNotice,
                specialTerms: contract?.specialTerms,
                description: contract?.description,
                accountId: contract?.accountId,
                priceBookId: contract?.priceBookId,
                billingAddressId: {
                    street: contract?.billingAddressId?.street,
                    city: contract?.billingAddressId?.city,
                    province: contract?.billingAddressId?.province,
                    postalCode: contract?.billingAddressId?.postalCode,
                    country: contract?.billingAddressId?.country,
                },
                shippingAddressId: {
                    street: contract?.shippingAddressId?.street,
                    city: contract?.shippingAddressId?.city,
                    province: contract?.shippingAddressId?.province,
                    postalCode: contract?.shippingAddressId?.postalCode,
                    country: contract?.shippingAddressId?.country,
                },
                contactId: contract?.contactId,
                customerSignedTitle: contract?.customerSignedTitle, 
                customerSignedDate: customerSignedDate,
                companyId: contract?.companyId,
                companySignedDate: companySignedDate,
                contractStatus: contract?.contractStatus,
            };

            if (isEdit) {
                updateContract(contractData, id)
                    .then((response) => {
                        console.log('Response:', response);
                        if (response.code === 1) {
                            toast.success("Update contract successfully!");
                            setShowPopup(false);
                            getContractDetail();
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                createContract(contractData)
                    .then((response) => {
                        if (response.code === 1) {
                            toast.success('Create contract successfully!');
                            setContract({});
                            setShowPopup(false);
                            getContract(1, 10);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    };

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("CONTRACT.EDIT_CONTRACT") : t("CONTRACT.CREATE_CONTRACT")}</h4>
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
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, information: !listOpen.information })}>
                                        <i className={!listOpen.information ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("CONTRACT.CONTRACT_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.information && <>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CONTRACT_OWNER")}
                                                </label>
                                                <div>
                                                    <span>{userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CONTRACT_START_DATE")}
                                                </label>
                                                <DatePicker
                                                    selected={contract?.contractStartDate}
                                                    onChange={(date: any) => handleChange({ value: date }, "contractStartDate")}
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                />
                                                {errors?.startDate && <p className="text-danger">{errors?.startDate}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CONTRACT_NUMBER")}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CONTRACT_TERM")}
                                                </label>
                                                <input type="text" className="form-control" name="contractTerm"
                                                    onChange={(e) => handleChange(e)} value={contract?.contractTerm} />
                                                {errors?.contractTerm && <p className="text-danger">{errors?.contractTerm}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.ACCOUNT_NAME")}
                                                </label>
                                                <Select
                                                    options={listSelect.account}
                                                    styles={customStyles}
                                                    onChange={(e) => handleChange(e, "account", "accountId")}
                                                    value={listSelect?.account?.find((item: any) => item.value === contract?.accountId)}
                                                />
                                                {errors?.accountId && <p className="text-danger">{errors?.accountId}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.OWNER_EXPIRATION_NOTICE")}
                                                </label>
                                                <DatePicker
                                                    selected={contract?.ownerExpirationNotice}
                                                    onChange={(date: any) => handleChange({ value: date }, "ownerExpirationNotice")}
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                />
                                                {errors?.ownerExpirationNotice && <p className="text-danger">{errors?.ownerExpirationNotice}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.STATUS")}
                                                </label>
                                                <Select
                                                    options={listSelect?.status}
                                                    styles={customStyles}
                                                    onChange={(e) => handleChange(e, "contractStatus")}
                                                    value={listSelect?.status?.find((item: any) => item.value === contract?.contractStatus)}
                                                />

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.PRICE_BOOK")}
                                                </label>
                                                <Select
                                                    options={listSelect?.priceBook}
                                                    styles={customStyles}
                                                    onChange={(e) => handleChange(e, "priceBook", "priceBookId")}
                                                    value={listSelect?.priceBook?.find((item: any) => item.value === contract?.priceBookId)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                                        <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("CONTRACT.ADDRESS_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.address && <>
                                    <label className="col-form-label">{t("CONTRACT.BILLING_ADDRESS")}</label>
                                    <div className="row">
                                        <div className='col-md-6'>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.BILLING_STREET")}
                                                        </label>
                                                        <input type="text" className="form-control" name="billingAddressId?.street"
                                                            onChange={(e) => handleChange(e)} value={contract?.billingAddressId?.street} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.BILLING_CITY")}
                                                        </label>
                                                        <input type="text" className="form-control" name="billingAddressId?.city"
                                                            onChange={(e) => handleChange(e)} value={contract?.billingAddressId?.city} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.BILLING_STATE_PROVINCE")}
                                                        </label>
                                                        <input type="text" className="form-control" name="billingAddressId?.province"
                                                            onChange={(e) => handleChange(e)} value={contract?.billingAddressId?.province} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.BILLING_ZIP_POSTAL_CODE")}
                                                        </label>
                                                        <input type="text" className="form-control" name="billingAddressId?.postalCode"
                                                            onChange={(e) => handleChange(e)} value={contract?.billingAddressId?.postalCode} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.BILLING_COUNTRY")}
                                                        </label>
                                                        <input type="text" className="form-control" name="billingAddressId?.country"
                                                            onChange={(e) => handleChange(e)} value={contract?.billingAddressId?.country} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.SHIPPING_STREET")}
                                                        </label>
                                                        <input type="text" className="form-control" name="shippingAddressId?.street"
                                                            onChange={(e) => handleChange(e)} value={contract?.shippingAddressId?.street} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.SHIPPING_CITY")}
                                                        </label>
                                                        <input type="text" className="form-control" name="shippingAddressId?.city"
                                                            onChange={(e) => handleChange(e)} value={contract?.shippingAddressId?.city} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.SHIPPING_STATE_PROVINCE")}
                                                        </label>
                                                        <input type="text" className="form-control" name="shippingAddressId?.province"
                                                            onChange={(e) => handleChange(e)} value={contract?.shippingAddressId?.province} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.SHIPPING_ZIP_POSTAL_CODE")}
                                                        </label>
                                                        <input type="text" className="form-control" name="shippingAddressId?.postalCode"
                                                            onChange={(e) => handleChange(e)} value={contract?.shippingAddressId?.postalCode} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {t("CONTRACT.SHIPPING_COUNTRY")}
                                                        </label>
                                                        <input type="text" className="form-control" name="shippingAddressId?.country"
                                                            onChange={(e) => handleChange(e)} value={contract?.shippingAddressId?.country} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, description: !listOpen.description })}>
                                        <i className={!listOpen.description ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("CONTRACT.DESCRIPTION_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.description && <>
                                    <div className="row">
                                        <div className='col-md-12'>
                                            <label className="col-form-label">
                                                {t("CONTRACT.SPECIAL_TERMS")}
                                            </label>
                                            <textarea
                                                name="specialTerms"
                                                className="form-control"
                                                onChange={(e) => handleChange(e)}
                                                value={contract?.specialTerms || ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-12'>
                                            <label className="col-form-label">
                                                {t("CONTRACT.DESCRIPTION")}
                                            </label>
                                            <textarea
                                                name="description"
                                                className="form-control"
                                                onChange={(e) => handleChange(e)}
                                                value={contract?.description || ''}
                                            />
                                        </div>
                                    </div>
                                </>}
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, Signature: !listOpen.Signature })}>
                                        <i className={!listOpen.Signature ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("CONTRACT.SIGNATURE_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.Signature && <>
                                    <div className="row">
                                        <div className='col-md-6'>
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CUSTOMER_SIGNED_BY")}
                                                </label>
                                                <Select
                                                    options={listSelect?.contact}
                                                    styles={customStyles}
                                                    onChange={(e) => handleChange(e, "contact", "contactId")}
                                                    value={listSelect?.contact?.find((item: any) => item.value === contract?.contactId)}
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CUSTOMER_SIGNED_DATE")}
                                                </label>
                                                <DatePicker
                                                    selected={contract?.customerSignedDate}
                                                    onChange={(date: any) => handleChange({ value: date }, "customerSignedDate")}
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.CUSTOMER_SIGNED_TITLE")}
                                                </label>
                                                <input type="text" className="form-control" name="customerSignedTitle"
                                                    onChange={(e) => handleChange(e)} value={contract?.customerSignedTitle} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-6'>
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTRACT.COMPANY_SIGNED_DATE")}
                                                </label>
                                                <DatePicker
                                                    selected={contract?.companySignedDate}
                                                    onChange={(date: any) => handleChange({ value: date }, "companySignedDate")}
                                                    className="form-control datetimepicker deals-details w-100"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                <div className="submit-button text-end mt-5">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        {t("CONTRACT.CANCEL")}
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