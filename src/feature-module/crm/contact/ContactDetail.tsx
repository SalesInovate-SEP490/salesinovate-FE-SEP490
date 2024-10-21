import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { patchContact } from "../../../services/Contact";
import { getSalutationList } from "../../../services/lead";
import { getAccounts } from "../../../services/account";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './contact.css'
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { useSelector } from "react-redux";

const route = all_routes;
const ContactsDetail: React.FC<{ contact: any; getContactDetail?: any }> = ({ contact, getContactDetail }) => {
  const [data, setData] = useState<any>(contact);
  const [listOpen, setListOpen] = useState<any>({
    address: true,
    edit: false,
    additional: true,
    system: true
  });
  const [errors, setErrors] = useState<any>({})
  const { t } = useTranslation();
  const [salutationOptions, setSalutationOptions] = useState<any>([]);
  const [listSelect, setListSelect] = useState<{
    account?: { value: number; label: string }[];
  }>({
    account: []
  });
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

  useEffect(() => {
    getAccounts(1, 100)
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            account: response.data.items.map((item: any) => ({
              value: item.accountId,
              label: item.accountName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    setData({
      ...contact,
      createDate: formatDate(contact?.createDate),
      editDate: formatDate(contact?.editDate)
    });
  }, [contact]);

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    getSalutationList()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.leadSalutionId,
            label: item.leadSalutionName
          };
        });
        setSalutationOptions(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    checkPermissionRole(route.contactsDetails)
  }, [listOpen])

  const handleChangeAddress = (e: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        addressInformation: {
          ...data.addressInformation,
          [name]: value
        }
      });
    }
  }


  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      const formattedValue = (name === 'createDate' || name === 'editDate') ? formatDate(value) : value;
      setData({
        ...data,
        [name]: formattedValue
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
          ...contact,
          [name]: e.value
        });
      }
    }
  };


  const handleUpdate = () => {
    if (validate()) {
      const contactUpdate = {
        contactId: data?.contactId,
        accountId: data?.accountId,
        userId: data?.userId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        middleName: data?.middleName,
        contactSalutionId: data?.contactSalution?.leadSalutionId,
        addressInformation: {
          addressInformationId: data?.addressInformation?.addressInformationId,
          street: data?.addressInformation?.street,
          city: data?.addressInformation?.city,
          province: data?.addressInformation?.province,
          postalCode: data?.addressInformation?.postalCode,
          country: data?.addressInformation?.country
        },
        suffix: data?.suffix,
        title: data?.title,
        email: data?.email,
        phone: data?.phone,
        department: data?.department,
        mobile: data?.mobile,
        report_to: data?.report_to,
        fax: data?.fax,

      }
      patchContact(contactUpdate, data?.contactId)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update success");
            setListOpen({ ...listOpen, edit: false })
            getContactDetail();
          } else {
            toast.error(response.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const handleChangeSalutation = (selectedOption: any) => {
    setData({
      ...data,
      contactSalution: {
        leadSalutionId: selectedOption?.value,
        leadSalutionName: selectedOption?.label
      },
      contactSalutionId: selectedOption?.value
    });
  };

  const validate = () => {
    let tempErrors: { lastName?: string; phone?: string; email?: string } = {};
    if (!data.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
    if (!data.phone) tempErrors.phone = t("MESSAGE.ERROR.REQUIRED");
    if (!data.email) tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
    // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (data?.phone && !phoneRegex.test(data?.phone)) {
      tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
    }
    // Check email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data?.email && !emailRegex.test(data.email)) {
      tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;

  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };


  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CONTACT.ACCOUNT_NAME")}
                </label>
                <Select
                  className="select"
                  options={listSelect?.account}
                  styles={customStyles}
                  value={listSelect?.account?.find((item: any) => item?.value === data?.accountId)}
                  name="account"
                  onChange={e => handleChange(e, 'account', 'accountId')}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CONTACT.CONTACT_OWNER")}
                </label>
                <div className="form-wrap w-100 d-flex align-items-center">
                  <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                  <div>
                    <span style={{ display: 'block', fontWeight: 'bold' }}>
                      {userName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="row">
                  <div className="col-md-12 mt-4">
                    <label className="col-form-label">
                      {t("CONTACT.SALUTATION_NAME")}
                    </label>
                    <Select
                      className="select"
                      options={salutationOptions}
                      styles={customStyles}
                      value={salutationOptions?.find((item: any) => item?.value === data?.contactSalution?.leadSalutionId)}
                      name="leadSalutionName"
                      onChange={handleChangeSalutation}
                    />
                  </div>
                  <div className="col-md-12 mt-4">
                    <label className="col-form-label">
                      {t("CONTACT.FIRST_NAME")}
                    </label>
                    <input type="text" className="form-control" name="firstName"
                      onChange={(e) => handleChange(e)} value={data?.firstName} />
                  </div>
                  <div className="col-md-12 mt-4">
                    <label className="col-form-label">
                      {t("CONTACT.LAST_NAME")} <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" name="lastName"
                      onChange={(e) => handleChange(e)} value={data?.lastName} />

                    {errors.lastName && <p className="text-danger">{errors?.lastName}</p>}
                  </div>
                  <div className="col-md-12 mt-4">
                    <label className="col-form-label">
                      {t("CONTACT.MIDDLE_NAME")}
                    </label>
                    <input type="text" className="form-control" name="middleName"
                      onChange={(e) => handleChange(e)} value={data?.middleName} />
                  </div>
                  <div className="col-md-12 mt-4">
                    <label className="col-form-label">
                      {t("CONTACT.SUFFIX")}
                    </label>
                    <input type="text" className="form-control" name="suffix"
                      onChange={(e) => handleChange(e)} value={data?.suffix} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CONTACT.EMAIL")}  <span className="text-danger">*</span>
                </label>
                <input type="email" className="form-control" name="email"
                  onChange={(e) => handleChange(e)} value={data?.email} />
                {errors.email && <p className="text-danger">{errors.email}</p>}
              </div>
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CONTACT.TITLE")}
                </label>
                <input type="text" className="form-control" name="title"
                  onChange={(e) => handleChange(e)} value={data?.title} />
              </div>
              <div className="form-wrap">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    {t("CONTACT.PHONE")}  <span className="text-danger">*</span>
                  </label>
                </div>
                <input type="number" className="form-control" name="phone"
                  onChange={(e) => handleChange(e)} value={data?.phone} />
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
              </div>
            </div>
          </div>
          <div className='col-ms-12 label-detail'>
            <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
              <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
              {t("CONTACT.ADDRESS_INFORMATION")}
            </span>
          </div>
          {
            listOpen.address &&
            <>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.STREET")}</label>
                      <textarea className="form-control" name="street"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInformation?.street} >
                      </textarea>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.CITY")}</label>
                      <input type="text" className="form-control" name="city"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInformation?.city} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.PROVINCE")}</label>
                      <input type="text" className="form-control" name="province"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInformation?.province} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.POSTAL_CODE")}</label>
                      <input type="text" className="form-control" name="postalCode"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInformation?.postalCode} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.COUNTRY")}</label>
                      <input type="text" className="form-control" name="country"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInformation?.country} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          <div className='col-ms-12 label-detail'>
            <span onClick={() => setListOpen({ ...listOpen, additional: !listOpen.additional })}>
              <i className={!listOpen.additional ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
              {t("CONTACT.ADDITIONAL_INFORMATION")}
            </span>
          </div>
          {
            listOpen.additional &&
            <>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.MOBILE")}</label>
                      <input type="number" className="form-control" name="mobile"
                        onChange={(e) => handleChange(e)} value={data?.mobile} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.REPORT_TO")}</label>
                      <input type="text" className="form-control" name="report_to"
                        onChange={(e) => handleChange(e)} value={data?.report_to} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.FAX")}</label>
                      <input type="text" className="form-control" name="fax"
                        onChange={(e) => handleChange(e)} value={data?.fax} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">{t("CONTACT.DEPARTMENT")}</label>
                      <input type="text" className="form-control" name="department"
                        onChange={(e) => handleChange(e)} value={data?.department} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false, additional: false })} className="btn btn-light sidebar-close">
              {t("CONTACT.CANCEL")}
            </Link>
            <Link
              to="#"
              className="btn btn-primary"
              onClick={() => handleUpdate()}
            >
              {t("CONTACT.UPDATE")}
            </Link>
          </div>
        </>
        :
        <>
          <div className='row'>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTACT.ACCOUNT_NAME")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{listSelect.account?.find(acc => acc.value === data?.accountId)?.label || ''}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("CONTACT.CONTACT_OWNER")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{userName}</span>
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
                <label className='col-md-4'>{t("CONTACT.CONTACT_NAME")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.firstName ?? ""} ${data?.middleName ? '(' + data?.middleName + ')' : ''} ${data?.lastName ?? ""}`}</span>
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
                <label className='col-md-4'>{t("CONTACT.TITLE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{data?.title}</span>
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
                <label className='col-md-4'>{t("CONTACT.EMAIL")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{data?.email}</span>
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
                <label className='col-md-4'>{t("CONTACT.PHONE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.phone ?? ""}`}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("CONTACT.ADDRESS_INFORMATION")}
              </span>
            </div>
            {listOpen.address && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("CONTACT.STREET")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.addressInformation?.street ?? ""}</span>
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
                  <label className='col-md-4'>{t("CONTACT.CITY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.addressInformation?.city ?? ""}</span>
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
                  <label className='col-md-4'>{t("CONTACT.PROVINCE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.addressInformation?.province ?? ""}</span>
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
                  <label className='col-md-4'>{t("CONTACT.POSTAL_CODE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.addressInformation?.postalCode ?? ""}</span>
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
                  <label className='col-md-4'>{t("CONTACT.COUNTRY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.addressInformation?.country ?? ""}</span>
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
              <span onClick={() => setListOpen({ ...listOpen, additional: !listOpen.additional })}>
                <i className={!listOpen.additional ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("CONTACT.ADDITIONAL_INFORMATION")}
              </span>
            </div>
            {listOpen.additional && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTACT.MOBILE")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.mobile ?? ""}</span>
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
                    <label className='col-md-4'>{t("CONTACT.REPORT_TO")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.report_to ?? ""}</span>
                      <i
                        className="fa fa-pencil edit-btn-permission ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTACT.FAX")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.fax ?? ""}</span>
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
                    <label className='col-md-4'>{t("CONTACT.DEPARTMENT")}</label>
                    <div className='col-md-8 text-black input-detail'>
                      <span>{data?.department ?? ""}</span>
                      <i
                        className="fa fa-pencil edit-btn-permission ml-2"
                        style={{ cursor: 'pointer' }}
                        onClick={handleEditClick}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

            </>}
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, system: !listOpen.system })}>
                <i className={!listOpen.system ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("CONTACT.SYSTEM_INFORMATION")}
              </span>
            </div>
            {listOpen.system && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTACT.CREATE_BY")}</label>
                    <div className='col-md-8 d-flex align-items-center'>
                      <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                      <div>
                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                          <span>{`${data?.firstName ?? ""} ${data?.middleName ? '(' + data?.middleName + ')' : ''} ${data?.lastName ?? ""}`}</span>
                        </span>
                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>{data?.createDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("CONTACT.EDIT_BY")}</label>
                    <div className='col-md-8 d-flex align-items-center'>
                      <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                      <div>
                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                          <span>{`${data?.firstName ?? ""} ${data?.middleName ? '(' + data?.middleName + ')' : ''} ${data?.lastName ?? ""}`}</span>
                        </span>
                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>{data?.editDate}</span>
                      </div>
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

export default ContactsDetail;
