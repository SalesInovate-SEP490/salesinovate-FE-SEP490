import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { deleteEventById, getDetailEvent } from '../../../services/event'
import EventModal from './EventModal'
import DeleteModal from '../../support/deleteModal'
import { FixDetailLogCall } from './detailLogCall'
import { deleteLogCall, getDetailLogCall } from '../../../services/logCall'
import CallModal from './CallModal'

const route = all_routes;

const LogCallDetail = () => {
  const [logCall, setLogCall] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getLogCallDetail();
  }, [id]);

  const getLogCallDetail = () => {
    Swal.showLoading();
    getDetailLogCall(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          const data = response.data;
          const label = data?.leadsResponse ? "lead" : "contact";
          const value = data?.leadsResponse ? data?.leadsResponse : data?.contactReponses[0];
          const label2 = data?.accountResponse ? "account" : "opportunity";
          const value2 = data?.accountResponse ? data?.accountResponse : data?.opportunityResponse;
          setLogCall({
            ...data,
            type: data?.eventSubject?.eventSubjectId,
            [label]: value,
            [label2]: value2,
            priority: data?.eventPriority?.eventPriorityId,
            status: data?.eventStatus?.eventStatusId,
          });
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error", error);
      })
  }

  const removeLogCall = () => {
    Swal.showLoading();
    deleteLogCall(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Delete Log Call successfully");
          document.getElementById("close_btn_dc")?.click();
          getLogCallDetail();
          navigate("/");
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error deleting Event: ", error);
      })
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">{t("LOG_CALL.LOG_CALL_OVERVIEW")}</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {/* Leads User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">

                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">

                  </div>
                </div>
              </div>
              <div className="contact-wrap">
                <div className="contact-profile">
                  <div className="avatar company-avatar">
                  </div>
                  <div className="name-user">
                    <h5>
                      {logCall?.campaignName}
                    </h5>
                    <div>{`${t("CAMPAIGN.TYPE")}: ${logCall?.eventSubject?.eventSubjectContent}`}</div>
                    <div>{`${t("LOG_CALL.NAME")}: ${logCall?.leadsResponse ? logCall?.leadsResponse?.leadName : (logCall?.contactReponses ? logCall?.contactReponses[0]?.contactName : "")}`}</div>
                    <div>{`${t("EVENT.RELATED_TO")}: ${logCall?.accountResponse ? logCall?.accountResponse?.accountName : ""}`}</div>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_log_call"
                    >
                      {t("ACTION.DELETE")}
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Details */}
            <div className="col-xl-12">
              <div className="contact-tab-wrap">
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#details"
                      className="active"
                    >
                      Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#related"
                    >
                      Related
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Tab Content */}
              <div className="contact-tab-view">
                <div className="tab-content pt-0">
                  {/* Details */}
                  <div className="tab-pane active show" id="details">
                    <div className="calls-activity">
                      <FixDetailLogCall data={logCall} getDetail={getLogCallDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="related">
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12 header-border'>
                        <ul>
                          <h4>{t("EVENT.FILES")}</h4>
                        </ul>
                        <ul>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black"
                            data-bs-toggle="modal"
                            data-bs-target="#add_leads_campaign"
                          >
                            {t("CAMPAIGN.ADD_LEAD")}
                          </Link>
                        </ul>
                      </div>
                      <div className='col-md-12'>
                      </div>
                    </div>
                  </div>
                  {/* /Activities */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ToastContainer />
      <CallModal closeModal={() => { setShowPopup(false) }} isOpen={showPopup} getList={getLogCallDetail} isEdit={true} id={id} />
      <DeleteModal deleteId="delete_log_call" closeBtn="close_btn_dc" handleDelete={removeLogCall} />
    </>

  )
}

export default LogCallDetail
