import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import './files.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Account } from './type'
import { deleteAccount, getAccountById } from '../../../services/account'
import { initAccount } from './data'
const route = all_routes;

const Files = () => {
  const [account, setAccount] = useState<any>(initAccount);
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();
  const nav = useNavigate();

  const { id } = useParams();
  const sortbydata = [
    { value: 'Sort By Date', label: 'Sort By Date' },
    { value: 'Ascending', label: 'Ascending' },
    { value: 'Descending', label: 'Descending' }
  ];

  useEffect(() => {
   getAccountDetail();
  }, [id]);

  const getAccountDetail = () => {
    getAccountById(id)
      .then(response => {
        if (response.code === 1) {
          setAccount(response.data);
        }
      })
      .catch(error => { })
  } 

  const removeAccount = () => {
    // call api to delete opportunity
    deleteAccount(id)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav(route.accounts);
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
                    <h4 className="page-title">{t("LABEL.ACCOUNTS.ACCOUNT_OVERVIEW")}</h4>
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
                        <Link to={route.accounts}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.ACCOUNTS.ACCOUNT")}
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
                      {account?.accountName}{" "}
                    </h5>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge badge-light">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge badge-light">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_account"
                    >
                      Delete
                    </Link>
                  </span>
                  <div className="dropdown action-drops">
                    <Link
                      to="#"
                      className="dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="bg-success">
                        Closed
                        <i className="ti ti-chevron-down ms-2" />
                      </span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link className="dropdown-item" to="#">
                        <span>Closed</span>
                      </Link>
                      <Link className="dropdown-item" to="#">
                        <span>Opened</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Sidebar */}
            <div className="col-xl-3">
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <h6>{t("LABEL.ACCOUNTS.CONTACT")}</h6>
                  <Link
                    to="#"
                    className="com-add"
                    data-bs-toggle="modal"
                    data-bs-target="#add_contact"
                  >
                    <i className="ti ti-circle-plus me-1" />
                    Add New
                  </Link>
                </div>
                <ul className="deals-info">
                  <li>
                    <span>
                      <ImageWithBasePath src="assets/img/profiles/avatar-21.jpg" alt="Image" />
                    </span>
                    <div>
                      <p>Vaughan</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Leads Sidebar */}
            {/* Leads Details */}
            <div className="col-xl-9">
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
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#activities"
                    >
                      <i className="ti ti-alarm-minus" />
                      Activities
                    </Link>
                  </li>
                  <li>
                    <Link to="#" data-bs-toggle="tab" data-bs-target="#calls">
                      <i className="ti ti-phone" />
                      Calls
                    </Link>
                  </li>
                  <li>
                    <Link to="#" data-bs-toggle="tab" data-bs-target="#email">
                      <i className="ti ti-mail-check" />
                      Email
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
                      <h5>{t("LABEL.ACCOUNTS.ACCOUNT_INFORMATION")}</h5>
                      <div className='row'>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.ACCOUNTS.ACCOUNT_NAME")}</label>
                            <div className='col-md-8 text-black'>{account?.accountName}</div>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.ACCOUNTS.PHONE")}</label>
                            <div className='col-md-8 text-black'>{account?.phone}</div>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.ACCOUNTS.TYPE")}</label>
                            <div className='col-md-8 text-black'>{account?.accountType?.accountName}</div>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className="row">
                            <label className='col-md-4'>{t("LABEL.ACCOUNTS.INDUSTRY")}</label>
                            <div className='col-md-8 text-black'>{account?.industry?.industryStatusName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Activities */}
                  <div className="tab-pane fade" id="activities">
                    <div className="view-header">
                      <h4>Activities</h4>
                      <ul>
                        <li>
                          <div className="form-sort">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className='select-details'
                              options={sortbydata}
                              placeholder="Sort By Date"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Activities */}
                  {/* Calls */}
                  <div className="tab-pane fade" id="calls">
                    <div className="view-header">
                      <h4>Calls</h4>
                      <ul>
                        <li>
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#create_call"
                            className="com-add"
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Add New
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Calls */}
                  {/* Email */}
                  <div className="tab-pane fade" id="email">
                    <div className="view-header">
                      <h4>Email</h4>
                      <ul>
                        <li>
                          <Link
                            to="#"
                            className="com-add create-mail"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            data-bs-custom-class="tooltip-dark"
                            data-bs-original-title="There are no email accounts configured, Please configured your email account in order to Send/ Create EMails"
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Create Email
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="files-activity">
                      <div className="files-wrap">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="file-info">
                              <h4>Manage Emails</h4>
                              <p>
                                You can send and reply to emails directly via this
                                section.
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 text-md-end">
                            <ul className="file-action">
                              <li>
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#create_email"
                                >
                                  Connect Account
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="files-wrap">
                        <div className="email-header">
                          <div className="row">
                            <div className="col top-action-left">
                              <div className="float-start d-none d-sm-block">
                                <input
                                  type="text"
                                  placeholder="Search Messages"
                                  className="form-control search-message"
                                />
                              </div>
                            </div>
                            <div className="col-auto top-action-right">
                              <div className="text-end">
                                <button
                                  type="button"
                                  title="Refresh"
                                  data-bs-toggle="tooltip"
                                  className="btn btn-white d-none d-md-inline-block"
                                >
                                  <i className="fa-solid fa-rotate" />
                                </button>
                                <div className="btn-group">
                                  <Link to="#" className="btn btn-white">
                                    <i className="fa-solid fa-angle-left" />
                                  </Link>
                                  <Link to="#" className="btn btn-white">
                                    <i className="fa-solid fa-angle-right" />
                                  </Link>
                                </div>
                              </div>
                              <div className="text-end">
                                <span className="text-muted d-none d-md-inline-block">
                                  Showing 10 of 112{" "}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="email-content">
                          <div className="table-responsive">
                            <table className="table table-inbox table-hover">
                              <thead>
                                <tr>
                                  <th colSpan={6} className="ps-2">
                                    <input
                                      type="checkbox"
                                      className="checkbox-all"
                                    />
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  className="unread clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa fa-star starred " />
                                    </span>
                                  </td>
                                  <td className="name">John Doe</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td>
                                    <i className="fa-solid fa-paperclip" />
                                  </td>
                                  <td className="mail-date">13:14</td>
                                </tr>
                                <tr
                                  className="unread clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">Envato Account</td>
                                  <td className="subject">
                                    Important account security update from Envato
                                  </td>
                                  <td />
                                  <td className="mail-date">8:42</td>
                                </tr>
                                <tr
                                  className="clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">Twitter</td>
                                  <td className="subject">
                                    HRMS Bootstrap Admin Template
                                  </td>
                                  <td />
                                  <td className="mail-date">30 Nov</td>
                                </tr>
                                <tr
                                  className="unread clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">Richard Parker</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td />
                                  <td className="mail-date">18 Sep</td>
                                </tr>
                                <tr
                                  className="clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">John Smith</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td />
                                  <td className="mail-date">21 Aug</td>
                                </tr>
                                <tr
                                  className="clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">me, Robert Smith (3)</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td />
                                  <td className="mail-date">1 Aug</td>
                                </tr>
                                <tr
                                  className="unread clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">Codecanyon</td>
                                  <td className="subject">Welcome To Codecanyon</td>
                                  <td />
                                  <td className="mail-date">Jul 13</td>
                                </tr>
                                <tr
                                  className="clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">Richard Miles</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td>
                                    <i className="fa-solid fa-paperclip" />
                                  </td>
                                  <td className="mail-date">May 14</td>
                                </tr>
                                <tr
                                  className="unread clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa-regular fa-star" />
                                    </span>
                                  </td>
                                  <td className="name">John Smith</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td />
                                  <td className="mail-date">11/11/16</td>
                                </tr>
                                <tr
                                  className="clickable-row"

                                >
                                  <td>
                                    <input type="checkbox" className="checkmail" />
                                  </td>
                                  <td>
                                    <span className="mail-important">
                                      <i className="fa fa-star starred " />
                                    </span>
                                  </td>
                                  <td className="name">Mike Litorus</td>
                                  <td className="subject">
                                    Lorem ipsum dolor sit amet, consectetuer
                                    adipiscing elit
                                  </td>
                                  <td />
                                  <td className="mail-date">10/31/16</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Email */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Delete Lead Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_account"
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
                <h3>{t("LABEL.ACCOUNTS.DELETE_ACCOUNT")}</h3>
                <p className="del-info">{t("MESSAGE.CONFIRM.DELETE")}</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    {t("ACTION.CANCEL")}
                  </Link>
                  <Link to="#" onClick={removeAccount} className="btn btn-danger">
                    {t("ACTION.DELETE")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
    </>

  )
}

export default Files
