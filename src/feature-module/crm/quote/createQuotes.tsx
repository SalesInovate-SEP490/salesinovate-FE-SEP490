import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { patchPriceBook } from "../../../services/priceBook";
import "./quote.scss"
import Select, { StylesConfig } from "react-select";
import DatePicker from 'react-datepicker';
import { getListContact } from "../../../services/Contact";
import { createQuoteOpportunity, detailQuoteOpportunity, getListQuoteStatus, updateQuote } from "../../../services/quote";

export const CreateQuotes: React.FC<{
    showPopup?: boolean;
    setShowPopup?: any;
    getList?: any;
    isEdit?: boolean;
    id?: any;
    getDetail?: any;
    opportunity?: any;
    account?: any;
}> = ({ showPopup, setShowPopup, getList, isEdit, id, getDetail, opportunity, account }) => {
    const [quote, setQuote] = useState<any>({});
    const [listSelect, setListSelect] = useState<any>({
        quoteStatus: [],
        contacts: [],
    });
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (account) {
            setQuote({
                ...quote,
                accountId: account?.accountId,
                accountName: account?.accountName,
                billingInformation: account?.billingInformation,
                shippingInformation: account?.shippingInformation,
            });
        }
    }, [account])

    useEffect(() => {
        const param = {
            currentPage: 1,
            perPage: 100
        }
        getListContact(param)
            .then(response => {
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        contacts: response?.data?.items?.map((item: any) => {
                            return {
                                value: item.contactId,
                                label: (item?.firstName ?? "") + ' ' + (item?.lastName ?? "")
                            }
                        }),
                    }
                });
            })
            .catch(err => {
                // toast.error("Failed to get contact list.");
            });

        getListQuoteStatus()
            .then(response => {
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        quoteStatus: response?.data?.map((item: any) => {
                            return {
                                value: item.quoteStatusId,
                                label: item.quoteStatusName
                            }
                        }),
                    }
                });
            })
            .catch(err => {
                // toast.error("Failed to get quote status list.");
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        quoteStatus: [
                            { value: 1, label: 'Draft' },
                            { value: 2, label: 'Needs Review' },
                            { value: 3, label: 'In Review' },
                            { value: 4, label: 'Approved' },
                            { value: 5, label: 'Rejected' },
                            { value: 6, label: 'Presented' },
                            { value: 7, label: 'Accepted' },
                        ]
                    }
                })
            });

    }, [id])

    useEffect(() => {
        if (isEdit) {
            detailQuoteOpportunity(id)
                .then((res: any) => {
                    setQuote({
                        ...res?.data,
                        statusQuoteOpportunityId: res?.data?.quoteStatus?.quoteStatusId,
                    });
                })
                .catch(err => {
                    // toast.error("Failed to get price book.");
                });
        }
    }, [showPopup])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log(e);
        if (e?.target) {
            const { name, value } = e.target;
            setQuote({
                ...quote,
                [name]: value,
            });
        } else {
            if (nameChild) {
                setQuote({
                    ...quote,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setQuote({
                    ...quote,
                    [name]: e.value,
                });
            }
        }
    };

    const validate = () => {
        let tempErrors: any = {};
        // Check required fields
        // if (!quote.contractNumber) tempErrors.contractNumber = t("MESSAGE.ERROR.REQUIRED");
        // if (!quote.accountId) tempErrors.accountId = t("MESSAGE.ERROR.REQUIRED");
        // if (!quote.quoteStartDate) tempErrors.quoteStartDate = t("MESSAGE.ERROR.REQUIRED");
        // if (!quote.quoteStatusId) tempErrors.quoteStatusId = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            const newQuote = {
                quoteName: quote?.quoteName,
                expirationDate: quote?.expirationDate,
                quoteStatus: quote?.statusQuoteOpportunityId,
                description: quote?.description,
                contactId: quote?.contactId,
                billingInformation: quote?.billingInformation,
                shippingInformation: quote?.shippingInformation,
                tax: quote?.tax,
                shippingHandling: quote?.shippingHandling,
                grandTotal: quote?.grandTotal || 0,
                email: quote?.email,
                phone: quote?.phone,
                fax: quote?.fax,
                opportunityId: opportunity?.opportunityId,
                accountName: account?.accountName,
                discount: 0,
            }
            if (isEdit) {
                updateQuote(id, newQuote)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Update price book successfully!");
                            setShowPopup(false);
                            getDetail(id);
                        }
                    })
                    .catch(err => {
                        // toast.error("Failed to update price book.");
                    });
            } else {
                createQuoteOpportunity(opportunity?.opportunityId, newQuote)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Create quote successfully!");
                            setQuote({});
                            setShowPopup(false);
                            getList(1, 10);
                        }
                    })
                    .catch(err => {
                        // toast.error("Failed to create quote.");
                    });
            }
        }
    };
    const handleChangeAddress = (e: any, fieldName: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setQuote({
                ...quote,
                [fieldName]: {
                    ...quote[fieldName],
                    [name]: value
                }
            });
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout" style={{ maxWidth: '800px' }}>
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("QUOTE.UPDATE_QUOTE") : t("QUOTE.CREATE_QUOTE")}</h4>
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
                            <form>
                                <div className="row">
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("QUOTE.QUOTE_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.QUOTE_NUMBER")}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.EXPIRATION_DATE")}
                                                </label>
                                                <DatePicker
                                                    selected={quote?.expirationDate ? new Date(quote?.expirationDate) : null}
                                                    onChange={(date: any) => handleChange({ target: { name: "expirationDate", value: date } })}
                                                    className="form-control"
                                                    dateFormat="dd-MM-yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.QUOTE_NAME")} <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="quoteName"
                                                    onChange={handleChange}
                                                    value={quote?.quoteName || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.OPPORTUNITY_NAME")}
                                                </label>
                                                <div>
                                                    <span>
                                                        {opportunity?.opportunityName || quote?.opportunityName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.STATUS")}
                                                </label>
                                                <Select
                                                    options={listSelect?.quoteStatus}
                                                    value={listSelect?.quoteStatus?.find((item: any) => item?.value === quote?.statusQuoteOpportunityId)}
                                                    onChange={(e) => handleChange(e, 'statusQuoteOpportunityId')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.ACCOUNT_NAME")}
                                                </label>
                                                <div>
                                                    <span>
                                                        {account?.accountName || quote?.accountName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("QUOTE.TOTAL")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.TAX")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="tax"
                                                    onChange={handleChange}
                                                    value={quote?.tax || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.SHIPPING_AND_HANDLING")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="shippingHandling"
                                                    onChange={handleChange}
                                                    value={quote?.shippingHandling || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("QUOTE.PREPARED_FOR")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.CONTACT_NAME")}
                                                </label>
                                                <Select
                                                    options={listSelect?.contacts}
                                                    value={listSelect?.contacts?.find((item: any) => item?.value === quote?.contactId)}
                                                    onChange={(e) => handleChange(e, 'contact', 'contactId')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.EMAIL")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="email"
                                                    onChange={handleChange}
                                                    value={quote?.email || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.PHONE")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="phone"
                                                    onChange={handleChange}
                                                    value={quote?.phone || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("QUOTE.FAX")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fax"
                                                    onChange={handleChange}
                                                    value={quote?.fax || ''}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span>
                                            {t("QUOTE.ADDRESS_INFORMATION")}
                                        </span>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <span className="col-md-12">{t("LABEL.ACCOUNTS.BILLING_ADDRESS")}</span>
                                            <div className="col-md-12">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Street</label>
                                                    <textarea className="form-control" name="street"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={quote?.billingInformation?.street} >
                                                    </textarea>
                                                    {errors.billingInformation?.street && <div className="text-danger">{errors.billingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={quote?.billingInformation?.city} />
                                                    {errors.billingInformation?.city && <div className="text-danger">{errors.billingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={quote?.billingInformation?.province} />
                                                    {errors.billingInformation?.province && <div className="text-danger">{errors.billingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={quote?.billingInformation?.postalCode} />
                                                    {errors.billingInformation?.postalCode && <div className="text-danger">{errors.billingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={quote?.billingInformation?.country} />
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
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={quote?.shippingInformation?.street} >
                                                    </textarea>
                                                    {errors.shippingInformation?.street && <div className="text-danger">{errors.shippingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={quote?.shippingInformation?.city} />
                                                    {errors.shippingInformation?.city && <div className="text-danger">{errors.shippingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={quote?.shippingInformation?.province} />
                                                    {errors.shippingInformation?.province && <div className="text-danger">{errors.shippingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={quote?.shippingInformation?.postalCode} />
                                                    {errors.shippingInformation?.postalCode && <div className="text-danger">{errors.shippingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={quote?.shippingInformation?.country} />
                                                    {errors.shippingInformation?.country && <div className="text-danger">{errors.shippingInformation.country}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap row">
                                        <div className="col-md-12">
                                            <label className="col-form-label">
                                                {t("ORDER.DESCRIPTION")}
                                            </label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                onChange={handleChange}
                                                value={quote?.description || ''}
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
                                        onClick={handleCreate}
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