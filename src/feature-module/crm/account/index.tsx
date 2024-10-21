import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import './account.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { deleteAccount, getAccountById } from '../../../services/account'
import { initAccount } from './data'
import { deleteContact, getListContactByAccount } from '../../../services/Contact'
import { deleteOpportunity, getListOpportunityByAccount } from '../../../services/opportunities'
import DetailAccount from './AccountDetail'
import { CreateAccount } from './createAccount'
import { CreateContact } from '../contact/createContact'
import { CreateOpportunity } from '../opportunities/createOpportunity'
import CommonActivity from '../activity'
import DeleteModal from '../../support/deleteModal'
import ShareData from '../../commons/ShareData'
import { checkPermissionRole } from '../../../utils/authen'
const route = all_routes;

const AccountDetail = () => {
  const [account, setAccount] = useState<any>(initAccount);
  const [list, setList] = useState<any>({
    contacts: [],
    opportunities: []
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showPopups, setShowPopups] = useState<any>({
    contact: false,
    opportunity: false,
    editContact: false,
    editOpportunity: false,
    shareData: false
  });
  const [listId, setListId] = useState<any>({
    contactId: null,
    opportunityId: null
  });
  const { t } = useTranslation();
  const nav = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    getAccountDetail();
    checkPermissionRole(route.accountsDetails);
  }, [id]);

  const getAccountDetail = () => {
    getDetail();
    getListContact();
    getListOpportunity();
  }

  const getDetail = () => {
    getAccountById(id)
      .then(response => {
        if (response.code === 1) {
          setAccount(response.data);
        }
      })
      .catch(error => { })
  }

  const getListContact = () => {
    const param = {
      pageNo: 0,
      pageSize: 3,
      id
    }
    getListContactByAccount(param)
      .then(response => {
        console.log("Response List Contact: ", response);
        if (response.code === 1) {
          setList((prevState: any) => ({ ...prevState, contacts: response.data.items })
          );
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const getListOpportunity = () => {
    const param = {
      pageNo: 0,
      pageSize: 3,
      accountId: id
    }
    getListOpportunityByAccount(param)
      .then(response => {
        if (response.code === 1) {
          setList((prevState: any) => ({ ...prevState, opportunities: response.data.items }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
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

  const updateValueShowPopup = (key: string, value: boolean) => {
    setShowPopups((prevState: any) => ({ ...prevState, [key]: value }));
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

  const openEditOpportunity = (id: any) => {
    setListId((prevState: any) => ({
      ...prevState, opportunity: id
    }));
    setShowPopups((prevState: any) => ({ ...prevState, editOpportunity: true }));
  }

  const openEditContact = (id: any) => {
    setListId((prevState: any) => ({
      ...prevState, contactId: id
    }));
    setShowPopups((prevState: any) => ({ ...prevState, editContact: true }));
  }

  const removeOpportunity = () => {
    deleteOpportunity(listId.opportunity)
      .then(response => {
        if (response.code === 1) {
          customToast("success", "Delete opportunity success.");
          document.getElementById('close-btn-do')?.click();
          getListOpportunity();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
      })
  }

  const removeContact = () => {
    deleteContact(listId.contactId)
      .then(response => {
        if (response.code === 1) {
          customToast("success", "Delete contact success.");
          document.getElementById('close-btn-do')?.click();
          getListContact();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
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
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black assign-btn-permission"
                      onClick={() => updateValueShowPopup('shareData', true)}
                    >
                      {t("ACTION.ASSIGN")}
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
                      data-bs-target="#delete_account"
                    >
                      {t("ACTION.DELETE")}
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Sidebar */}
            <div className="col-xl-3">
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <h6>{t("LABEL.ACCOUNTS.CONTACT")}</h6>
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link
                        className="dropdown-item add-btn-permission"
                        onClick={() => updateValueShowPopup('contact', true)}
                        to="#"
                      >
                        {t("ACTION.ADD")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {list.contacts?.map((item: any, index: number) => (
                    <li key={`conatct${index}`} >
                      <div className='space-between col-md-12'>
                        <Link to={`/contacts-details/${item.contactId}`}>
                          <p>{item?.firstName + ' ' + item?.lastName}</p>
                        </Link>
                        <div className="dropdown table-action">
                          <Link
                          to="#"
                            className="action-icon"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa fa-ellipsis-v" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              onClick={() => openEditContact(item.contactId)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_contact"
                              onClick={() => setListId((prevState: any) => ({ ...prevState, contactId: item.contactId }))}
                            >
                              {t("ACTION.DELETE")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <h6>{t("LABEL.ACCOUNTS.OPPORTUNITY")}</h6>
                  <div className="dropdown table-action">
                    <Link
                      to="#"
                      className="action-icon"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                      <Link
                        className="dropdown-item add-btn-permission"
                        onClick={() => updateValueShowPopup('opportunity', true)}
                        to="#"
                      >
                        {t("ACTION.ADD")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {list?.opportunities?.map((item: any, index: number) => (
                    <li key={`opportunity${index}`}>
                      <div className='space-between col-md-12'>
                        <p>{item?.opportunityName}</p>
                        <div className="dropdown table-action">
                          <Link
                            to="#"
                            className="action-icon"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa fa-ellipsis-v" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              onClick={() => openEditOpportunity(item.opportunityId)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_opportunity"
                              onClick={() => setListId((prevState: any) => ({ ...prevState, opportunity: item.opportunityId }))}
                            >
                              {t("ACTION.DELETE")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
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
                      Details
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#activities"
                    >
                      Activities
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
                      <DetailAccount account={account} getDetail={getDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Activities */}
                  <div className="tab-pane fade" id="activities">
                    <CommonActivity id={id} type="accounts" />
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
      <CreateAccount setShowPopup={setShowPopup} showPopup={showPopup} getDetail={getAccountDetail} isEdit={true} id={id} />
      <CreateContact setShowPopup={() => updateValueShowPopup('contact', false)} showPopup={showPopups.contact} accountId={id} />
      <CreateContact setShowPopup={() => updateValueShowPopup('editContact', false)} showPopup={showPopups.editContact}
        accountId={id} id={listId.contactId} isEdit={true} getContactDetail={getListContact} />
      <CreateOpportunity setShowPopup={() => updateValueShowPopup('opportunity', false)} showPopup={showPopups.opportunity}
        accountId={id} getOpportunities={getListOpportunity} />
      <CreateOpportunity setShowPopup={() => updateValueShowPopup('editOpportunity', false)} showPopup={showPopups.editOpportunity}
        accountId={id} id={listId.opportunity} isEdit={true} getDetail={getListOpportunity} />
      <DeleteModal deleteId="delete_opportunity" closeBtn="close-btn-do" handleDelete={removeOpportunity} />
      <DeleteModal deleteId="delete_contact" closeBtn="close-btn-do" handleDelete={removeContact} />
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
      <ShareData isOpen={showPopups.shareData} closeModal={() => updateValueShowPopup('shareData', false)} id={id} type="account" />
    </>

  )
}

export default AccountDetail
