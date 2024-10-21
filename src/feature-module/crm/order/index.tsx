import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { deletePriceBook } from "../../../services/priceBook";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateOrder } from "./createOrders";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import Swal from "sweetalert2";
import { deleteOrderContract, getListOrder } from "../../../services/order";

const Orders = () => {
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const { t } = useTranslation();

  const getOrders = async (pageNo: number, pageSize: number) => {
    try {
      Swal.showLoading();
      const param = {
        pageNo: pageNo,
        pageSize: pageSize
      }
      getListOrder(param).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items?.content);
          setTotal(data?.data?.items?.totalElements);
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

  useEffect(() => {
    getOrders(pageNo, pageSize);
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
      title: t("ORDER.ORDER_NUMBER"),
      dataIndex: `priceBookName`,
      key: "priceBookName",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/orders-details/" + record?.orderId} className="link-details">{record?.orderId}</Link>
      }
    },
    {
      title: t("ORDER.ACCOUNT_NAME"),
      dataIndex: "isActive",
      key: "isActive",
      render: (value: undefined, record: Partial<any>) =>
        <div>
          {record?.accountName}
        </div>
    },
    {
      title: t("ORDER.ORDER_AMOUNT"),
      dataIndex: "orderAmount",
      key: "orderAmount",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.orderAmount}</span>
      )
    },
    {
      title: t("ORDER.ORDER_START_DATE"),
      dataIndex: "startDate",
      key: "startDate",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.orderStartDate ? formatDate(record?.orderStartDate) : ""}</span>
      )
    },
    {
      title: t("ORDER.STATUS"),
      dataIndex: "status",
      key: "status",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.orderStatus?.orderStatusName}</span>
      )
    },
    {
      title: t("ORDER.CONTRACT_NUMBER"),
      dataIndex: "description",
      key: "description",
      render: (value: any, record: Partial<any>) => (
        <span>{record?.contractNumber}</span>
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => clickUpdate(record?.orderId)} >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              onClick={() => { setCurrentId(record?.orderId) }}
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_order">
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const removeOrder = () => {
    deleteOrderContract(currentId)
      .then(response => {
        if (response.code === 1) {
          toast.success("Delete successfully");
          document.getElementById("close-btn-do")?.click();
          getOrders(pageNo, pageSize);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
        toast.error("Delete failed");
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
                          <div className="icon-text-wrapper">
                            <img className="icon-screen-image-circle" src="https://icons.veryicon.com/png/o/miscellaneous/icondian/icon-order-1.png" alt="Lead" />
                            <h4>{t("ORDER.ORDER")}</h4>
                          </div>
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
                                    onClick={() => getOrders(pageNo, pageSize)}
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
                        <ul>

                        </ul>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <li>

                          </li>
                        </ul>
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
        <CreateOrder setShowPopup={setShowPopup} showPopup={showPopup} getList={getOrders} />
        <CreateOrder setShowPopup={setShowUpdate} showPopup={showUpdate} getDetail={getOrders} isEdit={true} id={currentId} />
        <DeleteModal deleteId={"delete_order"} closeBtn="close-btn-do" handleDelete={removeOrder} />
      </>
    </>
  );
};

export default Orders;
