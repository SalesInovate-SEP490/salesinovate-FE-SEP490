import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getIndustryList, getListStatus, getSalutationList, getSourceList, patchLead } from "../../../services/lead";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getListForecast, getListSource, getListStage, getListType, patchOpportunity } from "../../../services/opportunities";
import { getAccounts } from "../../../services/account";
import DatePicker from 'react-datepicker';
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { convertTextToDate, convertTextToDateTime } from "../../../utils/commonUtil";
import { getCampaign } from "../../../services/campaign";

const route = all_routes;
const DetailOpportunity: React.FC<{ opportunity: any; getDetail?: any }> = ({ opportunity, getDetail }) => {
  const [data, setData] = useState<any>(opportunity);
  const [listSelect, setListSelect] = useState<{
    forecast?: { value: number; label: string }[];
    stage?: { value: number; label: string }[];
    account?: { value: number; label: string }[];
    type?: { value: number; label: string }[];
    leadSource?: { value: number; label: string }[];
    campaignSource?: { value: number; label: string }[];
  }>({
    forecast: [],
    stage: [],
    account: [],
    type: [],
    leadSource: [],
    campaignSource: []
  });
  const [listOpen, setListOpen] = useState<any>({
    opportunityInformation: true,
    additionalInformation: true,
    descriptionInformation: true,
    edit: false
  });
  const [errors, setErrors] = useState<{
    accountName?: string; probability?: string; forecast_category?: string; stage?: string;
    closeDate?: string;
  }>({});
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };


  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    checkPermissionRole(route.opportunitiesDetails)
  }, [listOpen])


  useEffect(() => {
    getListStage()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            stage: response.data.map((item: any) => ({
              value: item.id,
              label: item.stageName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });

    getListForecast()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            forecast: response.data.map((item: any) => ({
              value: item.id,
              label: item.forecastName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });

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
    getListType()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            type: response.data.map((item: any) => ({
              value: item.id,
              label: item.typeName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
    getListSource()
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            leadSource: response.data.map((item: any) => ({
              value: item.leadSourceId,
              label: item.leadSourceName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
    getCampaign({ pageNo: 0, pageSize: 1000 })
      .then(response => {
        if (response.code === 1) {
          setListSelect(prevState => ({
            ...prevState,
            campaignSource: response?.data?.items.map((item: any) => ({
              value: item.campaignId,
              label: item.campaignName
            }))
          }));
        }
      })
      .catch(err => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    checkPermissionRole(all_routes.opportunitiesDetails)
  }, [listOpen])

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


  const validate = () => {
    let tempErrors: { accountName?: string; probability?: string; forecast_category?: string; stage?: string; closeDate?: string; } = {};
    if (!data.accountId) {
      tempErrors.accountName = t("MESSAGE.ERROR.REQUIRED");
    }
    if (!data.probability) {
      tempErrors.probability = t("MESSAGE.ERROR.REQUIRED");
    }
    if (!data.forecast) {
      tempErrors.forecast_category = t("MESSAGE.ERROR.REQUIRED");
    }
    if (!data.stage) {
      tempErrors.stage = t("MESSAGE.ERROR.REQUIRED");
    }
    if (!selectedDate) {
      tempErrors.closeDate = t("MESSAGE.ERROR.REQUIRED");
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  useEffect(() => {
    setData({
      ...opportunity,
      campaignSourceId: opportunity?.primaryCampaignSourceId,
      campaignSource: opportunity?.primaryCampaignSourceId ? { value: opportunity?.primaryCampaignSourceId, label: opportunity?.campaignSourceName } : undefined,
    });
  }, [opportunity]);

  const handleCreate = () => {
    if (validate()) {
      opportunity.last_modified_by = 1;
      opportunity.closeDate = selectedDate ? selectedDate?.toISOString() : '';
      const newOpportunity = {
        id: data?.opportunityId,
        accountId: data?.accountId,
        amount: data?.amount,
        closeDate: data?.closeDate,
        description: data?.description,
        forecast: data?.forecast?.forecastCategoryId,
        leadSourceId: data?.leadSource?.leadSourceId,
        nextStep: data?.nextStep,
        opportunityName: data?.opportunityName,
        probability: data?.probability,
        stage: data?.stage?.stageId,
        type: data?.type?.typeId,
        primaryCampaignSourceId: data?.campaignSource?.campaignSourceId ? data?.campaignSource?.campaignSourceId : undefined,
        leadSource: data?.leadSource?.leadSourceId ? data?.leadSource?.leadSourceId : undefined,
      }
      newOpportunity.id = opportunity.opportunityId;
      patchOpportunity(newOpportunity)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update opportunity successfully!");
            setListOpen({ ...listOpen, edit: false });
            getDetail();
          } else {
            toast.error("Update opportunity failed!");
          }
        })
        .catch(err => { });
    }
  }

  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
            <div className='col-ms-12 label-detail'>
              <span>
                {t("LABEL.OPPORTUNITIES.OPPORTUNITY_INFORMATION")}
              </span>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("LABEL.OPPORTUNITIES.ACCOUNT_NAME")} <span className="text-danger">*</span>
                </label>
                <Select
                  className="select"
                  options={listSelect?.account}
                  styles={customStyles}
                  value={listSelect?.account?.find((item: any) => item.value === data?.accountId)}
                  name="account"
                  onChange={e => handleChange(e, 'account', 'accountId')}
                />
                {errors.accountName && <span className="text-danger">{errors.accountName}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    {t("LABEL.OPPORTUNITIES.PROBABILITY")} <span className="text-danger">*</span>
                  </label>
                </div>
                <input type="text" className="form-control" name="probability"
                  onChange={(e) => handleChange(e)} value={data?.probability} />
                {errors.probability && <span className="text-danger">{errors.probability}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <label className="col-form-label">
                {t("LABEL.OPPORTUNITIES.FORECAST_CATEGORY")} <span className="text-danger">*</span>
              </label>
              <div className="form-wrap w-100">
                <Select
                  className="select"
                  options={listSelect?.forecast}
                  styles={customStyles}
                  value={listSelect?.forecast?.find((item: any) => item.value === data?.forecast?.forecastCategoryId)}
                  name="forecast_category"
                  onChange={e => handleChange(e, 'forecast', 'forecastCategoryId')}
                />
                {errors.forecast_category && <span className="text-danger">{errors.forecast_category}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("LABEL.OPPORTUNITIES.STAGE")} <span className="text-danger">*</span>
                </label>
                <Select
                  className="select"
                  options={listSelect?.stage}
                  styles={customStyles}
                  value={listSelect?.stage?.find((item: any) => item.value === data?.stage?.stageId)}
                  name="stage"
                  onChange={e => handleChange(e, 'stage', 'stageId')}
                />
                {errors.stage && <span className="text-danger">{errors.stage}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME")}</label>
                <input type="text" className="form-control" name="opportunityName"
                  onChange={(e) => handleChange(e)} value={data?.opportunityName} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.OPPORTUNITIES.NEXT_STEP")}</label>
                <input type="text" className="form-control" name="nextStep"
                  onChange={(e) => handleChange(e)} value={data?.nextStep} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.OPPORTUNITIES.AMOUNT")}</label>
                <input type="text" className="form-control" name="amount"
                  onChange={(e) => handleChange(e)} value={data?.amount} />
              </div>
            </div>
            <div className="col-md-6">
              <label className="col-form-label">
                {t("LABEL.OPPORTUNITIES.CLOSE_DATE")} <span className="text-danger"> *</span>
              </label>
              <div className="icon-form">
                <span className="form-icon">
                  <i className="ti ti-calendar-check" />
                </span>
                <DatePicker
                  className="form-control datetimepicker deals-details w-100"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                />
                {errors.closeDate && <span className="text-danger">{errors.closeDate}</span>}
              </div>
            </div>
            <div className='col-ms-12 label-detail'>
              <span>
                {t("LABEL.OPPORTUNITIES.ADDITIONAL_INFORMATION")}
              </span>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("LABEL.OPPORTUNITIES.TYPE")}
                </label>
                <Select
                  className="select"
                  options={listSelect?.type}
                  styles={customStyles}
                  value={listSelect?.type?.find((item: any) => item.value === data?.type?.typeId)}
                  name="account"
                  onChange={e => handleChange(e, 'type', 'typeId')}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="col-md-12">
                  <label className="col-form-label">
                    {t("LABEL.OPPORTUNITIES.LEAD_SOURCE")}
                  </label>
                  <Select
                    className="select"
                    options={listSelect?.leadSource}
                    styles={customStyles}
                    value={listSelect?.leadSource?.find((item: any) => item.value === data?.leadSource?.leadSourceId)}
                    name="account"
                    onChange={e => handleChange(e, 'leadSource', 'leadSourceId')}
                  />
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    {t("LABEL.OPPORTUNITIES.PRIMARY_CAMPAIGN_SOURCE")}
                  </label>
                  <Select
                    className="select"
                    options={listSelect?.campaignSource}
                    styles={customStyles}
                    value={listSelect?.campaignSource?.find((item: any) => item.value === data?.campaignSourceId)}
                    name="account"
                    onChange={e => handleChange(e, 'campaignSource', 'campaignSourceId')}
                  />
                </div>
              </div>
            </div>
            <div className='col-ms-12 label-detail'>
              <span>
                {t("LABEL.OPPORTUNITIES.DESCRIPTION_INFORMATION")}
              </span>
            </div>
            <div className="col-md-12">
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.OPPORTUNITIES.DESCRIPTION")}</label>
                <textarea className="form-control" name="description"
                  onChange={(e) => handleChange(e)} value={data?.description} />
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
              <span onClick={() => setListOpen({ ...listOpen, opportunityInformation: !listOpen.opportunityInformation })}>
                <i className={!listOpen.opportunityInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("LABEL.OPPORTUNITIES.OPPORTUNITY_INFORMATION")}
              </span>
            </div>
            {listOpen.opportunityInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.ACCOUNT_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <Link to={`/accounts-details/${data?.accountId}`}>{data?.accountName}</Link>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.PROBABILITY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.probability ? data?.probability + '%' : ''}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.OPPORTUNITY_OWNER")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    {<span>{data?.owner}</span>}
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.FORECAST_CATEGORY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.forecast?.forecastName}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.opportunityName}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.NEXT_STEP")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.nextStep}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.AMOUNT")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.amount?.toLocaleString()} đ</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.STAGE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.stage?.stageName}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.CLOSE_DATE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{convertTextToDate(data?.closeDate)}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.REVENUE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{(data?.amount * data?.probability / 100)?.toLocaleString() || 0} đ</span>
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
                {t("LABEL.OPPORTUNITIES.ADDITIONAL_INFORMATION")}
              </span>
            </div>
            {listOpen.additionalInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.TYPE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.type?.typeName}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.LEAD_SOURCE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{data?.leadSource?.leadSourceName}</span>
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
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.PRIMARY_CAMPAIGN_SOURCE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <span>{listSelect?.campaignSource?.find((item: any) => item.value === data?.primaryCampaignSourceId)?.label}</span>
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
              <span onClick={() => setListOpen({ ...listOpen, descriptionInformation: !listOpen.descriptionInformation })}>
                <i className={!listOpen.descriptionInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("LABEL.OPPORTUNITIES.DESCRIPTION_INFORMATION")}
              </span>
            </div>
            {listOpen.descriptionInformation && <>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.OPPORTUNITIES.DESCRIPTION")}</label>
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
            </>}
          </div>
        </>
      }

    </>

  )
}

export default DetailOpportunity;
