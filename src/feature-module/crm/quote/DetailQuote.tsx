import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { getListContract, getListOrderStatus } from "../../../services/contract";
import { getAccounts } from "../../../services/account";
import { getListContact } from "../../../services/Contact";
import DatePicker from 'react-datepicker';
import { getListQuoteStatus, updateQuote } from "../../../services/quote";
import Swal from "sweetalert2";

const DetailQuote: React.FC<{ data: any; getDetail?: any }> = ({ data, getDetail }) => {
  const [quote, setQuote] = useState<any>(data);
  const [listOpen, setListOpen] = useState<any>({
    edit: false
  });
  const [listSelect, setListSelect] = useState<any>({
    contractNumber: [],
    accounts: [],
    contacts: [],
    orderStatus: [],
    quoteStatus: [],
  });
  const [errors, setErrors] = useState<any>({});

  const { t } = useTranslation();

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    setQuote({
      ...data
    });
  }, [data]);

  useEffect(() => {
    checkPermissionRole(all_routes.quotesDetails)
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

  }, [])

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
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
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
        email: quote?.email,
        phone: quote?.phone,
        fax: quote?.fax,
        opportunityId: quote?.opportunityId,
      }
      Swal.showLoading();
      updateQuote(data?.quoteId, newQuote)
        .then(response => {
          Swal.close();
          if (response.code === 1) {
            toast.success("Update price book successfully!");
            if (getDetail) getDetail();
            setListOpen({ ...listOpen, edit: false });
          }
        })
        .catch(err => {
          Swal.close();
        });
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
      {listOpen.edit ?
        <>
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
                      {quote?.opportunityName}
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
                      {quote?.accountName}
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
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-secondary mr-2">
              Cancel
            </Link>
            <Link
              to="#"
              className="btn btn-primary"
              onClick={handleCreate}
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
                  <label className='col-md-4'>{t("QUOTE.QUOTE_NUMBER")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{quote?.quoteId}</span>
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
                  <label className='col-md-4'>{t("QUOTE.EXPIRATION_DATE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.expirationDate ? new Date(quote?.expirationDate).toLocaleDateString() : ""}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.QUOTE_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.quoteName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.OPPORTUNITY_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.opportunityName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.STATUS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.statusQuoteOpportunityId}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.ACCOUNT_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.accountName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.SUBTOTAL")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.subTotal}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.DISCOUNT")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.discount}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.SHIPPING_AND_HANDLING")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.shippingAndHandling}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.TOTAL_PRICE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.totalPrice}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.GRAND_TOTAL")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.grandTotal}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.CONTACT_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.contactName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.PHONE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.phone}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.EMAIL")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.email}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.FAX")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.fax}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.BILL_TO_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.opportunityName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.SHIP_TO_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>
                      {quote?.opportunityName}
                    </span>
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
                  <label className='col-md-4'>{t("QUOTE.BILL_TO")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{quote?.billingInformation?.street}</span>
                    <span>{quote?.billingInformation?.city}</span>
                    <span>{quote?.billingInformation?.province}</span>
                    <span>{quote?.billingInformation?.postalCode}</span>
                    <span>{quote?.billingInformation?.country}</span>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("QUOTE.SHIP_TO")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{quote?.shippingInformation?.street}</span>
                    <span>{quote?.shippingInformation?.city}</span>
                    <span>{quote?.shippingInformation?.province}</span>
                    <span>{quote?.shippingInformation?.postalCode}</span>
                    <span>{quote?.shippingInformation?.country}</span>
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

export default DetailQuote;
