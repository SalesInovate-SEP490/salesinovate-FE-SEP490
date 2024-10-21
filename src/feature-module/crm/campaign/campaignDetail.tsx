import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { deleteCampaign, getCampaignById } from '../../../services/campaign'
import { initCampaign } from './data'
import { CreateCampaign } from './createCampaign'
import DetailCampaign from './DetailCampaign'
import DeleteModal from '../../support/deleteModal'
import AddLeadCampaign from './AddLeadCampaign'
import { createMemberStatus, deleteMemberStatus, getInfluenceOpportunity, getListCampainMemberStatus, patchMemberStatus, viewContactMember, viewLeadMember } from '../../../services/campaign_member'
import CampaignChart from './CampaignChart'
import Swal from 'sweetalert2'
import AddContactCampaign from './AddContactCampaign'
import Table from "../../../core/common/dataTable/index";
import AddCampaignMemberStatus from './AddCampaignMemberStatus'
import { checkPermissionRole } from '../../../utils/authen'

const route = all_routes;

const CampaignDetail = () => {
  const [campaign, setCampaign] = useState<any>(initCampaign);
  const [showPopup, setShowPopup] = useState(false);
  const [leadMembers, setLeadMembers] = useState<any>([]);
  const [contactMembers, setContactMembers] = useState<any>([]);
  const [influenceOpportunities, setInfluenceOpportunities] = useState<any>([]);
  const [memberStatus, setMemberStatus] = useState<any>([]);
  const [memberStatusId, setMemberStatusId] = useState<any>(0);
  const [openModal, setOpenModal] = useState<any>({
    createStatusMember: false,
    updateStatusMember: false
  });
  const [campaignMemberStatus, setCampaignMemberStatus] = useState<any>({
    status: "",
    id: 0
  });
  const { t } = useTranslation();
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getCampaignDetail();
    getLeadsCampaign();
    getContactCampaign();
    getListInfluenceOpportunities();
    getListMemberStatus();
    checkPermissionRole(route.campaignDetails);
  }, [id]);

  const getCampaignDetail = () => {
    Swal.showLoading();
    getCampaignById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          const data = response.data;
          data.campaignTypeId = data?.campaignType?.campaignTypeId;
          data.campaignStatusId = data?.campaignStatus?.campaignStatusId;
          setCampaign(response.data);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error", error);
      })
  }

  const getLeadsCampaign = () => {
    Swal.showLoading();
    const param = {
      campaignId: id,
      currentPage: 0,
      perPage: 100
    }
    viewLeadMember(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setLeadMembers(response.data.items);
        } else {
          console.log("Error");
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error");
      })
  }

  const getListInfluenceOpportunities = () => {
    const param = {
      campaignId: id,
      currentPage: 0,
      perPage: 5
    }
    getInfluenceOpportunity(param)
      .then(response => {
        if (response.code === 1) {
          setInfluenceOpportunities(response.data.items);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        console.error("Error getting Influence Opportunities: ", error);
      })
  }

  const getListMemberStatus = () => {
    Swal.showLoading();
    getListCampainMemberStatus()
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setMemberStatus(response.data);
        } else {
          console.log("Error");
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error");
      })
  }

  const getContactCampaign = () => {
    Swal.showLoading();
    const param = {
      campaignId: id,
      currentPage: 0,
      perPage: 100
    }
    viewContactMember(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setContactMembers(response.data.items);
        } else {
          console.log("Error");
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error");
      });
  }

  const removeCampaign = () => {
    const param = {
      id: id
    }
    deleteCampaign(param)
      .then(response => {
        if (response.code === 1) {
          document.getElementById('close-btn')?.click();
          customToast("success", "Remove campaign success");
          nav(route.campaign);
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, Campaign with admin to fix.");
        console.error("Error deleting Campaign: ", error)
      })
  }

  const removeMemberStatus = () => {
    const param = {
      id: memberStatusId
    }
    deleteMemberStatus(param)
      .then(response => {
        if (response.code === 1) {
          document.getElementById('close-btn-mbs')?.click();
          getListMemberStatus();
          customToast("success", "Remove member status success");
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, Campaign with admin to fix.");
        console.error("Error deleting Member Status: ", error)
      })
  }

  const closeModalCreateStatusMember = () => {
    // close all
    setOpenModal({
      createStatusMember: false,
      updateStatusMember: false
    });
  }

  const openModalCreateStatusMember = () => {
    setOpenModal({ ...openModal, createStatusMember: true });
  }

  const createStatusMember = (data: any) => {
    Swal.showLoading();
    createMemberStatus(data.status)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setOpenModal({ ...openModal, createStatusMember: false });
          customToast("success", "Create member status success");
          getListMemberStatus();
          setCampaignMemberStatus({ status: "", id: 0 });
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        Swal.close();
        customToast("error", "System error, Campaign with admin to fix.");
        console.error("Error creating Member Status: ", error)
      })
  }

  const updateStatusMember = (data: any) => {
    Swal.showLoading();
    patchMemberStatus(data.status, campaignMemberStatus.id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setOpenModal({ ...openModal, updateStatusMember: false });
          customToast("success", "Update member status success");
          getListMemberStatus();
          setCampaignMemberStatus({ status: "", id: 0 });
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        Swal.close();
        customToast("error", "System error, Campaign with admin to fix.");
        console.error("Error creating Member Status: ", error)
      })
  }

  const openEditModal = (id: any) => {
    const data = memberStatus.find((item: any) => item.campaignMemberStatusId === id);
    setCampaignMemberStatus({ status: data.campaignMemberStatusName, id: data.campaignMemberStatusId });
    setOpenModal({ ...openModal, updateStatusMember: true });
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

  const columns = [
    {
      title: 'Opportunity Name',
      dataIndex: 'opportunityName',
      key: 'opportunityName',
      render: (text: any, record: any) => (
        <Link to={`/opportunity-details/${record.opportunityId}`}>{record?.opportunity?.opportunityName}</Link>
      ),
    },
    {
      title: t("CAMPAIGN.CONTACT_NAME"),
      dataIndex: 'contactName',
      key: 'contactName',
      render: (text: any, record: any) => (
        <Link to={`/account-details/${record?.contactId}`}>{record?.contactName}</Link>
      ),
    },
    {
      title: t("CAMPAIGN.REVENUE_SHARE"),
      dataIndex: 'revenueShare',
      key: 'revenueShare',
      render: (text: any, record: any) => (
        <span>{record?.revenueShare}</span>
      ),
    },
    {
      title: t("CAMPAIGN.AMOUNT"),
      dataIndex: 'amount',
      key: 'amount',
      render: (text: any, record: any) => (
        <span>{record?.opportunity?.amount}</span>
      ),
    }
  ];

  const columnsStatus = [
    {
      title: t("CAMPAIGN.MEMBER_STATUS"),
      dataIndex: 'campaignMemberStatusName',
      key: 'campaignMemberStatusName',
      render: (text: any, record: any) => (
        <span>{record?.campaignMemberStatusName}</span>
      ),
    },
    {
      title: t("ACTION.ACTION"),
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => (
        <div className="dropdown table-action">
          <Link to="#" className="action-icon" data-bs-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate3d(-99.3333px, 35.3333px, 0px)' }} data-popper-placement="bottom-start">
            <Link
              className="dropdown-item edit-popup"
              to="#"
              onClick={() => openEditModal(record?.campaignMemberStatusId)}
            >
              <i className="ti ti-edit text-blue"></i> {t("CAMPAIGN.EDIT")}
            </Link>
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_member_status" onClick={() => setMemberStatusId(record?.campaignMemberStatusId)}>
              <i className="ti ti-trash text-danger"></i> {t("LABEL.CAMPAIGN.DELETE")}
            </Link>
          </div>
        </div>
      ),
    }
  ]

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
                    <h4 className="page-title">{t("LABEL.CAMPAIGN.CAMPAIGN_OVERVIEW")}</h4>
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
                        <Link to={route.campaign}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.CAMPAIGN.CAMPAIGN")}
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
                    <span className="text-icon">HT</span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {campaign?.campaignName}
                    </h5>
                    <div>{`${t("CAMPAIGN.TYPE")}: ${campaign?.campaignType?.campaignTypeName}`}</div>
                    <div>{`${t("CAMPAIGN.STATUS")}: ${campaign?.campaignStatus?.campaignStatusName}`}</div>
                    <div>{`${t("CAMPAIGN.START_DATE")}: ${campaign?.startDate ? campaign?.startDate : ''}`}</div>
                    <div>{`${t("CAMPAIGN.END_DATE")}: ${campaign?.endDate ? campaign?.endDate : ''}`}</div>
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
                      data-bs-target="#delete_campaign"
                    >
                      Delete
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
                      data-bs-target="#related"
                      className="active"
                    >
                      Related
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#details"
                    >
                      Details
                    </Link>
                  </li>

                </ul>
              </div>
              {/* Tab Content */}
              <div className="contact-tab-view">
                <div className="tab-content pt-0">
                  {/* Details */}
                  <div className="tab-pane fade" id="details">
                    <div className="calls-activity">
                      <DetailCampaign campaign={campaign} getDetail={getCampaignDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane active show" id="related">
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12 header-border'>
                        <ul>
                          <h4>{t("CAMPAIGN.CAMPAIGN_MEMBERS")}</h4>
                        </ul>
                        <ul>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black assign-lead-btn-permission"
                            data-bs-toggle="modal"
                            data-bs-target="#add_leads_campaign"
                          >
                            {t("CAMPAIGN.ADD_LEAD")}
                          </Link>
                        </ul>
                      </div>
                      {leadMembers.length > 0 && <>
                        <div className='col-md-12'>
                          <CampaignChart data={leadMembers} dataType='leads' />
                        </div>
                        <div className='col-md-12 footer-border'>
                          <Link to={`/campaign-details/${id}/lead-member`}>{t("ACTION.VIEW_ALL")}</Link>
                        </div>
                      </>}
                    </div>
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12 header-border'>
                        <ul>
                          <h4>{t("CAMPAIGN.CAMPAIGN_MEMBERS")}</h4>
                        </ul>
                        <ul className='assign-contact-btn-permission'>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black"
                            data-bs-toggle="modal"
                            data-bs-target="#add_contacts_campaign"
                          >
                            {t("CAMPAIGN.ADD_CONTACT")}
                          </Link>
                        </ul>
                      </div>
                      {contactMembers.length > 0 && <>
                        <div className='col-md-12'>
                          <CampaignChart data={contactMembers} dataType='contacts' />
                        </div>
                        <div className='col-md-12 footer-border'>
                          <Link to={`/campaign-details/${id}/contact-member`}>{t("ACTION.VIEW_ALL")}</Link>
                        </div>
                      </>}
                    </div>
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12'>
                        <ul>
                          <h4>{t("CAMPAIGN.INFLUENCED_OPPORTUNITY")} {`(${influenceOpportunities?.length > 5 ? '5+' : influenceOpportunities?.length})`}</h4>
                        </ul>
                        <ul>
                        </ul>
                      </div>
                      <div className="table-responsive custom-table col-md-12">
                        <Table
                          dataSource={influenceOpportunities?.slice(0, 5)}
                          columns={columns}
                          pagination={false}
                          footer={() => (
                            <div style={{ textAlign: 'center' }}>
                            </div>
                          )}
                        />
                      </div>
                      <div className='col-md-12 footer-border'>
                        <Link to={`/campaign-details/${id}/influenced-opportunities`}>{t("ACTION.VIEW_ALL")}</Link>
                      </div>
                    </div>
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12'>
                        <ul>
                          <h4>{t("CAMPAIGN.CAMPAIGN_MEMBERS_STATUS")} {`(${memberStatus?.length > 3 ? '3+' : memberStatus?.length})`}</h4>
                        </ul>
                        <ul>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black"
                            onClick={openModalCreateStatusMember}
                          >
                            {t("ACTION.ADD")}
                          </Link>
                        </ul>
                      </div>
                      <div className="table-responsive custom-table col-md-12">
                        <Table
                          dataSource={memberStatus?.slice(0, 3)}
                          columns={columnsStatus}
                          pagination={false}
                          footer={() => (
                            <div style={{ textAlign: 'center' }}>
                            </div>
                          )}
                        />
                      </div>
                      <div className='col-md-12 footer-border'>
                        <Link to={`/campaign-details/${id}/member-status`}>{t("ACTION.VIEW_ALL")}</Link>
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
      <CreateCampaign data={campaign} showPopup={showPopup} setShowPopup={setShowPopup} id={id} getDetail={getCampaignDetail} isEdit={true} />
      <DeleteModal closeBtn={"close-btn"} deleteId={"delete_campaign"} handleDelete={removeCampaign} />
      <AddLeadCampaign campaignId={id} data={campaign} memberStatusUpdate={memberStatus} getList={getLeadsCampaign} />
      <AddContactCampaign campaignId={id} data={campaign} memberStatusUpdate={memberStatus} getList={getContactCampaign} />
      <DeleteModal closeBtn={"close-btn-mbs"} deleteId={"delete_member_status"} handleDelete={removeMemberStatus} />
      <AddCampaignMemberStatus closeModal={closeModalCreateStatusMember} isOpen={openModal?.createStatusMember} handleCreate={createStatusMember} />
      <AddCampaignMemberStatus closeModal={closeModalCreateStatusMember} isOpen={openModal?.updateStatusMember} handleUpdate={updateStatusMember}
        isEdit={true} data={campaignMemberStatus} />
    </>

  )
}

export default CampaignDetail
