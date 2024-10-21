import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteProductFromPriceBook, getPriceBookById, getProductsByPriceBook } from "../../../services/priceBook";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import { getCampaignById } from "../../../services/campaign";
import Swal from "sweetalert2";
import { deleteLeadMember, patchLeadMember, viewLeadMember } from "../../../services/campaign_member";
import AddLeadCampaign from "./AddLeadCampaign";
import UpdateStatusModal from "./updateStatusModal";
import { checkPermissionRole } from "../../../utils/authen";

const LeadMembers = () => {
  const [campaign, setCampaign] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [lead, setLead] = useState<any>({});
  const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;


  useEffect(() => {
    getLeadsMember();
    checkPermissionRole(route.leadMemberCampaign)
  }, [pageNo, pageSize]);

  useEffect(() => {
    getCampaignDetail();
  }, [])

  const getCampaignDetail = () => {
    Swal.showLoading();
    getCampaignById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setCampaign(response.data);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting campaign detail: ", error);
      })
  }


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getLeadsMember = () => {
    const param = {
      pageNo: pageNo - 1,
      pageSize,
      campaignId: id
    }
    viewLeadMember(param).then(response => {
      if (response.code === 1) {
        setViewList(response.data.items.map((item: any) => {
          return {
            ...item,
            key: item.leadMember.leadsId
          }
        }));
        console.log("viewList", viewList);
        setTotals(response.data.total);
      }
    })
      .catch(error => {
        console.error("Error getting products by PriceBook: ", error);
      })
  }

  const removeLeadsFromCampain = () => {
    const body = selectedProductKeys.map((item: any) => {
      return {
        campaignId: id,
        leadsId: item
      }
    });
    deleteLeadMember(body)
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getLeadsMember();
          document.getElementById('close-btn-rlc')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const removeLeadFromCampain = () => {
    deleteLeadMember([{ campaignId: id, leadsId: lead?.leadMember?.leadsId }])
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getLeadsMember();
          document.getElementById('close-btn-dlfc')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const openEditModal = (leadId: any) => {
    setShowPopup(true);
    setLead(viewList.find((item: any) => item.leadMember.leadsId === leadId));
  }

  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedProductKeys(selectedRowKeys);
    }
  };

  const updateStatusLeadMember = (status: any) => {
    Swal.showLoading();
    const body = selectedProductKeys.map((item: any) => {
      return {
        campaignId: id,
        leadsId: item,
        memberStatus: status.value
      }
    });
    patchLeadMember(body)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Status updated successfully.");
          getLeadsMember();
          setOpenUpdate(false);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const updateStatusLead = (status: any) => {
    Swal.showLoading();
    patchLeadMember([{ campaignId: id, leadsId: lead?.leadMember?.leadsId, memberStatus: status.value }])
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Status updated successfully.");
          getLeadsMember();
          setShowPopup(false);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const closeUpdate = () => {
    setOpenUpdate(false);
  }

  const openUpdateStatus = () => {
    if (selectedProductKeys.length === 0) {
      toast.warn("Please select at least one product.");
      return;
    }
    setOpenUpdate(true);
  }

  const columns = [
    {
      title: t("LABEL.LEADS.STATUS"),
      dataIndex: "status",
      key: "status",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.leadMember?.memberStatus?.campaignMemberStatusName ?? ""}
        </span>
    },
    {
      title: t("TITLE.LEADS.NAME"),
      dataIndex: 'name',
      key: "name",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/leads-details/" + record?.leadMember?.leadId}>{record?.firstName + " " + record?.lastName}</Link>
      }
    },
    {
      title: t("LABEL.LEADS.TITLE"),
      dataIndex: "title",
      key: "title",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.title}
        </span>
    },
    {
      title: t("TITLE.LEADS.COMPANY"),
      dataIndex: "company",
      key: "company",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.company}
        </span>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value: any, record: Partial<any>) => (
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
            <Link className="dropdown-item edit-btn-permission" to="#"
              onClick={() => openEditModal(record?.leadMember?.leadsId)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_lead_from_campaign"
              onClick={() => setLead(viewList.find((item: any) => item.leadMember.leadsId === record?.leadMember?.leadsId))}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="card main-card">
                  <div className="card-body">
                    {/* Search */}
                    <div className="search-section">
                      <div className="row">
                        <div className="col-md-5 col-sm-4">
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_leads_campaign"
                                  className='btn custom-btn-blue-black add-btn-permission'
                                >
                                  {t("ACTION.ADD")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  onClick={openUpdateStatus}
                                  className='btn custom-btn-blue-black edit-btn-permission'
                                >
                                  {t("ACTION.UPDATE_STATUS")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#remove_leads_campaign"
                                  className='btn custom-btn-blue-black delete-btn-permission'
                                >
                                  {t("ACTION.REMOVE")}
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Search */}
                    {/* Filter */}
                    <div className="filter-section filter-flex">
                      <div className="sortby-list">
                        <ul className="contact-breadcrumb" style={{ padding: 0, margin: 0, height: '20px' }}>
                          <li>
                            <Link to={route.campaign}>
                              {t("CAMPAIGN.CAMPAIGN")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/campaign-details/${id}`}>
                              {campaign?.campaignName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("CAMPAIGN.LEAD_MEMBERS")}</h5>
                      </div>
                    </div>
                    {/* /Filter */}
                    {/* Manage Users List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={viewList} columns={columns} pagination={{
                        current: pageNo,
                        pageSize,
                        total: totals,
                        onChange: (page, pageSize) => {
                          setPageNo(page);
                          setPageSize(pageSize);
                        },
                      }}
                        rowSelection={rowSelection}
                        onChange={handleTableChange} />
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="datatable-length" />
                      </div>
                      <div className="col-md-6">
                        <div className="datatable-paginate" />
                      </div>
                    </div>
                    {/* /Manage Users List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        <ToastContainer />
        <DeleteModal closeBtn={"close-btn-rlc"} deleteId={"remove_leads_campaign"} handleDelete={removeLeadsFromCampain} />
        <DeleteModal closeBtn={"close-btn-dlfc"} deleteId={"delete_lead_from_campaign"} handleDelete={removeLeadFromCampain} />
        <AddLeadCampaign campaignId={id} data={campaign} getList={getLeadsMember} />
        <UpdateStatusModal handleUpdate={updateStatusLeadMember} isOpen={openUpdate} closeModal={closeUpdate} total={selectedProductKeys.length} />
        <UpdateStatusModal handleUpdate={updateStatusLead} isOpen={showPopup} closeModal={() => setShowPopup(false)} />
      </>
    </>
  );
};

export default LeadMembers;
