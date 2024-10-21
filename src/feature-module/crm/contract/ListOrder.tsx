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
import Swal from "sweetalert2";
import { deleteOrderContract, findPriceBookIdByOrderId, getListProductOrder, getOrderContractDetail } from "../../../services/order";
import { convertTextToDate } from "../../../utils/commonUtil";
import { getListOrderContractBy } from "../../../services/contract";
import { CreateOrder } from "../order/createOrders";

const ListOrdersInContract = () => {
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const { id, contractNumber } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getListOrders();
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getListOrders = () => {
    getListOrderContractBy(contractNumber)
      .then(response => {
        if (response.code === 1) {
          setViewList(response.data);
          setTotalPriceBook(response.data.length);
        }
      })
      .catch(error => { })

  }

  const columns = [
    {
      title: t("ORDER.ORDER_NUMBER"),
      dataIndex: `date`,
      key: "date",
      render: (value: undefined, record: Partial<any>) => {
        return <span>{record?.orderContractNumber}</span>
      }
    },
    {
      title: t("CONTRACT.STATUS"),
      dataIndex: "field",
      key: "field",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.orderStatus?.orderStatusName}
        </span>
    },
    {
      title: t("ORDER.ORDER_START_DATE"),
      dataIndex: "user",
      key: "user",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.orderStartDate ? convertTextToDate(record?.orderStartDate) : ''}
        </span>
    },
    {
      title: t("CONTRACT.CONTRACT_NUMBER"),
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.contractNumber}
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
              onClick={() => {
                setShowUpdatePopup(!showUpdatePopup);
                setCurrentId(record?.orderId);
              }}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_order_in_contracts"
              onClick={() => setCurrentId(record?.orderId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
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
          toast.success(response.message);
          document.getElementById("close-btn-doic")?.click();
          getListOrders();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("Error");
      })
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
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_products_order"
                                  className='btn custom-btn-blue-black'
                                >
                                  <i className="ti ti-square-rounded-plus" />
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
                            <Link to={route.orders}>
                              {t("ORDER.ORDER")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/contract-details/${id}`}>
                              {contractNumber}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("ORDER.ORDERS")}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <li>

                          </li>
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
                        total: totalPriceBook,
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
        <CreateOrder setShowPopup={setShowPopup} showPopup={showPopup} getList={getListOrders} isEdit={false} contractNumber={contractNumber} />
        <CreateOrder setShowPopup={setShowUpdatePopup} showPopup={showUpdatePopup} getDetail={getListOrders} isEdit={true} id={currentId} />
        <DeleteModal closeBtn={"close-btn-doic"} deleteId={"delete_order_in_contracts"} handleDelete={removeOrder} />
      </>
    </>
  );
};

export default ListOrdersInContract;
