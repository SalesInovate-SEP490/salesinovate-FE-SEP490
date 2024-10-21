import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { getCampaignStatus, getCampaignType, patchCampaign } from "../../../services/campaign";

const DetailCampaign: React.FC<{ campaign: any; getDetail?: any }> = ({ campaign, getDetail }) => {
  const [data, setData] = useState<any>(campaign);
  const [listOpen, setListOpen] = useState<any>({ edit: false, planning: true });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusOptions, setStatusOptions] = useState<any>([]);
  const [typeOptions, setTypeOptions] = useState<any>([]);
  const { t } = useTranslation();

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    setData(campaign);
  }, [campaign]);

  useEffect(() => {
    checkPermissionRole(all_routes.campaignDetails);
  }, [listOpen]);

  useEffect(() => {
    getCampaignStatus()
      .then(response => {
        if (response.code === 1) {
          const status = response?.data?.map((item: any) => {
            return {
              value: item?.campaignStatusId,
              label: item?.campaignStatusName
            }
          });
          setStatusOptions(status);
        } else {
          toast.error(response?.message);
        }
      })
      .catch(errors => {
        console.log("errors: ", errors);
      })
    getCampaignType()
      .then(response => {
        if (response.code === 1) {
          const type = response?.data?.map((item: any) => {
            return {
              value: item?.campaignTypeId,
              label: item?.campaignTypeName
            }
          });
          setTypeOptions(type);
        } else {
          toast.error(response?.message);
        }
      })
      .catch(errors => {
        console.log("errors: ", errors);
      })
  }, [])

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

  const handleChange = (e: any, name?: string) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value,
      });
    } else {
      setData({
        ...data,
        [name || ""]: e.value,
      });
    }
    console.log("data: ", data);
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!data.campaignName) {
      tempErrors.campaignName = t("MESSAGE.ERROR.REQUIRED");
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      const updateCampaign = {
        campaignName: data.campaignName,
        campaignStatus: data.campaignStatusId,
        campaignType: data.campaignTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        num_Sent: data.num_Sent,
        budgetedCost: data.budgetedCost,
        expectedResponse: data.expectedResponse,
        actualCost: data.actualCost,
        expectedRevenue: data.expectedRevenue,
      };
      patchCampaign(data?.campaignId, updateCampaign)
        .then((response) => {
          if (response.code === 1) {
            setListOpen({ ...listOpen, edit: false });
            toast.success("Update successfully");
            if (getDetail) getDetail();
          } else {
            toast.error("Update failed");
          }
        })
        .catch(() => {
          toast.error("Update failed");
        });
    }
  };

  return (
    <>
      {listOpen.edit ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.CAMPAIGN_NAME")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="campaignName"
                  onChange={handleChange}
                  value={data?.campaignName || ""}
                />
                {errors.campaignName && <div className="text-danger">{errors.campaignName}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("CAMPAIGN.STATUS")}</label>
                <Select
                  classNamePrefix="react-select"
                  styles={customStyles}
                  options={statusOptions}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, "campaignStatusId")
                  }
                  value={statusOptions.find(
                    (option: any) => option?.value === data?.campaignStatusId
                  )}
                  placeholder={t("CAMPAIGN.SELECT_STATUS")}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("CAMPAIGN.TYPE")}</label>
                <Select
                  classNamePrefix="react-select"
                  styles={customStyles}
                  options={typeOptions}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, "campaignTypeId")
                  }
                  value={typeOptions.find(
                    (option: any) => option?.value === data?.campaignTypeId
                  )}
                  placeholder={t("CAMPAIGN.SELECT_TYPE")}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("CAMPAIGN.START_DATE")}</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  onChange={handleChange}
                  value={data?.startDate || ""}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">{t("CAMPAIGN.END_DATE")}</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  onChange={handleChange}
                  value={data?.endDate || ""}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-wrap">
                <label className="col-form-label">{t("CAMPAIGN.DESCRIPTION")}</label>
                <textarea
                  className="form-control"
                  name="description"
                  onChange={handleChange}
                  value={data?.description || ""}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.NUM_SENT_IN_CAMPAIGN")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="num_Sent"
                  onChange={handleChange}
                  value={data?.num_Sent || ""}
                />
                {errors.num_Sent && <div className="text-danger">{errors.num_Sent}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.BUDGETED_COST_IN_CAMPAIGN")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="budgetedCost"
                  onChange={handleChange}
                  value={data?.budgetedCost || ""}
                />
                {errors.budgetedCost && <div className="text-danger">{errors.budgetedCost}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.EXPECTED_RESPONSE")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="expectedResponse"
                  onChange={handleChange}
                  value={data?.expectedResponse || ""}
                />
                {errors.expectedResponse && <div className="text-danger">{errors.expectedResponse}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.ACTUAL_COST_IN_CAMPAIGN")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="actualCost"
                  onChange={handleChange}
                  value={data?.actualCost || ""}
                />
                {errors.actualCost && <div className="text-danger">{errors.actualCost}</div>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("CAMPAIGN.EXPECTED_REVENUE_IN_CAMPAIGN")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="expectedRevenue"
                  onChange={handleChange}
                  value={data?.expectedRevenue || ""}
                />
                {errors.expectedRevenue && <div className="text-danger">{errors.expectedRevenue}</div>}
              </div>
            </div>
          </div>
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-light sidebar-close">
              {t("ACTION.CANCEL")}
            </Link>
            <Link to="#" className="btn btn-primary" onClick={handleCreate}>
              {t("ACTION.UPDATE")}
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.CAMPAIGN_NAME")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.campaignName}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.STATUS")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.campaignStatus?.campaignStatusId === 1 ? "" : data?.campaignStatus?.campaignStatusName}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.TYPE")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.campaignType?.campaignTypeId === 1 ? "" : data?.campaignType?.campaignTypeName}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.START_DATE")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.startDate}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.END_DATE")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.endDate}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row detail-row">
                <label className="col-md-4">{t("CAMPAIGN.DESCRIPTION")}</label>
                <div className="col-md-8 text-black input-detail">
                  <span>{data?.description}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: "pointer" }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-ms-12 label-detail' onClick={() => setListOpen({ ...listOpen, planning: !listOpen.planning })}>
              <span>
                <i className={!listOpen.planning ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("CAMPAIGN.PLANNING")}
              </span>
            </div>
            {listOpen.planning && <>
              <div className="col-md-6">
                <div className="row detail-row">
                  <label className="col-md-4">{t("CAMPAIGN.NUM_SENT_IN_CAMPAIGN")}</label>
                  <div className="col-md-8 text-black input-detail">
                    <span>{data?.num_Sent}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row detail-row">
                  <label className="col-md-4">{t("CAMPAIGN.BUDGETED_COST_IN_CAMPAIGN")}</label>
                  <div className="col-md-8 text-black input-detail">
                    <span>{data?.budgetedCost}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row detail-row">
                  <label className="col-md-4">{t("CAMPAIGN.EXPECTED_RESPONSE")}</label>
                  <div className="col-md-8 text-black input-detail">
                    <span>{data?.expectedResponse}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row detail-row">
                  <label className="col-md-4">{t("CAMPAIGN.ACTUAL_COST_IN_CAMPAIGN")}</label>
                  <div className="col-md-8 text-black input-detail">
                    <span>{data?.actualCost}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row detail-row">
                  <label className="col-md-4">{t("CAMPAIGN.EXPECTED_REVENUE_IN_CAMPAIGN")}</label>
                  <div className="col-md-8 text-black input-detail">
                    <span>{data?.expectedRevenue}</span>
                    <i
                      className="fa fa-pencil edit-btn-permission ml-2"
                      style={{ cursor: "pointer" }}
                      onClick={handleEditClick}
                    ></i>
                  </div>
                </div>
              </div>
            </>}
          </div>
        </>
      )}
    </>
  );
};

export default DetailCampaign;
