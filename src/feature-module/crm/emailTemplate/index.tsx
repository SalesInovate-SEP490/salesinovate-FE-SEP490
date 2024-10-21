import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ContentAccount from './createcontent'
import SuccessMail from './sucessmail'
import AddContent from './addcontent'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import './emailTemplate.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { UpdateEmailTemplate } from './updateEmailTemplate'
import { useTranslation } from 'react-i18next'
import { deleteEmailTemplate, getEmailTemplate } from '../../../services/emailTemplate'
import { EmailTemplate } from './type'
import EmailTemplateUpload from './emailTemplateUpload'
const route = all_routes;

const EmailTemplateDetail = () => {
  const [email, setEmail] = useState<EmailTemplate>({
    id: 0,
    emailTemplateId: 0,
    mailSubject: "",
    htmlContent: "",
    userId: "0",
    isDeleted: 0,
    sendTo: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const nav = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    getDetailEmailTemplate();
  }, [id]);

  const getDetailEmailTemplate = () => {
    getEmailTemplate(id)
      .then((response: any) => {
        if (response.code === 1) {
          setEmail(response.data);
        }
      })
      .catch((error: any) => { })
  }

  const removeEmailTemplate = () => {
    // call api to delete opportunity
    deleteEmailTemplate(email?.emailTemplateId)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          nav(route.emailTemplate);
          customToast("success", response.message);
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
      })
  }

  const customToast = (type: string, message: string) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
    }
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
                    <h4 className="page-title">{t("LABEL.EMAIL_TEMPLATE.EMAIL_TEMPLATE_OVERVIEW")}</h4>
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
                        <Link to={route.emailTemplate}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.EMAIL_TEMPLATE.EMAIL_TEMPLATE")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
                      <ul>
                        <li>
                          <Link to="/leads-details">
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to="/leads-details">
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-wrap">
                <div className="contact-profile">
                  <div className="avatar company-avatar">
                    <span className="text-icon">HT</span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {email?.emailTemplateId}{" "}
                    </h5>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black add-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#send_mail"
                    >
                      {t("ACTION.SEND_MAIL")}
                    </Link>
                  </span>
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black delete-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_lead"
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
                      <i className="ti ti-alarm-minus" />
                      Details
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
                      <h5>{t("LABEL.EMAIL_TEMPLATE.MESSAGE_CONTENT")}</h5>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.EMAIL_TEMPLATE.MAIL_SUBJECT")}</label>
                            <div className='col-md-8 text-black'>{email?.mailSubject}</div>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.EMAIL_TEMPLATE.HTML_VALUE")}</label>
                            <div
                              className='col-md-8 text-black'
                              dangerouslySetInnerHTML={{ __html: email?.htmlContent }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Details */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ContentAccount />
      <SuccessMail />
      <AddContent />
      <ToastContainer />
      <UpdateEmailTemplate data={email} showPopup={showPopup} setShowPopup={setShowPopup} id={id} getDetail={getDetailEmailTemplate} />
      {/* Delete Lead Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_lead"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Delete Opportunity</h3>
                <p className="del-info">Are you sure want to delete?</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="#" onClick={removeEmailTemplate} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
      {/* Send Mail Modal */}
      <div
        className="modal custom-modal fade"
        id="send_mail"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <h3>{t("LABEL.EMAIL_TEMPLATE.SEND_MAIL")}</h3>
                <div className="col-lg-12 text-center modal-btn">
                  <EmailTemplateUpload id={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Send Mail Modal */}
    </>
  )
}

export default EmailTemplateDetail;
