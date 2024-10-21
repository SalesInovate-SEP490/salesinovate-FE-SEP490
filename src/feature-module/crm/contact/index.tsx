import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import './contact.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { CreateContact } from './createContact'
import { useTranslation } from 'react-i18next'
import { deleteContact, getContactById } from '../../../services/Contact'
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import ContactsDetail from './ContactDetail'
import CommonActivity from '../activity'
import { CreateOpportunity } from '../opportunities/createOpportunity'
import { getOpportunityByContact } from '../../../services/opportunities'
import { getListCampaignsByContact } from '../../../services/campaign_member'
import AddCampaignContact from './AddContactCampaign'
import UpdateCampaignContact from './UpdateCampaignContact'
import ShareData from '../../commons/ShareData'
import { checkPermissionRole } from '../../../utils/authen'
import { convertTextToDateTime } from '../../../utils/commonUtil'
const route = all_routes;

const ContactDetail = () => {
  const [contact, setContact] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [list, setList] = useState<any>({
    opportunities: [],
    campaigns: []
  });
  const [showPopups, setShowPopups] = useState<any>({
    opportunity: false,
    editOpportunity: false,
    shareData: false,
  });
  const [listId, setListId] = useState<any>({
    opportunityId: null,
    accountId: null
  });
  const [totals, setTotals] = useState<any>({
    opportunities: 0,
    campaigns: 0
  });
  const [campaign, setCampaign] = useState<any>(null);
  const { t } = useTranslation();
  const nav = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    //  getContactById();
    getContactDetail();
    getListOpportunity();
    getListCampaigns();
    checkPermissionRole(route.contactsDetails);
  }, [id]);

  const updateValueShowPopup = (key: string, value: boolean) => {
    setShowPopups((prevState: any) => ({ ...prevState, [key]: value }));
  }

  const openEditOpportunity = (id: number) => {
    updateValueShowPopup('editOpportunity', true);
    setListId((prevState: any) => ({ ...prevState, opportunity: id }));
  }

  const getListOpportunity = () => {
    const param = {
      pageNo: 0,
      pageSize: 3,
      contactId: id
    }
    getOpportunityByContact(param)
      .then(response => {
        if (response.code === 1 && response?.data?.items) {
          setList((prevState: any) => ({ ...prevState, opportunities: response.data.items }));
          setTotals((prevState: any) => ({ ...prevState, opportunities: response.data.total }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const getContactDetail = () => {
    Swal.showLoading();
    getContactById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setContact(response.data);
          setListId((prevState: any) => ({ ...prevState, accountId: response.data.accountId }));
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting contact detail: ", error)
      })
  }

  const getListCampaigns = () => {
    const param = {
      pageNo: 0,
      pageSize: 3,
      contactId: id
    }
    getListCampaignsByContact(param)
      .then(response => {
        if (response.code === 1 && response?.data?.items) {
          setList((prevState: any) => ({ ...prevState, campaigns: response.data.items }));
          setTotals((prevState: any) => ({ ...prevState, campaigns: response.data.total }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const removeContact = () => {
    // call api to delete contact
    deleteContact(id)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav(route.contacts);
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
        console.error("Error deleting contact: ", error)
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
                    <h4 className="page-title">{t("LABEL.CONTACTS.CONTACT_OVERVIEW")}</h4>
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
                        <Link to={route.contacts}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.CONTACTS.CONTACT")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
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
                      {`${contact?.firstName ?? ""} ${contact?.middleName ?? ""} ${contact?.lastName ?? ""}`}
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
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
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
                <h6>{t("LABEL.CONTACTS.CONTACT_INFORMATION")}</h6>
                <ul className="other-info">
                  <li>
                    <span className="col-4 other-title">{t("CONTACT.CREATED_DATE")}</span>
                    <span className='col-8'>{convertTextToDateTime(contact?.createDate)}</span>
                  </li>
                  <li>
                    <span className="col-4 other-title">{t("CONTACT.TITLE")}</span>
                    <span className='col-8'>{contact?.title}</span>
                  </li>
                  <li>
                    <span className="col-4 other-title">{t("CONTACT.PHONE")}</span>
                    <span className='col-8'>{contact?.phone}</span>
                  </li>
                </ul>
              </div>
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <h6>{t("LABEL.ACCOUNTS.OPPORTUNITY")} {totals?.opportunities > 3 ? `(3+)` : `(${totals?.opportunities})`}</h6>
                  {/* <Link
                    to="#"
                    className="com-add"
                    onClick={() => updateValueShowPopup('opportunity', true)}
                  >
                    <i className="ti ti-circle-plus me-1" />
                    Add New
                  </Link> */}
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
                        to="#"
                        onClick={() => updateValueShowPopup('opportunity', true)}
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
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <h6>Campaign</h6>
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
                        className="dropdown-item edit-btn-permission"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add_contact_campaign"
                      >
                        {t("ACTION.ADD")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {list?.campaigns?.map((item: any) => (
                    <li key={item.campaignId}>
                      <div className='space-between col-md-12'>
                        <div>
                          <Link to={`/campaign-details/${item?.campaignId}`}>
                            <h6 className='link-details'>{item?.campaignName}</h6>
                          </Link>
                          <div>
                            <span>{t("CAMPAIGN.START_DATE")}: {item?.startDate}</span>
                          </div>
                          <div>
                            <span>{t("CAMPAIGN.TYPE")}: {item?.campaignType?.campaignTypeName}</span>
                          </div>
                          <div>
                            <span>{t("CAMPAIGN.STATUS")}: {item?.campaignStatus?.campaignStatusName}</span>
                          </div>
                        </div>
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
                              data-bs-toggle="modal"
                              data-bs-target="#update_contact_campaign"
                              onClick={() => setCampaign(item)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_campaign_contact"
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
            {/* /Contact Sidebar */}
            {/* Contact Details */}
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
                    <div className="view-header">
                      <h4>{t("LABEL.DETAIL")}</h4>
                    </div>
                    <div className="contact-activity">
                      <ContactsDetail contact={contact} getContactDetail={getContactDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Activities */}
                  <div className="tab-pane fade" id="activities">
                    <CommonActivity id={id} type="contacts" />
                  </div>
                  {/* /Activities */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /contact Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ToastContainer />
      {/* <UpdateContact data={contact} showPopup={showPopup} setContact={setContact} setShowPopup={setShowPopup} id={id}  getContactDetail={getContactDetail} /> */}
      <CreateContact showPopup={showPopup} isEdit={true} setShowPopup={setShowPopup} id={id} getContactDetail={getContactDetail} />
      <CreateOpportunity setShowPopup={() => updateValueShowPopup('opportunity', false)} showPopup={showPopups.opportunity}
        accountId={id} getOpportunities={getListOpportunity} />
      <CreateOpportunity setShowPopup={() => updateValueShowPopup('editOpportunity', false)} showPopup={showPopups.editOpportunity}
        accountId={id} id={listId.opportunity} isEdit={true} getDetail={getListOpportunity} />
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
                <h3>{t("CONTACT.DELETE_CONTACT")}</h3>
                <p className="del-info">{t("MESSAGE.CONFIRM.DELETE")}</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    {t("ACTION.CANCEL")}
                  </Link>
                  <Link to="#" onClick={removeContact} className="btn btn-danger">
                    {t("ACTION.DELETE")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
      <AddCampaignContact contactId={id} />
      <UpdateCampaignContact data={campaign} contactId={id} getList={getListCampaigns} />
      <ShareData isOpen={showPopups.shareData} closeModal={() => updateValueShowPopup('shareData', false)} id={id} type="contact" />
    </>

  )
}

export default ContactDetail
