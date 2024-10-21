import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getIndustryList, getListStatus, getSalutationList, getSourceList, patchLead } from "../../../services/lead";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAccounts, getListType, patchAccount } from "../../../services/account";
import DatePicker from 'react-datepicker';
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { useSelector } from "react-redux";

const route = all_routes;
const DetailAccount: React.FC<{ account: any; getDetail?: any }> = ({ account, getDetail }) => {
  const [data, setData] = useState<any>(account);
  const [listSelect, setListSelect] = useState<{
    type?: { value: number; label: string }[];
    industry?: { value: number; label: string }[];
    accounts?: { value: number; label: string }[];
  }>({
    type: [],
    industry: [],
    accounts: [],
  });
  const [listOpen, setListOpen] = useState<any>({
    accountInformation: true,
    additionalInformation: true,
    addressInformation: true,
    edit: false
  });
  const [errors, setErrors] = useState<{
    accountName?: string; phone?: string; type?: string; industry?: string
  }>({});
  const { t } = useTranslation();
  const userName = useState(useSelector((state: any) => state.userName));

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    checkPermissionRole(route.accountsDetails);
  }, [listOpen]);

  useEffect(() => {
    getIndustryList()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            industry: response.data.map((item: any) => {
              return {
                value: item.industryId,
                label: item.industryStatusName
              }
            })
          }));
        }
      })
      .catch(err => {

      })
    getAccounts(1, 100)
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            accounts: response.data.items.map((item: any) => ({
              value: item.accountId,
              label: item.accountName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
    getListType()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            type: response.data.map((item: any) => ({
              value: item.accountTypeId,
              label: item.accountTypeName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
  }, []);

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

  useEffect(() => {
    if (account) {
      setData(account);
    }
  }, [account]);

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value
      });
    } else {
      if (nameChild) {
        setData({
          ...data,
          [name]: {
            [nameChild]: e.value,
            name: e.label
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

  const handleChangeAddress = (e: any, fieldName: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        [fieldName]: {
          ...data[fieldName],
          [name]: value
        }
      });
    }
  }


  const validate = () => {
    let tempErrors: { accountName?: string; phone?: string; type?: string; industry?: string } = {};
    if (!data.accountName) tempErrors.accountName = t("MESSAGE.ERROR.REQUIRED");
    // Check phone pattern vietnamese : 10 digits, start with 0, not required
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (data.phone && !phoneRegex.test(account.phone)) {
      tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
    }
    console.log("account.accountTypeId", account);
    if (!data.accountType?.accountTypeId) tempErrors.type = t("MESSAGE.ERROR.REQUIRED");
    if (!data?.industry?.industryId) tempErrors.industry = t("MESSAGE.ERROR.REQUIRED");
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const handleCreate = () => {
    if (validate()) {
      const newAccount = {
        accountName: data.accountName,
        parentAccountId: data.parentAccountId,
        accountTypeId: data.accountTypeId,
        phone: data.phone,
        industryId: data.industryId,
        website: data.website,
        description: data.description,
        noEmployee: data.employees,
        billingInformation: {
          street: data.billingInformation.street,
          city: data.billingInformation.city,
          province: data.billingInformation.province,
          postalCode: data.billingInformation.postalCode,
          country: data.billingInformation.country
        },
        shippingInformation: {
          street: data.shippingInformation.street,
          city: data.shippingInformation.city,
          province: data.shippingInformation.province,
          postalCode: data.shippingInformation.postalCode,
          country: data.shippingInformation.country
        },
      }
      patchAccount(newAccount, data.accountId)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update account successfully!");
            setListOpen({ ...listOpen, edit: false });
            getDetail();
          }
        })
        .catch(error => {

        })
    }
  }

  return (
    <>
      {listOpen.edit ?
        <>
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
                  onChange={(e) => handleChange(e)} value={data?.accountName} />
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
                  options={listSelect.accounts}
                  styles={customStyles}
                  value={listSelect.accounts?.find((item: any) => item.value === data?.parentAccountId)}
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
                  options={listSelect.type}
                  styles={customStyles}
                  value={listSelect.type?.find((item: any) => item.value === data?.accountType?.accountTypeId)}
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
                  onChange={(e) => handleChange(e)} value={data?.phone} />
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
                  options={listSelect.industry}
                  styles={customStyles}
                  value={listSelect.industry?.find((item: any) => item.value === data?.industry?.industryId)}
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
                  onChange={(e) => handleChange(e)} value={data?.website} />
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
                  onChange={(e) => handleChange(e)} value={data?.phone} />
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
                  onChange={(e) => handleChange(e)} value={data?.description} />
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
                  onChange={(e) => handleChange(e)} value={data?.employees} />
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
                      onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={data?.billingInformation?.street} >
                    </textarea>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-wrap">
                    <label className="col-form-label">City</label>
                    <input type="text" className="form-control" name="city"
                      onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={data?.billingInformation?.city} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">State</label>
                    <input type="text" className="form-control" name="province"
                      onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={data?.billingInformation?.province} />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-wrap">
                    <label className="col-form-label">Zip/Postal Code</label>
                    <input type="text" className="form-control" name="postalCode"
                      onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={data?.billingInformation?.postalCode} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">Country</label>
                    <input type="text" className="form-control" name="country"
                      onChange={(e) => handleChangeAddress(e, 'billingInformation')} value={data?.billingInformation?.country} />
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
                      onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={data?.shippingInformation?.street} >
                    </textarea>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-wrap">
                    <label className="col-form-label">City</label>
                    <input type="text" className="form-control" name="city"
                      onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={data?.shippingInformation?.city} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">State</label>
                    <input type="text" className="form-control" name="province"
                      onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={data?.shippingInformation?.province} />
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="form-wrap">
                    <label className="col-form-label">Zip/Postal Code</label>
                    <input type="text" className="form-control" name="postalCode"
                      onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={data?.shippingInformation?.postalCode} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">Country</label>
                    <input type="text" className="form-control" name="country"
                      onChange={(e) => handleChangeAddress(e, 'shippingInformation')} value={data?.shippingInformation?.country} />
                  </div>
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
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, accountInformation: !listOpen.accountInformation })}>
                <i className={!listOpen.accountInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("LABEL.ACCOUNTS.ACCOUNT_INFORMATION")}
              </span>
            </div>
            {listOpen.accountInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.ACCOUNT_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.accountName}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.PARENT_ACCOUNT")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.parrentAccountId}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.ACCOUNT_OWNER")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{userName}</span>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.TYPE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.accountType?.accountTypeName}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.PHONE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.phone}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.INDUSTRY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.industry?.industryStatusName}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
            </>}
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, additionalInformation: !listOpen.additionalInformation })}>
                <i className={!listOpen.additionalInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("LABEL.ACCOUNTS.ADDITIONAL_INFORMATION")}
              </span>
            </div>
            {listOpen.additionalInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.WEBSITE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.website}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.PHONE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.phone}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.DESCRIPTION")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.description}</span>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.EMPLOYEES")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.noEmployee}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
            </>}
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, addressInformation: !listOpen.addressInformation })}>
                <i className={!listOpen.addressInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("LABEL.ACCOUNTS.ADDRESS_INFORMATION")}
              </span>
            </div>
            {listOpen.addressInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.BILLING_ADDRESS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <div className="row">
                      <div className="col-md-12">
                        {data?.billingInformation?.street}
                      </div>
                      <div className="col-md-12">
                        {data?.billingInformation?.city}
                      </div>
                      <div className="col-md-12">
                        {`${data?.billingInformation?.province ?? ''} ${data?.billingInformation?.postalCode ?? ''}`}
                      </div>
                      <div className="col-md-12">
                        {data?.billingInformation?.country}
                      </div>
                    </div>
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
                  <label className='col-md-4'>{t("LABEL.ACCOUNTS.SHIPPING_ADDRESS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <div className="row">
                      <div className="col-md-12">
                        {data?.shippingInformation?.street}
                      </div>
                      <div className="col-md-12">
                        {data?.shippingInformation?.city}
                      </div>
                      <div className="col-md-12">
                        {`${data?.shippingInformation?.province ?? ''} ${data?.shippingInformation?.postalCode ?? ''}`}
                      </div>
                      <div className="col-md-12">
                        {data?.shippingInformation?.country}
                      </div>
                    </div>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={handleEditClick}
                    ></i>
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

export default DetailAccount;
