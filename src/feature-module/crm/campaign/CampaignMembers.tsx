import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import { getCampaignById } from "../../../services/campaign";
import Swal from "sweetalert2";
import { createMemberStatus, deleteMemberStatus, getListCampainMemberStatus, patchMemberStatus } from "../../../services/campaign_member";
import AddCampaignMemberStatus from "./AddCampaignMemberStatus";

const CampaignMemberStatus = () => {
  const [campaign, setCampaign] = useState<any>({});
  const [viewList, setViewList] = useState<any>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState(0);
  const [campaignMemberStatus, setCampaignMemberStatus] = useState<any>({
    status: "",
    id: 0
  });
  const [memberStatusId, setMemberStatusId] = useState<any>(0);
  const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<any>({
    createStatusMember: false,
    updateStatusMember: false
  });
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;


  useEffect(() => {
    getMemberStatus();
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

  const removeMemberStatus = () => {
    const param = {
      id: memberStatusId
    }
    deleteMemberStatus(param)
      .then(response => {
        if (response.code === 1) {
          document.getElementById('close-btn-mbs')?.click();
          getMemberStatus();
          toast.success("Remove member status success");
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, Campaign with admin to fix.");
        console.error("Error deleting Member Status: ", error)
      })
  }

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getMemberStatus = () => {
    getListCampainMemberStatus()
      .then(response => {
        if (response.code === 1) {
          setViewList(response.data);
          setTotals(response.data.length);
        } else {
          console.log("Error");
        }
      })
      .catch(error => {
        console.log("Error");
      })
  }

  const createStatusMember = (data: any) => {
    Swal.showLoading();
    createMemberStatus(data.status)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setOpenModal({ ...openModal, createStatusMember: false });
          toast.success("Create member status success");
          getMemberStatus();
          setCampaignMemberStatus({ status: "", id: 0 });
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, Campaign with admin to fix.");
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
          toast.success("Update member status success");
          getMemberStatus();
          setCampaignMemberStatus({ status: "", id: 0 });
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, Campaign with admin to fix.");
        console.error("Error creating Member Status: ", error)
      })
  }

  const openEditModal = (id: any) => {
    const data = viewList.find((item: any) => item.campaignMemberStatusId === id);
    setCampaignMemberStatus({ status: data?.campaignMemberStatusName, id: data?.campaignMemberStatusId });
    setOpenModal({ ...openModal, updateStatusMember: true });
  }

  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedProductKeys(selectedRowKeys);
    }
  };

  const closeModalCreateStatusMember = () => {
    // close all
    setOpenModal({
      createStatusMember: false,
      updateStatusMember: false
    });
    setCampaignMemberStatus({ status: "", id: 0 });
  }

  const openModalCreateStatusMember = () => {
    setOpenModal({ ...openModal, createStatusMember: true });
  }

  const columns = [
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
                                  onClick={openModalCreateStatusMember}
                                  className='btn custom-btn-blue-black'
                                >
                                  {t("ACTION.ADD")}
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
                        <h5>{t("CAMPAIGN.CAMPAIGN_MEMBER_STATUSES")}</h5>
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
        <DeleteModal closeBtn={"close-btn-mbs"} deleteId={"delete_member_status"} handleDelete={removeMemberStatus} />
        <AddCampaignMemberStatus closeModal={closeModalCreateStatusMember} isOpen={openModal?.createStatusMember} handleCreate={createStatusMember} data={campaignMemberStatus} />
        <AddCampaignMemberStatus closeModal={closeModalCreateStatusMember} isOpen={openModal?.updateStatusMember} handleUpdate={updateStatusMember}
          isEdit={true} data={campaignMemberStatus} />
      </>
    </>
  );
};

export default CampaignMemberStatus;
