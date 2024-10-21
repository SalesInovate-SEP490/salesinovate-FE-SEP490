import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { patchPriceBook } from "../../../services/priceBook";
import { getListContract, getListOrderStatus } from "../../../services/contract";
import { getAccounts } from "../../../services/account";
import { getListContact } from "../../../services/Contact";
import DatePicker from 'react-datepicker';

const DetailOrder: React.FC<{ data: any; getDetail?: any }> = ({ data, getDetail }) => {
  const [order, setOrder] = useState<any>(data);
  const [listOpen, setListOpen] = useState<any>({
    edit: false
  });
  const [listSelect, setListSelect] = useState<any>({
    contractNumber: [],
    accounts: [],
    contacts: [],
    orderStatus: []
  });
  const [errors, setErrors] = useState<any>({});

  const { t } = useTranslation();

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    setOrder({
      ...data,
      contractNumber: data?.contractId ? parseInt(data?.contractId) : null,
      accountId: data?.accountId ? parseInt(data?.accountId) : null,
      orderStatusId: data?.orderStatus,
      contactId: data?.contactId,
      orderStartDate: data?.orderStartDate ? new Date(data?.orderStartDate) : null,
    });
  }, [data]);

  useEffect(() => {
    checkPermissionRole(all_routes.opportunitiesDetails)
  }, [listOpen])

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
  }, [])

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

  const handleCreate = () => {
    if (validate()) {
      const newOrder = {
        accountId: order.accountId,
        orderStartDate: order.orderStartDate ? new Date(order.orderStartDate).toISOString() : null,
        orderStatus: order.orderStatusId,
        description: order.description,
        contactId: order.contactId,
        contractNumber: order.contractNumber.contractId,
        billingInformation: order.billingInformation,
        shippingInformation: order.shippingInformation
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

  const convertDateToString = (date: any) => {
    return date ? new Date(date).toISOString() : null;
  }

  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
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
                      value={listSelect?.contractNumber.find((item: any) => item?.value === order?.contractNumber)}
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
                      value={listSelect?.accounts.find((item: any) => item?.value === order?.accountId)}
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
                      value={listSelect?.orderStatus.find((item: any) => item?.value === order?.orderStatusId)}
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
                      value={listSelect?.contacts.find((item: any) => item?.value === order?.contactId)}
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
          </div>
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-light sidebar-close">
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
        </>
        :
        <>
          <div className='row'>
            {<>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.ORDER_NUMBER")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.orderId}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.CONTRACT_NUMBER")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.contractNumber}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.ACCOUNT_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.accountId}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.ORDER_START_DATE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.orderStartDate ? new Date(order?.orderStartDate).toLocaleDateString() : ''}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.STATUS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.orderStatus?.orderStatusName}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("ORDER.CUSTOMER_AUTHORIZED_BY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.contactId}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-12'>
                <div className="row detail-row">
                  <label className='col-md-2'>{t("ORDER.DESCRIPTION")}</label>
                  <div className='col-md-10 text-black input-detail'>
                    <span>{order?.description}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.BILLING_ADDRESS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.billingInformation?.street}</span>
                    <span>{order?.billingInformation?.city}</span>
                    <span>{order?.billingInformation?.province}</span>
                    <span>{order?.billingInformation?.postalCode}</span>
                    <span>{order?.billingInformation?.country}</span>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.SHIPPING_ADDRESS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{order?.shippingInformation?.street}</span>
                    <span>{order?.shippingInformation?.city}</span>
                    <span>{order?.shippingInformation?.province}</span>
                    <span>{order?.shippingInformation?.postalCode}</span>
                    <span>{order?.shippingInformation?.country}</span>
                  </div>
                </div>
              </div>
            </>}
          </div>
        </>
      }

    </>

  )
}

export default DetailOrder;
