import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CreateLeads } from './createLead';
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { getLeadDetail, getListStatus, getSalutationList, patchLead, removeLead } from '../../../services/lead'
import './leads.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { convertNewLead, filterAccount } from '../../../services/account'
import { convertFromExisting, convertFromLead, getListContact } from '../../../services/Contact'
import { convertNewFromLead, convertOpportunityFromExisting, getByAccountId } from '../../../services/opportunities';
import CommonActivity from '../activity/index';
import _ from 'lodash';
import Swal from 'sweetalert2'
import LeadsDetail from './LeadsDetail'
import AddCampaignLead from './AddLeadCampaign';
import UpdateCampaignLead from './UpdateCampaignLead';
import { getListCampaignsByLead } from '../../../services/campaign_member';
import ShareData from '../../commons/ShareData';
import { getUsers } from '../../../services/user';
import { checkPermissionRole } from '../../../utils/authen';
import { convertTextToDateTime } from '../../../utils/commonUtil';
import { getAllConfigLead } from '../../../services/config';
const route = all_routes;

const LeadsDetails = () => {
  const [lead, setLead] = useState<any>(null);
  const [status, setStatus] = useState<any>({});
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [convertData, setConvertData] = useState<{
    account?: string; opportunity?: string; contact?:
    { salutation?: string; firstName?: string; middleName?: string; lastName?: string; },
    typeAccount?: boolean; typeOpportunity?: boolean; typeContact?: boolean;
    accountId?: any; opportunityId?: any; contactId?: any; convertFinish?: boolean;
  }>({ typeAccount: true, typeOpportunity: true, typeContact: true, convertFinish: false });
  const [accountList, setAccountList] = useState<any>([]);
  const [assigns, setAssigns] = useState<any>({
    account: [],
    contact: [],
    opportunity: []
  });
  const [opportunityList, setOpportunityList] = useState<any>([]);
  const [contactList, setContactList] = useState<any>([]);
  const [listStatus, setListStatus] = useState<any>([]);
  const [salutation, setSalutation] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any>([]);
  const [campaignEdit, setCampaignEdit] = useState<any>(null);
  const [showShareData, setShowShareData] = useState(false);
  const [listUser, setListUser] = useState<any>([]);
  const { t } = useTranslation();
  const { id } = useParams();
  const nav = useNavigate();

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    getStatusList();
    getSalutations();
    getCampaignByLead();
    getListUser();
    assignMySelf();
    checkPermissionRole(route.leadsDetails);
  }, []);

  useEffect(() => {
    Swal.showLoading();
    getLeadById();
    getContacts();
  }, [id]);

  const assignMySelf = () => {
    const userId = localStorage.getItem('userId') || '';
    if (userId) {
      setAssigns({
        account: [],
        contact: [],
        opportunity: []
      });
    }
  }

  const getLeadById = () => {
    getLeadDetail(id)
      .then((response: any) => {
        if (response.code === 1) {
          Swal.close();
          const data = response.data;
          setLead(data);
          setStatus(data?.status?.leadStatusId);
          setConvertData({
            ...convertData,
            account: data.company, opportunity: data.company,
            contact: {
              salutation: data?.salution?.leadSalutionId,
              firstName: data?.firstName, middleName: data?.middleName, lastName: data?.lastName
            }
          });
        } else {
          Swal.close();
          customToast("error", response.message);
        }
      })
      .catch((error: any) => {
        console.log("Error: ", error);
        customToast("error", "System error, contact with admin to fix.");
      })
  }

  const getListUser = () => {
    getUsers()
      .then((res) => {
        if (res.code === 1) {
          setListUser(res?.data?.map((item: any) => {
            return {
              value: item?.userId,
              label: item?.userName
            }
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getSalutations = () => {
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
  }

  const getStatusList = () => {
    getListStatus()
      .then(response => {
        if (response.code === 1) {
          setListStatus(response?.data?.map((item: any) => {
            item.id = item.leadStatusId;
            return item;
          }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const getContacts = () => {
    const param = {
      pageNo: 0,
      pageSize: 200
    }
    getListContact(param)
      .then(response => {
        if (response.code === 1) {
          setContactList(response.data.items.map((item: any) => {
            return {
              value: item.contactId,
              label: item.firstName + " " + item.lastName
            }
          })
          );
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const changePipeStatus = () => {
    if (lead != null) {
      const updatedLead: any = {};
      lead.status.leadStatusId = status !== lead?.status?.leadStatusId ? status : lead?.status?.leadStatusId + 1;
      setLead({ ...lead, status: { leadStatusId: lead?.status?.leadStatusId } });
      setStatus(lead?.status?.leadStatusId);
      updatedLead.leadStatusID = lead?.status?.leadStatusId;
      const finalStage = listStatus[listStatus.length - 1].leadStatusId;
      if (status === finalStage) {
        document.getElementById('convert-lead-btn')?.click();
      } else {
        patchLead(updatedLead, lead.leadId)
          .then(response => {
            if (response.code === 1) {
              customToast("success", response.message);
              getLeadById();
            } else {
              customToast("error", response.message);
            }
          })
          .catch(error => {
            customToast("error", "System error, contact with admin to fix.");
            console.log("Error: ", error);
          })
      }
    }
  }

  const deleteLead = () => {
    // call api to delete lead
    removeLead(lead?.leadId)
      .then(response => {
        document.getElementById('close-btn-delete')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav('/leads')
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
      })
  }

  const convertLead = () => {
    Swal.showLoading();
    if (convertData.typeAccount) {
      const data = {
        leadId: lead?.leadId,
        accountName: convertData.account,
        userDTOS: assigns.account.map((item: any) => {
          return {
            userId: item
          }
        })
      }
      convertNewLead(data)
        .then(response => {
          if (response.code === 1) {
            const accountId = response.data;
            setConvertData({ ...convertData, accountId: accountId });
            convertLeadToContact(accountId);
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          customToast("error", "System error, contact with admin to fix.");
        })
    } else {
      convertLeadToContact(convertData.accountId);
    }
  }

  const convertLeadToContact = (accountId: any) => {
    if (convertData.typeContact) {
      const data = {
        accountId: accountId,
        salution: convertData.contact?.salutation,
        firstName: convertData.contact?.firstName,
        middleName: convertData.contact?.middleName,
        lastName: convertData.contact?.lastName,
        leadId: lead?.leadId,
        userDTOS: assigns.contact.map((item: any) => {
          return {
            userId: item
          }
        })
      }
      convertFromLead(data)
        .then(response => {
          if (response.code === 1) {
            const contactId = response.data;
            setConvertData({ ...convertData, contactId: contactId });
            convertLeadToOpportunity(contactId, accountId);
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          Swal.close();
          customToast("error", "System error, contact with admin to fix.");
        })
    } else {
      const data =
        assigns.contact.map((item: any) => {
          return {
            userId: item
          }
        })
      convertFromExisting(data, convertData.contactId, accountId, id)
        .then(response => {
          if (response.code === 1) {
            convertLeadToOpportunity(convertData.contactId, accountId);
            customToast("success", response.message);
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          Swal.close();
          customToast("error", "System error, contact with admin to fix.");
        })
    }
  }

  const convertLeadToOpportunity = (contactId: any, accountId: any) => {
    if (convertData.typeOpportunity) {
      const data = {
        accountId,
        opportunityName: convertData.opportunity,
        contactId: contactId,
        leadId: lead?.leadId,
        userDTOS: assigns.opportunity.map((item: any) => {
          return {
            userId: item
          }
        })
      }
      convertNewFromLead(data)
        .then(response => {
          Swal.close();
          if (response.code === 1) {
            customToast("success", "Convert lead success.");
            setConvertData({ ...convertData, convertFinish: true, contactId, accountId });
            removeLead(lead?.leadId)
              .then(response => {
              })
              .catch(error => {
              })
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          customToast("error", "System error, contact with admin to fix.");
        })
    } else {
      const body =
        assigns.opportunity.map((item: any) => {
          return {
            userId: item
          }
        })
      convertOpportunityFromExisting(contactId, convertData.opportunityId, id, body)
        .then(response => {
          Swal.close();
          if (response.code === 1) {
            customToast("success", "Convert lead success.");
            setConvertData({ ...convertData, convertFinish: true, contactId, accountId });
            removeLead(lead?.leadId)
              .then(response => {
              })
              .catch(error => {
              })
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          Swal.close();
          customToast("error", "System error, contact with admin to fix.");
        })
    }
  }

  const handleSearchAccount = (e: any) => {
    // call api to search account
    if (e && e !== '')
      debounceFetchResults(e);
  }

  const debounceFetchResults = useCallback(
    _.debounce(async (query) => {
      if (query) {
        const param = {
          search: `accountName@${query}`,
          page: 0,
          size: 500
        }
        filterAccount(param)
          .then(response => {
            if (response.code === 1) {
              setAccountList(response.data.items.map((item: any) => {
                return {
                  value: item.accountId,
                  label: item.accountName
                }
              })
              );
            }
          })
          .catch(error => {
            console.log("Error: ", error);
          })
      }
    }, 300),
    []
  );

  useEffect(() => {
    const params = {
      accountId: convertData.accountId,
      currentPage: 0,
      perPage: 100
    }
    if (!convertData.typeOpportunity)
      getByAccountId(params)
        .then(response => {
          if (response.code === 1) {
            setOpportunityList(response.data.items.map((item: any) => {
              return {
                value: item.opportunityId,
                label: item.opportunityName
              }
            })
            );
          }
        })
        .catch(error => {
          console.log("Error: ", error);
        })
  }, [convertData.accountId, convertData.typeOpportunity])

  const getCampaignByLead = () => {
    const param = {
      leadId: id,
      currentPage: 0,
      perPage: 10
    };
    getListCampaignsByLead(param)
      .then(response => {
        if (response.code === 1) {
          setCampaigns(response.data.items);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
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
                    <h4 className="page-title">{t("LABEL.LEADS.LEAD_OVERVIEW")}</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader doSearch={getLeadById} />
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
                        <Link to={route.leads}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.LEADS.LEAD")}
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
                      {lead ? (lead?.firstName ?? "") + " " + (lead?.lastName ?? " ") : ''}{" "}
                    </h5>
                    <p className="mb-1">
                      <i className="ti ti-building" /> {lead?.company}
                    </p>
                    <p className="mb-0">
                      <i className="ti ti-map-pin-pin" /> {`${lead?.addressInfor?.street ? lead?.addressInfor?.street + "," : ""} ${lead?.addressInfor?.city ? lead?.addressInfor?.city + "," : ""} ${lead?.addressInfor?.country ?? ""}`}
                    </p>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="ml-1">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black assign-btn-permission"
                      onClick={() => setShowShareData(!showShareData)}
                    >
                      {t("ACTION.ASSIGN")}
                    </Link>
                  </span>
                  <span className="ml-1">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="ml-1">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black delete-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_lead"
                    >
                      {t("ACTION.DELETE")}
                    </Link>
                  </span>
                  <span className='ml-1'>
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black convert-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#convert_lead"
                      id="convert-lead-btn"
                    >
                      {t("ACTION.CONVERT")}
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Sidebar */}
            <div className="col-xl-3">
              <div className="contact-sidebar">
                <h6>Lead Information</h6>
                <ul className="other-info">
                  <li>
                    <span className="other-title">Date Created</span>
                    <span>{convertTextToDateTime(lead?.createDate)}</span>
                  </li>
                  <li>
                    <span className="other-title">Title</span>
                    <span>{lead?.title}</span>
                  </li>
                  <li>
                    <span className="other-title">Phone</span>
                    <span>{lead?.phone}</span>
                  </li>
                  <li>
                    <span className="other-title">Source</span>
                    <span>{lead?.source ? lead?.source.leadSourceName : ''}</span>
                  </li>
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
                        className="dropdown-item campaign-btn-permission"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add_lead_campaign"
                      >
                        {t("ACTION.ADD")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {campaigns?.map((item: any) => (
                    <li key={item.campaignId}>
                      <div className='space-between col-md-12'>
                        <div>
                          <Link to={`/contact-details/${item?.contactId}`}>
                            <h6 className='link-details'>{item?.campaignName}</h6>
                          </Link>
                          <div>
                            <span>{t("CAMPAIGN.START_DATE")}: {convertTextToDateTime(item?.startDate)}</span>
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
                              data-bs-target="#update_lead_campaign"
                              onClick={() => setCampaignEdit(item)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_campaign"
                              onClick={() => setCampaignEdit(item)}
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
                <h4>Lead Pipeline Status</h4>
                <div className="pipeline-list">
                  <ul>
                    {listStatus.map((item: any, index: number) => {
                      const statusIndex = listStatus.findIndex((itemS: any) => itemS.leadStatusId === status);
                      const hoveredIndex = listStatus.findIndex((itemS: any) => itemS.leadStatusId === hoveredItem);
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link
                            to="#"
                            onClick={() => setStatus(item.id)}
                            className={statusIndex > index ? 'bg-success' : statusIndex === index ? 'bg-info' : ''}
                          >
                            {hoveredIndex === index || statusIndex <= index ? item.leadStatusName : <i className='fas fa-check' />}
                          </Link>
                        </li>)
                    })
                    }
                  </ul>
                  <div className='row row-btn-mark-as'>
                    <button onClick={() => changePipeStatus()} className='btn btn-primary btn-mark-as'>
                      {/* { (status === lead?.status?.leadStatusId ? 'Mark Status as Complete' : 'Mark as current state') } */}
                      {/* // Final stage => 'Selected Converted Status' */}
                      {listStatus[listStatus.length - 1]?.leadStatusId === status
                        ? "Selected Converted Status"
                        : (status === lead?.status?.leadStatusId ?
                          <div><i className="fas fa-check"></i>&nbsp;Mark Status as Complete </div>
                          : 'Mark as current state')}
                    </button>
                  </div>
                </div>
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#detail"
                      className="active"
                    >
                      Detail
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
                  {/* Detail */}
                  <div className="tab-pane active show" id="detail">
                    <div className="view-header">
                      <h4>Details</h4>
                    </div>
                    <div className="contact-activity">
                      <LeadsDetail lead={lead} getLeadById={getLeadById} />
                    </div>
                  </div>
                  {/* /Detail */}
                  {/* Activities */}
                  <div className="tab-pane fade" id="activities">
                    <CommonActivity id={id} type="leads" />
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
      <CreateLeads setShowPopup={setShowPopup} showPopup={showPopup} id={id} isEdit={true} getDetailLead={getLeadById} />
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
                <h3>Delete Leads</h3>
                <p className="del-info">Are you sure want to delete?</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn-delete" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="#" onClick={deleteLead} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
      {/* Convert Lead Modal */}
      <div
        className="modal custom-modal fade bd-example-modal-lg"
        id="convert_lead"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
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
                {!convertData.convertFinish
                  ?
                  <>
                    <h2>Convert Leads</h2>
                    <div className='row'>
                      <div className='col-xl-12'>
                        <h3 className='d-flex'>Account</h3>
                        <div className='row'>
                          <div className='col-xl-6 text-left'>
                            <input checked={convertData.typeAccount}
                              type='radio' name='account' onChange={() => setConvertData({ ...convertData, typeAccount: true })} />
                            <label>{t("LABEL.LEADS.CREATE_NEW")}</label>
                            <input
                              className='form-control'
                              type='text'
                              placeholder='Account Name...'
                              value={convertData.account || ''}
                              onChange={(e) => setConvertData({ ...convertData, account: e.target.value })}
                            />
                          </div>
                          <div className='col-xl-6 text-left'>
                            <input checked={!convertData.typeAccount} type='radio' name='account' onChange={() => setConvertData({ ...convertData, typeAccount: false })} />
                            <label>{t("LABEL.LEADS.CHOOSE_EXISTING")}</label>
                            <Select className='select'
                              options={accountList}
                              onInputChange={(e) => handleSearchAccount(e)}
                              onChange={(e: any) => setConvertData({ ...convertData, accountId: e?.value })}
                              isClearable={true}
                            />
                          </div>
                          {/* <div className='col-xl-4 text-left'>
                            <label>{t("LABEL.LEADS.ASSIGNED_TO")}</label>
                            <Select
                              className='select'
                              options={listUser}
                              isMulti={true}
                              onChange={(e: any) => setAssigns({ ...assigns, account: e.map((item: any) => item.value) })}
                              value={assigns.account.map((item: any) => listUser.find((user: any) => user.value === item))}
                              isClearable={true}
                            />
                          </div> */}
                        </div>
                      </div>
                      <div className='col-xl-12'>
                        <h3 className='d-flex' onClick={() => setShowContact(!showContact)}>Contact <i className={!showContact ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i></h3>
                        <div className='row'>
                          <div className='col-xl-6 text-left'>
                            <input checked={convertData.typeContact} type='radio' name='contact' onChange={() => setConvertData({ ...convertData, typeContact: true })} />
                            <label>{t("LABEL.LEADS.CREATE_NEW")}</label>
                            {!showContact &&
                              <div className="col-md-12">
                                <input className='form-control'
                                  type='text'
                                  placeholder='Account Name...'
                                  value={convertData.contact?.firstName + ' ' + convertData.contact?.lastName}
                                  onClick={() => setShowContact(true)}
                                />
                              </div>}
                            {showContact && <div>
                              <div className="col-md-12">
                                <label>Salutation</label>
                                <Select
                                  className='select'
                                  options={salutation}
                                  placeholder='Salutation...'
                                  value={salutation.find((item: any) => item.value === convertData.contact?.salutation) || { value: '', label: '' }}
                                  onChange={(e: any) => setConvertData({ ...convertData, contact: { ...convertData.contact, salutation: e.value } })}
                                />
                              </div>
                              <div className="col-md-12">
                                <label>First Name</label>
                                <input
                                  className='form-control'
                                  type='text'
                                  placeholder='First Name...'
                                  value={convertData.contact?.firstName || ''}
                                  onChange={(e) => setConvertData({ ...convertData, contact: { ...convertData.contact, firstName: e.target.value } })} />

                              </div>
                              <div className="col-md-12">
                                <label>Middle Name</label>
                                <input
                                  className='form-control'
                                  type='text'
                                  placeholder='Middle Name...'
                                  value={convertData.contact?.middleName || ''}
                                  onChange={(e) => setConvertData({ ...convertData, contact: { ...convertData.contact, middleName: e.target.value } })} />

                              </div>
                              <div className="col-md-12">
                                <label>Last Name</label>
                                <input
                                  className='form-control'
                                  type='text'
                                  placeholder='Last Name...'
                                  value={convertData.contact?.lastName || ''}
                                  onChange={(e) => setConvertData({ ...convertData, contact: { ...convertData.contact, lastName: e.target.value } })} />
                              </div>
                            </div>}
                          </div>
                          <div className='col-xl-6 text-left'>
                            <input checked={!convertData.typeContact} type='radio' name='contact' onChange={() => setConvertData({ ...convertData, typeContact: false })} />
                            <label>{t("LABEL.LEADS.CHOOSE_EXISTING")}</label>
                            <Select className='select'
                              options={contactList}
                              onChange={(e: any) => setConvertData({ ...convertData, contactId: e.value })}
                            />
                          </div>
                          {/* <div className='col-xl-4 text-left'>
                            <label>{t("LABEL.LEADS.ASSIGNED_TO")}</label>
                            <Select
                              className='select'
                              options={listUser}
                              isMulti={true}
                              onChange={(e: any) => setAssigns({ ...assigns, contact: e.map((item: any) => item.value) })}
                              value={assigns.contact.map((item: any) => listUser.find((user: any) => user.value === item))}
                              isClearable={true}
                            />
                          </div> */}
                        </div>
                      </div>
                      <div className='col-xl-12'>
                        <h3 className='d-flex'>Opportunity</h3>
                        <div className='row'>
                          <div className='col-xl-6 text-left'>
                            <input checked={convertData.typeOpportunity} type='radio' name='opportunity' onChange={() => setConvertData({ ...convertData, typeOpportunity: true })} />
                            <label>{t("LABEL.LEADS.CREATE_NEW")}</label>
                            <input
                              className='form-control'
                              type='text'
                              placeholder='Opportunity Name...'
                              value={convertData.opportunity || ''}
                              onChange={(e) => setConvertData({ ...convertData, opportunity: e.target.value })}
                            />
                          </div>  
                          {/* <div className='col-xl-4 text-left'>
                            <label>{t("LABEL.LEADS.ASSIGNED_TO")}</label>
                            <Select
                              className='select'
                              options={listUser}
                              isMulti={true}
                              onChange={(e: any) => setAssigns({ ...assigns, opportunity: e.map((item: any) => item.value) })}
                              value={assigns.opportunity.map((item: any) => listUser.find((user: any) => user.value === item))}
                              isClearable={true}
                            />
                          </div> */}
                        </div>
                      </div>
                      <div className="col-lg-12 text-center modal-btn">
                        <Link id="close-btn-convert" to="#" className="btn btn-light" data-bs-dismiss="modal">
                          Cancel
                        </Link>
                        <Link to="#" onClick={convertLead} className="btn btn-danger">
                          OK
                        </Link>
                      </div>
                    </div>
                  </>
                  :
                  <>
                    <h2>{t("LABEL.LEADS.CONVERT_LEAD_SUCCESS")}</h2>
                    <div className='row mt-2'>
                      <div className='col-xl-4'>
                        <div className='box'>
                          <Link
                            to={`/accounts-details/${convertData.accountId}`}
                            data-bs-dismiss="modal"
                            onClick={() => { nav(`/accounts-details/${convertData.accountId}`) }}
                          >Go To Account Converted
                          </Link>
                          <img className="icon-screen-image-circle" src="https://e7.pngegg.com/pngimages/128/641/png-clipart-computer-icons-accounting-money-finance-business-accounting-text-service.png" alt="accounts" />
                        </div>
                      </div>
                      <div className='col-xl-4'>
                        <div className='box'>
                          <Link
                            to={`/contacts-details/${convertData.contactId}`}
                            data-bs-dismiss="modal"
                            onClick={() => { nav(`/contacts-details/${convertData.contactId}`) }}
                          >Go To Contact Converted
                          </Link>
                          <img className="icon-screen-image-circle" src="https://png.pngtree.com/png-vector/20230213/ourmid/pngtree-circle-phone-call-icon-in-black-color-png-image_6596895.png" alt="Lead" />
                        </div>
                      </div>
                      <div className='col-xl-4'>
                        <div className='box'>
                          <Link
                            to={`/opportunities`}
                            data-bs-dismiss="modal"
                            onClick={() => { nav(`/opportunities`) }}
                          >
                            Go To Opportunity Converted
                          </Link>
                          <img className="icon-screen-image-circle" src="/assets/img/icons/crown.png" alt="Lead" />
                        </div>
                      </div>
                      <div className="col-lg-12 text-center modal-btn">
                        <Link to="/leads" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { nav('/leads') }}>
                          Go to Leads
                        </Link>
                      </div>
                    </div>
                  </>
                }

              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Convert Lead Modal */}
      <AddCampaignLead leadId={id} getList={getCampaignByLead} />
      <UpdateCampaignLead data={campaignEdit} />
      <ShareData closeModal={() => setShowShareData(false)} isOpen={showShareData} type="lead" id={id} />
    </>

  )
}

export default LeadsDetails
