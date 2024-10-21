import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { getCampaignInfluence, getOpportunityDetail, patchCampaignInfluence } from "../../../services/opportunities";
import UpdateCampaignInfluenced from "./UpdateCampaignInfluence";

const ListCampaignInfluenced = () => {
  const [opportunity, setOpportunity] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState(0);
  const [campaignInfluence, setCampaignInfluence] = useState<any>(null);
  const [showModal, setShowModal] = useState<any>(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getListCampaign();
    getOpportunityById();
  }, [pageNo, pageSize]);

  const getOpportunityById = () => {
    getOpportunityDetail(id)
      .then(response => {
        if (response.code === 1) {
          setOpportunity(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting campaign detail: ", error);
      })
  }


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getListCampaign = () => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
      pageNo: pageNo - 1,
      pageSize
    }
    getCampaignInfluence(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setViewList(response.data.items);
          setTotals(response.data.total);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting Influence Opportunities: ", error);
      })
  }

  const openEditModal = (record: any) => {
    console.log(record);
    setCampaignInfluence(record);
    setShowModal(true);
  }

  const handleUpdate = (revenueShare: any) => {
    const patchCampaignInfluenceBody = {
      opportunityId: id,
      campaignInfluenceId: campaignInfluence.campaignInfluenceId,
      revenueShare
    }
    Swal.showLoading();
    patchCampaignInfluence(patchCampaignInfluenceBody)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Update campaign influence successfully!");
          setShowModal(false);
          getListCampaign();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error updating campaign influence: ", error);
        toast.error("Failed to update campaign influence");
      });
  }

  const columns = [
    {
      title: t("CAMPAIGN.CAMPAIGN_NAME"),
      dataIndex: 'campaignName',
      key: 'campaignName',
      render: (text: any, record: any) => (
        <Link to={`/campaign-details/${record?.campaign?.campaignId}`}>{record?.campaign?.campaignName}</Link>
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
      title: t("CAMPAIGN.INFLUENCE"),
      dataIndex: 'influence',
      key: 'influence',
      render: (text: any, record: any) => (
        <span>{record?.influence}</span>
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
      title: t("LABEL.OPPORTUNITIES.CONTACT_ROLE"),
      dataIndex: 'contactRole',
      key: 'contactRole',
      render: (text: any, record: any) => (
        <span>{record?.coOppRelation?.contactRole?.roleName}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value: undefined, record: any) => (
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
              onClick={() => openEditModal(record)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
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
                            <Link to={route.opportunities}>
                              {t("LABEL.OPPORTUNITIES.OPPORTUNITY")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/opportunities-details/${id}`}>
                              {opportunity?.opportunityName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("LABEL.OPPORTUNITIES.CAMPAIGN_INFLUENCE")}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <Link to="#" onClick={() => getListCampaign()}>
                            <i className="ti ti-refresh-dot" />
                          </Link>
                        </ul>
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
        <UpdateCampaignInfluenced closeModal={() => setShowModal(false)} isOpen={showModal} data={campaignInfluence} handleUpdate={handleUpdate} />
        <ToastContainer />
      </>
    </>
  );
};

export default ListCampaignInfluenced;
