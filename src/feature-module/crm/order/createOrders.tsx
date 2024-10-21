import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./order.scss"
import { getListContract, getListOrderStatus } from "../../../services/contract";
import Select, { StylesConfig } from "react-select";
import { getAccounts } from "../../../services/account";
import DatePicker from 'react-datepicker';
import { getListContact } from "../../../services/Contact";
import { createOrderContract, getOrderContractDetail, updateOrderContract } from "../../../services/order";
import Swal from "sweetalert2";
import { getTimeCorrectTimeZone } from "../../../utils/commonUtil";

export const CreateOrder: React.FC<{
    showPopup?: boolean;
    setShowPopup?: any;
    getList?: any;
    isEdit?: boolean;
    id?: any;
    getDetail?: any;
    contractNumber?: any;
}> = ({ showPopup, setShowPopup, getList, isEdit, id, getDetail, contractNumber }) => {
    const [order, setOrder] = useState<any>({});
    const [listSelect, setListSelect] = useState<any>({
        contractNumber: [],
        accounts: [],
        contacts: [],
        orderStatus: []
    });
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        const param = {
            currentPage: 1,
            perPage: 100
        }
        getListContract(param)
            .then(response => {
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        contractNumber: response?.data?.items?.map((item: any) => {
                            return {
                                value: item.contractNumber,
                                label: item.contractNumber
                            }
                        }),
                    }
                });
            })
            .catch(err => {
                toast.error("Failed to get contract list.");
            });
        getAccounts(0, 200)
            .then(response => {
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        accounts: response?.data?.items?.map((item: any) => {
                            return {
                                value: item.accountId,
                                label: item.accountName
                            }
                        }),
                    }
                });
            })
            .catch(err => {
                toast.error("Failed to get account list.");
            });

        getListOrderStatus()
            .then(response => {
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        orderStatus: response?.data?.map((item: any) => {
                            return {
                                value: item.orderStatusId,
                                label: item.orderStatusName
                            }
                        }),
                    }
                });
            })
            .catch(err => {
                // toast.error("Failed to get order status list.");
                // Fake status is Draf or Activated
                setListSelect((prev: any) => {
                    return {
                        ...prev,
                        orderStatus: [
                            {
                                value: 1,
                                label: 'Draft'
                            },
                            {
                                value: 2,
                                label: 'Activated'
                            }
                        ]
                    }
                });
            });
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
                toast.error("Failed to get contact list.");
            });
        if (isEdit) {
            getOrderContractDetail(id)
                .then((res: any) => {
                    setOrder({
                        ...res.data,
                        contractNumber: {
                            contractId: res.data?.contractNumber,
                            value: res.data?.contractNumber
                        },
                        accountId: res.data?.accountId ? parseInt(res.data?.accountId) : null,
                        orderStatusId: res.data?.orderStatus,
                        contactId: res.data?.contactId,
                        orderStartDate: res.data?.orderStartDate ? getTimeCorrectTimeZone(new Date(res.data?.orderStartDate)) : null,
                    });
                })
                .catch(err => {
                });
        }
    }, [id])

    useEffect(() => {
        if (contractNumber)
            setOrder((prev: any) => {
                return {
                    ...prev,
                    contractNumber: {
                        contractId: contractNumber,
                        value: contractNumber
                    }
                }
            });
    }, [contractNumber]);

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log(e);
        if (e?.target) {
            const { name, value } = e.target;
            setOrder({
                ...order,
                [name]: value,
            });
        } else {
            if (nameChild) {
                setOrder({
                    ...order,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setOrder({
                    ...order,
                    [name]: e.value,
                });
            }
        }
    };

    const validate = () => {
        let tempErrors: any = {};
        // Check required fields
        if (!order.contractNumber) tempErrors.contractNumber = t("MESSAGE.ERROR.REQUIRED");
        if (!order.accountId) tempErrors.accountId = t("MESSAGE.ERROR.REQUIRED");
        if (!order.orderStartDate) tempErrors.orderStartDate = t("MESSAGE.ERROR.REQUIRED");
        if (!order.orderStatusId) tempErrors.orderStatusId = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            const newOrder = {
                accountId: order.accountId,
                orderStartDate: order.orderStartDate ? new Date(order.orderStartDate).toISOString() : null,
                orderStatus: order.orderStatusId,
                description: order.description,
                contactId: order.contactId,
                contractNumber: order.contractNumber.contractId,
                BillingInformation: order.billingInformation ? order.billingInformation : { street: "" },
                ShippingInformation: order.shippingInformation ? order.shippingInformation : { street: "" }
            }
            Swal.showLoading();
            if (isEdit) {
                // update
                updateOrderContract(id, newOrder)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Update price book successfully!");
                            setShowPopup(false);
                            getDetail(id);
                        }
                    })
                    .catch(err => {
                        Swal.close();
                        toast.error("Failed to update price book.");
                    });
            } else {
                createOrderContract(newOrder)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success("Create order successfully!");
                            setOrder({});
                            setShowPopup(false);
                            getList(1, 10);
                        }
                    })
                    .catch(err => {
                        Swal.close();
                        toast.error("Failed to create order.");
                    });
            }
        }
    };
    const handleChangeAddress = (e: any, fieldName: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setOrder({
                ...order,
                [fieldName]: {
                    ...order[fieldName],
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
                        <h4>{isEdit ? t("ORDER.UPDATE_ORDER") : t("ORDER.CREATE_ORDER")}</h4>
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
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.ORDER_NUMBER")} <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.CONTRACT_NUMBER")} <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    options={listSelect?.contractNumber}
                                                    value={listSelect?.contractNumber?.find((item: any) => item?.value === order?.contractNumber?.contractId)}
                                                    onChange={(e) => handleChange(e, 'contractNumber', 'contractId')}
                                                />
                                                {errors.contractNumber && <div className="text-danger">{errors.contractNumber}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.ACCOUNT_NAME")} <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    options={listSelect?.accounts}
                                                    value={listSelect?.accounts?.find((item: any) => item?.value === order?.accountId)}
                                                    onChange={(e) => handleChange(e, 'account', 'accountId')} />
                                                {errors.accountId && <div className="text-danger">{errors.accountId}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.ORDER_START_DATE")} <span className="text-danger">*</span>
                                                </label>
                                                <DatePicker
                                                    selected={order?.orderStartDate ? new Date(order?.orderStartDate) : null}
                                                    onChange={(date: any) => handleChange({ target: { name: "orderStartDate", value: date } })}
                                                    className="form-control"
                                                    dateFormat="dd-MM-yyyy"
                                                />
                                                {errors.orderStartDate && <div className="text-danger">{errors.orderStartDate}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.STATUS")} <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    options={listSelect?.orderStatus}
                                                    value={listSelect?.orderStatus?.find((item: any) => item?.value === order?.orderStatusId)}
                                                    onChange={(e) => handleChange(e, 'orderStatusId')}
                                                />
                                                {errors.orderStatusId && <div className="text-danger">{errors.orderStatusId}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* // Contact */}
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-12">
                                                <label className="col-form-label">
                                                    {t("ORDER.CUSTOMER_AUTHORIZED_BY")}
                                                </label>
                                                <Select
                                                    options={listSelect?.contacts}
                                                    value={listSelect?.contacts?.find((item: any) => item?.value === order?.contactId)}
                                                    onChange={(e) => handleChange(e, 'contact', 'contactId')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <span className="col-md-12">{t("LABEL.ACCOUNTS.BILLING_ADDRESS")}</span>
                                            <div className="col-md-12">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Street</label>
                                                    <textarea className="form-control" name="street"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={order?.billingInformation?.street} >
                                                    </textarea>
                                                    {errors.billingInformation?.street && <div className="text-danger">{errors.billingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={order?.billingInformation?.city} />
                                                    {errors.billingInformation?.city && <div className="text-danger">{errors.billingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={order?.billingInformation?.province} />
                                                    {errors.billingInformation?.province && <div className="text-danger">{errors.billingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={order?.billingInformation?.postalCode} />
                                                    {errors.billingInformation?.postalCode && <div className="text-danger">{errors.billingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={order?.billingInformation?.country} />
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
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={order?.shippingInformation?.street} >
                                                    </textarea>
                                                    {errors.shippingInformation?.street && <div className="text-danger">{errors.shippingInformation.street}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">City</label>
                                                    <input type="text" className="form-control" name="city"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={order?.shippingInformation?.city} />
                                                    {errors.shippingInformation?.city && <div className="text-danger">{errors.shippingInformation.city}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">State</label>
                                                    <input type="text" className="form-control" name="province"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={order?.shippingInformation?.province} />
                                                    {errors.shippingInformation?.province && <div className="text-danger">{errors.shippingInformation.province}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Zip/Postal Code</label>
                                                    <input type="text" className="form-control" name="postalCode"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={order?.shippingInformation?.postalCode} />
                                                    {errors.shippingInformation?.postalCode && <div className="text-danger">{errors.shippingInformation.postalCode}</div>}
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">Country</label>
                                                    <input type="text" className="form-control" name="country"
                                                        onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={order?.shippingInformation?.country} />
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
                                                value={order?.description || ''}
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