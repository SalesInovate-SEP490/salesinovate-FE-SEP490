import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { getPriceBookById, getProductsByPriceBook } from "../../../services/priceBook";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import { getInfluenceOpportunity } from "../../../services/campaign_member";
import { getCampaignById } from "../../../services/campaign";
import Swal from "sweetalert2";

const ListOpportunityInfluenced = () => {
  const [campaign, setCampaign] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState(0);
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getListOpportunity();
    getCampaignDetail();
  }, [pageNo, pageSize]);

  const getCampaignDetail = () => {
    getCampaignById(id)
      .then(response => {
        if (response.code === 1) {
          setCampaign(response.data);
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

  const getListOpportunity = () => {
    Swal.showLoading();
    const param = {
      campaignId: id,
      currentPage: pageNo - 1,
      perPage: pageSize
    }
    getInfluenceOpportunity(param)
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
                        <h5>{t("CAMPAIGN.INFLUENECED_OPPORTUNITIES")}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <Link to="#" onClick={() => getListOpportunity()}>
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
        <ToastContainer />
      </>
    </>
  );
};

export default ListOpportunityInfluenced;
