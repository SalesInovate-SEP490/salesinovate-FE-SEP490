import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getIndustryList, getListStatus, getSalutationList, getSourceList, patchLead } from "../../../services/lead";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './lead.scss'
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { useSelector } from "react-redux";
const route = all_routes;
const LeadsDetail: React.FC<{ lead: any; getLeadById?: any }> = ({ lead, getLeadById }) => {
  const [data, setData] = useState<any>(lead);
  const [listOpen, setListOpen] = useState<any>({
    address: true,
    edit: false
  });
  const [leadSource, setLeadSource] = useState<any>(null);
  const [leadIndustry, setLeadIndustry] = useState<any>(null);
  const [leadStatus, setLeadStatus] = useState<any>(null);
  const [salutation, setSalutation] = useState<any>(null);
  const [rating, setRating] = useState<any>([
    { label: "Hot", value: 2 },
    { label: "Warm", value: 3 },
    { label: "Cold", value: 4 },
  ]);
  const [errors, setErrors] = useState<any>({})
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

  useEffect(() => {
    setData(lead);
  }, [lead])

  useEffect(() => {
    checkPermissionRole(route.leadsDetails);
  }, [listOpen])

  useEffect(() => {
    getIndustryList()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.industryId,
            label: item.industryStatusName
          }
        })
        setLeadIndustry(data);
      })
      .catch((err) => {
        console.log(err);
      });
    getListStatus()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.leadStatusId,
            label: item.leadStatusName
          }
        })
        setLeadStatus(data);
      })
      .catch((err) => {
        console.log(err);
      });
    getSourceList()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.leadSourceId,
            label: item.leadSourceName
          }
        })
        setLeadSource(data);
      })
      .catch((err) => {
        console.log(err);
      });

    getSalutationList()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.leadSalutionId,
            label: item.leadSalutionName
          }
        })
        setSalutation(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

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

  const handleChangeAddress = (e: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        addressInfor: {
          ...data.addressInfor,
          [name]: value
        }
      });
    }
  }

  const handleUpdate = () => {
    if (validate()) {
      const leadUpdate = {
        leadSourceId: data?.source?.leadSourceId,
        industryId: data?.industry?.industryId,
        leadStatusID: data?.status?.leadStatusId,
        leadRatingId: data?.rating?.leadRatingId,
        addressInformation: data?.addressInfor,
        firstName: data?.firstName,
        lastName: data?.lastName,
        middleName: data?.middleName,
        title: data?.title,
        email: data?.email,
        phone: data?.phone,
        website: data?.website,
        company: data?.company,
        noEmployee: data?.noEmployee,
      }
      console.log("Update lead: ", leadUpdate)
      patchLead(leadUpdate, data?.leadId)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update success");
            setListOpen({ ...listOpen, edit: false })
            getLeadById();
          } else {
            toast.error(response.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  const validate = () => {
    let tempErrors: { lastName?: string; phone?: string; company?: string; status?: any } = {};
    if (!data.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
    if (!data.company) tempErrors.company = t("MESSAGE.ERROR.REQUIRED");
    if (!data.status) tempErrors.status = t("MESSAGE.ERROR.REQUIRED");
    // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (data?.phone && !phoneRegex.test(data?.phone)) {
      tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;

  }

  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("TITLE.LEADS.LEAD_STATUS")} <span className="text-danger">*</span>
                </label>
                <div className="form-wrap w-100">
                  <Select
                    className="select"
                    options={leadStatus}
                    styles={customStyles}
                    value={leadStatus?.find((item: any) => item.value === data?.status?.leadStatusId)}
                    name="status"
                    onChange={e => handleChange(e, 'status', 'leadStatusId')}
                  />
                </div>
                {errors.status && <p className="text-danger">{errors.status}</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("TITLE.LEADS.LEAD_OWNER")}
                </label>
                <div className="form-wrap w-100">
                  <span>{userName}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="row">
                  <div className="col-md-12">
                    <label className="col-form-label">
                      {t("TITLE.LEADS.SALUTATION")}
                    </label>
                    <Select
                      className="select"
                      options={salutation}
                      styles={customStyles}
                      value={salutation?.find((item: any) => item.value === data?.salution?.leadSalutionId)}
                      name="status"
                      onChange={e => handleChange(e, 'status', 'leadStatusId')} />
                  </div>
                  <div className="col-md-12">
                    <label className="col-form-label">
                      {t("TITLE.LEADS.LAST_NAME")} <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" name="firstName"
                      onChange={(e) => handleChange(e)} value={data?.firstName} />
                  </div>
                  <div className="col-md-12">
                    <label className="col-form-label">
                      {t("TITLE.LEADS.FIRST_NAME")}
                    </label>
                    <input type="text" className="form-control" name="lastName"
                      onChange={(e) => handleChange(e)} value={data?.lastName} />

                    {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                  </div>
                  <div className="col-md-12">
                    <label className="col-form-label">
                      {t("TITLE.LEADS.MIDDLE_NAME")}
                    </label>
                    <input type="text" className="form-control" name="middleName"
                      onChange={(e) => handleChange(e)} value={data?.middleName} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Website </label>
                <input type="text" className="form-control" name="website"
                  onChange={(e) => handleChange(e)} value={data?.website} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Lead title
                </label>
                <input type="text" className="form-control" name="title"
                  onChange={(e) => handleChange(e)} value={data?.title} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    Company <span className="text-danger">*</span>
                  </label>
                </div>
                <input type="text" className="form-control" name="company"
                  onChange={(e) => handleChange(e)} value={data?.company} />
                {errors.company && <p className="text-danger">{errors.company}</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">Email </label>
                <input type="text" className="form-control" name="email"
                  onChange={(e) => handleChange(e)} value={data?.email} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Source
                </label>
                <Select
                  className="select"
                  options={leadSource}
                  styles={customStyles}
                  value={leadSource?.find((item: any) => item.value === data?.source?.leadSourceId)}
                  name="source"
                  onChange={e => handleChange(e, 'source', 'leadSourceId')}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Industry
                </label>
                <Select className="select" options={leadIndustry} styles={customStyles}
                  value={leadIndustry?.find((item: any) => item.value === data?.industry?.industryId)}
                  name="industry"
                  onChange={e => handleChange(e, 'industry', 'industryId')}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("TITLE.LEADS.NO_OF_EMPLOYEE")} </label>
                <input type="text" className="form-control" name="noEmployee"
                  onChange={(e) => handleChange(e)} value={data?.noEmployee} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Phone
                </label>
                <input type="text" className="form-control" name="phone"
                  onChange={(e) => handleChange(e)} value={data?.phone} />
                {errors.phone && <p className="text-danger">{errors.phone}</p>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("TITLE.LEADS.RATING")}
                </label>
                <Select className="select" options={rating} styles={customStyles}
                  value={rating?.find((item: any) => item.value === data?.rating?.leadRatingId)}
                  name="source"
                  onChange={e => handleChange(e, 'rating', 'leadRatingId')}
                />
              </div>
            </div>
          </div>
          <div className='col-ms-12 label-detail'>
            <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
              <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
              {t("TITLE.LEADS.ADDRESS_INFORMATION")}
            </span>
          </div>
          {
            listOpen.address &&
            <>
              <div className="col-md-6">
                <div className="row">
                  <span className="col-md-12">Address</span>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">Street</label>
                      <textarea className="form-control" name="street"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInfor?.street} >
                      </textarea>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">City</label>
                      <input type="text" className="form-control" name="city"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInfor?.city} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">State</label>
                      <input type="text" className="form-control" name="province"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInfor?.province} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-wrap">
                      <label className="col-form-label">Zip/Postal Code</label>
                      <input type="text" className="form-control" name="postalCode"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInfor?.postalCode} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-wrap">
                      <label className="col-form-label">Country</label>
                      <input type="text" className="form-control" name="country"
                        onChange={(e) => handleChangeAddress(e)} value={data?.addressInfor?.country} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-light sidebar-close">
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
        </>
        :
        <>
          <div className='row'>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("TITLE.LEADS.LEAD_STATUS")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{data?.status?.leadStatusName ?? ""}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.LEAD_OWNER")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{userName}</span>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("TITLE.LEADS.NAME")}</label>
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
                <label className='col-md-4'>{t("TITLE.LEADS.WEBSITE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.website ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.TITLE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.title ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.COMPANY")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.company ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.EMAIL")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.email ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.INDUSTRY")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.industry?.industryStatusName ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.PHONE")}</label>
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
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("TITLE.LEADS.NO_OF_EMPLOYEE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.noEmployee ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.LEAD_SOURCE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.source?.leadSourceName  ?? ""}`}</span>
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
                <label className='col-md-4'>{t("TITLE.LEADS.RATING")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.rating?.leadRatingName  ?? ""}`}</span>
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
                {t("TITLE.LEADS.ADDRESS_INFORMATION")}
              </span>
            </div>
            {listOpen.address && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("TITLE.LEADS.ADDRESS")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <div>
                      <div className="row">
                        <span className="col-md-12">
                          {data?.addressInfor?.street}
                        </span>
                        <span className="col-md-12">
                          {data?.addressInfor?.city}
                        </span>
                        <span className="col-md-12">
                          {data?.addressInfor?.province  ?? ""} {data?.addressInfor?.postalCode  ?? ""}
                        </span>
                        <span className="col-md-12">
                          {data?.addressInfor?.country}
                        </span>
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
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("TITLE.LEADS.CREATED_BY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{`${data?.firstName  ?? ""} ${data?.middleName ? '(' + data?.middleName + ')' : ''} ${data?.lastName  ?? ""}`}</span>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("TITLE.LEADS.LAST_MODIFIED_BY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{`${data?.firstName  ?? ""} ${data?.middleName ? '(' + data?.middleName + ')' : ''} ${data?.lastName  ?? ""}`}</span>
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

export default LeadsDetail;
