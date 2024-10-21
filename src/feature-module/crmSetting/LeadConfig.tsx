import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../router/all_routes";
import { deleteContract, getListContract, getListOrderStatus } from "../../services/contract";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { checkPermissionRole } from "../../utils/authen";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { getAllConfigLead } from "../../services/config";
import { CreateLeadConfig } from "./createLeadConfig";

const LeadConfig = () => {
  const route = all_routes;
  const [viewList, setViewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [config, setConfig] = useState<any>({});
  const { t } = useTranslation();

  const getListConfig = async (currentPage: number, pageSize: number) => {
    try {
      Swal.showLoading();
      const param = {
        page: currentPage - 1,
        size: pageSize
      }
      getAllConfigLead(param).then((data: any) => {
        Swal.close();
        if (data.code == 1) {
          setViewList(data?.data?.items);
          setTotal(data?.totalItem);
          console.log("data:", data)
        }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      console.error("Error fetching Contract:", error);
    }
  };

  useEffect(() => {
    getListConfig(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    checkPermissionRole(route.contracts);
  }, [])

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const columns = [
    {
      title: t("CONFIG.LEAD_STATUS_NAME"),
      dataIndex: `leadStatusName`,
      key: "leadStatusName",
      render: (value: undefined, record: Partial<any>) => {
        console.log("record : ", record)
        return (
          <>
            <span>{record?.leadStatusName}</span>
          </>
        )
      }
    },
    {
      title: t("CONFIG.LEAD_STATUS_INDEX"),
      dataIndex: `leadStatusIndex`,
      key: "leadStatusIndex",
      render: (value: undefined, record: Partial<any>) => {
        return (
          <>
            <span>{record?.leadStatusIndex}</span>
          </>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
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
              className="dropdown-item"
              to="#"
              onClick={() => {
                setShowEditPopup(true);
                setConfig(record);
              }}
            >
              <i className="ti ti-edit text-blue" />
              {t("ACTION.EDIT")}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <>
        <div className="row">
          <div className="col-md-12">
            <div className="card main-card">
              <div className="card-body">
                {/* Search */}
                <div className="search-section">
                  <div className="row">
                    <div className="col-md-5 col-sm-4">
                      <div className="icon-text-wrapper">
                        <h4>{t("CONFIG.LEAD_CONFIG")}</h4>
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
                                onClick={() => getListConfig(currentPage, pageSize)}
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
                <div className="filter-section filter-flex d-flex justify-content-end ">
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
                    current: currentPage,
                    pageSize,
                    total: total,
                    onChange: (page, pageSize) => {
                      setCurrentPage(page);
                      setPageSize(pageSize);
                    },
                  }} onChange={handleTableChange} />
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
        <ToastContainer />
        <CreateLeadConfig showPopup={showPopup} setShowPopup={setShowPopup} getList={() => getListConfig(currentPage, pageSize)} />
        <CreateLeadConfig showPopup={showEditPopup} setShowPopup={setShowEditPopup} getList={() => getListConfig(currentPage, pageSize)} updateConfig={config} isEdit={true}/>
      </>
    </>
  );
};

export default LeadConfig;