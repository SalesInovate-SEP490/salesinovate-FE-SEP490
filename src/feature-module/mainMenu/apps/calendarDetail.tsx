import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { DetailEvent } from './detailEvent'
import { deleteEventById, getDetailEvent } from '../../../services/event'
import EventModal from './EventModal'
import DeleteModal from '../../support/deleteModal'

const route = all_routes;

const CalendarDetail = () => {
  const [event, setEvent] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    getEventDetail();
  }, [id]);

  const getEventDetail = () => {
    Swal.showLoading();
    getDetailEvent(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          const data = response.data;
          setEvent(response.data);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error", error);
      })
  }

  const removeEvent = () => {
    Swal.showLoading();
    deleteEventById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Delete Event successfully");
          document.getElementById("close_btn_event")?.click();
          getEventDetail();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error deleting Event: ", error);
      })
  }

  const convertDateToString = (date: any) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
    return formattedDate;
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
                    <h4 className="page-title">{t("EVENT.EVENT_OVERVIEW")}</h4>
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
                      <li>
                        <Link to={route.calendar}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("EVENT.EVENT")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">

                  </div>
                </div>
              </div>
              <div className="contact-wrap">
                <div className="contact-profile">
                  <div className="avatar company-avatar">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Circle-icons-calendar.svg/800px-Circle-icons-calendar.svg.png" alt="" />
                  </div>
                  <div className="name-user">
                    <h5>
                      {event?.campaignName}
                    </h5>
                    <div>{`${t("CAMPAIGN.TYPE")}: ${event?.eventSubject?.eventSubjectContent}`}</div>
                    <div>{`${t("CAMPAIGN.START_DATE")}: ${event?.startTime ? convertDateToString(event?.startTime) : ''}`}</div>
                    <div>{`${t("CAMPAIGN.END_DATE")}: ${event?.endTime ? convertDateToString(event?.endTime) : ''}`}</div>
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
                      data-bs-target="#delete_event"
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
                      <DetailEvent data={event} getDetail={getEventDetail} />
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
      <EventModal closeModal={() => { setShowPopup(false) }} isOpen={showPopup} getDetail={getEventDetail} isEdit={true} id={id} />
      <DeleteModal deleteId="delete_event" closeBtn="close_btn_event" handleDelete={removeEvent} />
    </>

  )
}

export default CalendarDetail
