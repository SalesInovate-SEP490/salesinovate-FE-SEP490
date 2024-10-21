import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getContractById, getListContractStatus, updateContract } from "../../../services/contract";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './contract.scss';
import { convertTextToDate } from "../../../utils/commonUtil";
import { getAccounts } from "../../../services/account";
import { filterPriceBook } from "../../../services/priceBook";
import { getContacts } from "../../../services/Contact";
import DatePicker from 'react-datepicker';


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
const FixContractDetail: React.FC<{ contract: any; getContractDetail?: any }> = ({ contract, getContractDetail }) => {
  const [data, setData] = useState<any>(contract);
  const [listOpen, setListOpen] = useState<any>({
    edit: false,
    system: true,
    information: true,
    address: true,
    description: true,
    Signature: true
  });
  const [errors, setErrors] = useState<any>({})
  const [listSelect, setListSelect] = useState<any>({
    account: [],
    contact: [],
    company: [],
    priceBook: [],
    status: [],
  });
  const { t } = useTranslation();

  useEffect(() => {
    setData(contract);
  }, [contract])

  useEffect(() => {
    getAccountSelect();
    getPriceBookSelect();
    getListStatusSelects();
    getContactSelect();
  }, []);
  const getAccountSelect = () => {
    getAccounts(1, 1000)
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
  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value, type, checked } = e.target;
      const inputValue = type === 'checkbox' ? checked : value;
      setData({
        ...data,
        [name]: inputValue
      });
    } else {
      if (nameChild) {
        setData({
          ...data,
          [name]: {
            [nameChild]: e.value
          },
          [nameChild]: e.value
        });
      }
      else {
        setData({
          ...data,
          [name]: e.value
        });
      }
    }
  };

  const validate = () => {
    let tempErrors: any = {};
    // Check required fields
    if (!data?.accountId) tempErrors.accountId = t("MESSAGE.ERROR.REQUIRED");
    if (!data?.contractStartDate) tempErrors.startDate = t("MESSAGE.ERROR.REQUIRED");
    if (!data?.contractTerm) tempErrors.contractTerm = t("MESSAGE.ERROR.REQUIRED");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdate = () => {
    if (validate()) {
      const contractUpdate = {
        userId: data?.userId,
        contractStartDate: data?.contractStartDate,
        contractTerm: data?.contractTerm,
        ownerExpirationNotice: data?.ownerExpirationNotice,
        specialTerms: data?.specialTerms,
        description: data?.description,
        accountId: data?.accountId,
        priceBookId: data?.priceBookId,
        billingAddressId: {
          street: data?.billingAddressId?.street,
          city: data?.billingAddressId?.city,
          province: data?.billingAddressId?.province,
          postalCode: data?.billingAddressId?.postalCode,
          country: data?.billingAddressId?.country,
        },
        shippingAddressId: {
          street: data?.shippingAddressId?.street,
          city: data?.shippingAddressId?.city,
          province: data?.shippingAddressId?.province,
          postalCode: data?.shippingAddressId?.postalCode,
          country: data?.shippingAddressId?.country,
        },
        contactId: data?.contactId,
        customerSignedTitle: data?.customerSignedTitle,
        customerSignedDate: data?.customerSignedDate,
        companyId: data?.companyId,
        companySignedDate: data?.companySignedDate,
      }
      updateContract(contractUpdate, data?.contractId)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update success");
            setListOpen({ ...listOpen, edit: false })
            getContractDetail();
          } else {
            toast.error(response.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }


  return (
    <>
      {listOpen.edit ?
        <>
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
                    {t("CONTRACT.CONTRACT_START_DATE")}
                  </label>
                  <DatePicker
                    selected={data?.contractStartDate}
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
                    onChange={(e) => handleChange(e)} value={data?.contractTerm} />
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
                    options={listSelect?.account}
                    styles={customStyles}
                    onChange={(e) => handleChange(e, "account", "accountId")}
                    value={listSelect?.account?.find((item: any) => item.value === data?.accountId)}
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
                    selected={data?.ownerExpirationNotice}
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
                    value={listSelect?.status?.find((item: any) => item.value === data?.contractStatus)}
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
                    value={listSelect?.priceBook?.find((item: any) => item.value === data?.priceBookId)}
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
                        onChange={(e) => handleChange(e)} value={data?.billingAddressId?.street} />
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
                        onChange={(e) => handleChange(e)} value={data?.billingAddressId?.city} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("CONTRACT.BILLING_STATE_PROVINCE")}
                      </label>
                      <input type="text" className="form-control" name="billingAddressId?.province"
                        onChange={(e) => handleChange(e)} value={data?.billingAddressId?.province} />
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
                        onChange={(e) => handleChange(e)} value={data?.billingAddressId?.postalCode} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("CONTRACT.BILLING_COUNTRY")}
                      </label>
                      <input type="text" className="form-control" name="billingAddressId?.country"
                        onChange={(e) => handleChange(e)} value={data?.billingAddressId?.country} />
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
                        onChange={(e) => handleChange(e)} value={data?.shippingAddressId?.street} />
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
                        onChange={(e) => handleChange(e)} value={data?.shippingAddressId?.city} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("CONTRACT.SHIPPING_STATE_PROVINCE")}
                      </label>
                      <input type="text" className="form-control" name="shippingAddressId?.province"
                        onChange={(e) => handleChange(e)} value={data?.shippingAddressId?.province} />
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
                        onChange={(e) => handleChange(e)} value={data?.shippingAddressId?.postalCode} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("CONTRACT.SHIPPING_COUNTRY")}
                      </label>
                      <input type="text" className="form-control" name="shippingAddressId?.country"
                        onChange={(e) => handleChange(e)} value={data?.shippingAddressId?.country} />
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
                  value={data?.specialTerms || ''}
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
                  value={data?.description || ''}
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
                    value={listSelect?.contact?.find((item: any) => item.value === data?.contactId)}
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <div className="form-wrap">
                  <label className="col-form-label">
                    {t("CONTRACT.CUSTOMER_SIGNED_DATE")}
                  </label>
                  <DatePicker
                    selected={data?.customerSignedDate}
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
                    onChange={(e) => handleChange(e)} value={data?.customerSignedTitle} />
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
                    selected={data?.companySignedDate}
                    onChange={(date: any) => handleChange({ value: date }, "companySignedDate")}
                    className="form-control datetimepicker deals-details w-100"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="dd-mm-yyyy"
                  />
                </div>
              </div>
            </div>
            <div className="submit-button text-end mt-5">
              <Link to="#"
                onClick={() => setListOpen({ ...listOpen, edit: false })}
                className="btn btn-light sidebar-close">
                {t("CONTRACT.CANCEL")}
              </Link>
              <Link
                to="#"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                {t("ACTION.UPDATE")}
              </Link>
            </div>
          </>}
        </>
        :
        <>
          <div className='row'>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.CONTRACT_START_DATE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.contractStartDate ? convertTextToDate(data?.contractStartDate) : ' '} `}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.CONTRACT_NUMBER")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span> {data?.contractNumber || ' '}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className="col-md-4">{t("CONTRACT.CONTRACT_END_DATE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{data?.ownerExpirationNotice ? convertTextToDate(data?.ownerExpirationNotice) : ' '}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.ACCOUNT_NAME")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{listSelect?.account?.find((item: any) => item.value === data?.accountId)?.label || ' '}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.CONTRACT_TERM")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.specialTerms || ' '}`}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.OWNER_EXPIRATION_NOTICE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.ownerExpirationNotice ? convertTextToDate(data?.ownerExpirationNotice) : ' '}`}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTRACT.PRICE_BOOK")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{listSelect?.priceBook?.find((item: any) => item.value === data?.priceBookId)?.label || ' '}</span>
                  <i
                    className="fa fa-pencil ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                <span>{t("PRODUCT.SYSTEM_INFORMATION")}</span>
              </span>
            </div>
            {listOpen.address && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.BILLING_ADDRESS")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <div>
                        <span>{data?.billingAddressId?.street || ' '}</span>
                        <span>{data?.billingAddressId?.city || ' '}</span>
                        <span>{data?.billingAddressId?.province || ' '}</span>
                        <span>{data?.billingAddressId?.postalCode || ' '}</span>
                        <span>{data?.billingAddressId?.country || ' '}</span>
                      </div>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.SHIPPING_ADDRESS")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <div>
                        <span>{data?.shippingAddressId?.street || ' '}</span>
                        <span>{data?.shippingAddressId?.city || ' '}</span>
                        <span>{data?.shippingAddressId?.province || ' '}</span>
                        <span>{data?.shippingAddressId?.postalCode || ' '}</span>
                        <span>{data?.shippingAddressId?.country || ' '}</span>
                      </div>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </>}
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, description: !listOpen.description })}>
                <i className={!listOpen.description ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                <span>{t("CONTRACT.DESCRIPTION_INFORMATION")}</span>
              </span>
            </div>
            {listOpen.description && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.SPECIAL_TERMS")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.specialTerms || ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.DESCRIPTION")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.description || ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </>}
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, Signature: !listOpen.Signature })}>
                <i className={!listOpen.Signature ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                <span>{t("CONTRACT.SIGNATURE_INFORMATION")}</span>
              </span>
            </div>
            {listOpen.Signature && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.CUSTOMER_SIGNED_BY")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{listSelect?.contact?.find((item: any) => item.value === data?.contactId)?.label || ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.CUSTOMER_SIGNED_DATE")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.customerSignedDate ? convertTextToDate(data?.customerSignedDate) : ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.CUSTOMER_SIGNED_TITLE")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.customerSignedTitle || ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTRACT.COMPANY_SIGNED_DATE")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.companySignedDate ? convertTextToDate(data?.companySignedDate) : ' '}</span>
                      <i
                        className="fa fa-pencil ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
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

export default FixContractDetail;
