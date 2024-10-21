import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { deletePriceBook } from "../../../services/priceBook";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { deleteQuote, getListQuoteOpportunity, getListQuoteOpportunityByOpportunityId } from "../../../services/quote";
import { all_routes } from "../../router/all_routes";
import { getOpportunity, getOpportunityDetail } from "../../../services/opportunities";
import { CreateQuotes } from "../quote/createQuotes";
import { getAccountById } from "../../../services/account";
import DeleteModal from "../../support/deleteModal";

const route = all_routes;
const ListQuote = () => {
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [opportunity, setOpportunity] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const { id } = useParams();
  const { t } = useTranslation();

  const getQuotes = async (pageNo: number, pageSize: number) => {
    try {
      Swal.showLoading();
      const param = {
        pageNo: pageNo,
        pageSize: pageSize,
        opportunityId: id
      }
      getListQuoteOpportunityByOpportunityId(param).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items);
          setTotal(data?.data?.total);
        }
      }
      ).catch((error) => {
        Swal.close();
        console.log("error:", error);
      })
    } catch (error) {
      Swal.close();
      console.error("Error fetching Price Books:", error);
    }
  };

  const getOpportunity = () => {
    Swal.showLoading();
    getOpportunityDetail(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setOpportunity(response.data);
          getAccount(response.data.accountId);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting opportunity detail: ", error)
      })
  }

  const getAccount = (id: any) => {
    getAccountById(id)
      .then(response => {
        if (response.code === 1) {
          setAccount(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting account detail: ", error)
      })

  }

  useEffect(() => {
    getOpportunity();
  }, []);

  useEffect(() => {
    getQuotes(pageNo, pageSize);
  }, [pageNo, pageSize]);


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const clickUpdate = (id: number) => {
    setShowUpdate(true);
    setCurrentId(id);
  }

  const columns = [
    {
      title: t("QUOTE.QUOTE_NAME"),
      dataIndex: "quoteName",
      key: "quoteName",
      render: (value: any, record: Partial<any>) => (
        <Link to={`/quotes-details/${record?.quoteId}`} className="link-details">
          <span>{record?.quoteName}</span>
        </Link>
      )
    },
    {
      title: t("QUOTE.OPPORTUNITY_NAME"),
      dataIndex: "opportunityName",
      key: "opportunityName",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.opportunityName}</span>
      )
    },
    {
      title: t("QUOTE.EXPIRATION_DATE"),
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.expirationDate ? formatDate(record?.expirationDate) : ""}</span>
      )
    },
    {
      title: t("QUOTE.TOTAL_PRICE"),
      dataIndex: "total",
      key: "total",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.total}</span>
      )
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => clickUpdate(record?.quoteId)} >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              onClick={() => { setCurrentId(record?.quoteId) }}
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_price_book">
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },
  ];


  const removeQuote = () => {
    deleteQuote(currentId)
      .then((data: any) => {
        if (data.code === 1) {
          toast.success("Delete quote success!");
          document.getElementById("close_delete_quote")?.click();
          getQuotes(pageNo, pageSize);
        } else {
          toast.error("Delete quote failed!");
        }
      }).catch((error) => {
        console.log("error:", error);
      })
  }
  const formatDate = (date: string) => {
    return date.replace("T", " ").replace(".000+00:00", "");
  }

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
                          {/* <div className="icon-text-wrapper">
                            <img className="icon-screen-image-circle" src="https://cdn-icons-png.flaticon.com/256/4388/4388554.png" alt="Lead" />
                            <h4>{t("QUOTE.QUOTE")}</h4>
                          </div> */}
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black add-btn-permission"
                                    onClick={() => setShowPopup(!showPopup)}
                                  >
                                    <i className="ti ti-square-rounded-plus" />
                                    {t("ACTION.ADD")}
                                  </Link>
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black add-popup"
                                    onClick={() => getQuotes(pageNo, pageSize)}
                                  >
                                    <i className="ti ti-refresh-dot" />
                                    {t("ACTION.REFRESH")}
                                  </Link>
                                </div>
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
                        <h5>{t("QUOTE.QUOTE")}</h5>
                      </div>
                    </div>
                    {/* /Filter */}
                    {/* Manage Users List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={viewList} columns={columns} pagination={{
                        current: pageNo,
                        pageSize,
                        total: total,
                        onChange: (page, pageSize) => {
                          setPageNo(page);
                          setPageSize(pageSize);
                        },
                      }}
                        onChange={handleTableChange}
                      />
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
        <CreateQuotes showPopup={showPopup} setShowPopup={setShowPopup} opportunity={opportunity} account={account} getList={getQuotes} isEdit={false} />
        <CreateQuotes id={currentId} showPopup={showUpdate} setShowPopup={setShowUpdate} getDetail={getQuotes} isEdit={true} />
        <DeleteModal deleteId="delete_quote" closeBtn="close_delete_quote" handleDelete={removeQuote} />
      </>
    </>
  );
};

export default ListQuote;
