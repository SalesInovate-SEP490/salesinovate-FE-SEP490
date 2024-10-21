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
import { getAllConfigOpportunity } from "../../services/oppConfig";
import { CreateOppConfig } from "./createOpportunityConfig";

const OpportunityConfig = () => {
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
        currentPage: currentPage,
        perPage: pageSize
      }
      getAllConfigOpportunity(param).then((data: any) => {
        Swal.close();
        if (data.code == 1) {
          setViewList(data.data.items);
          setTotal(data.totalItem);
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
      title: t("CONFIG.OPPORTUNITY_STAGE_NAME"),
      dataIndex: `stageName`,
      key: "stageName",
      render: (value: undefined, record: Partial<any>) => {
        console.log("record : ", record)
        return (
          <>
            <span>{record?.stageName}</span>
          </>
        )
      }
    },
    {
      title: t("CONFIG.OPPORTUNITY_STAGE_INDEX"),
      dataIndex: `index`,
      key: "index",
      render: (value: undefined, record: Partial<any>) => {
        return (
          <>
            <span>{record?.index}</span>
          </>
        )
      }
    },
    {
      title: t("CONFIG.OPPORTUNITY_PROBABILITY"),
      dataIndex: `probability`,
      key: "probability",
      render: (value: undefined, record: Partial<any>) => {
        return (
          <>
            <span>{record?.probability}</span>
          </>
        )
      }
    },
    {
      title: t("CONFIG.OPPORTUNITY_IS_CLOSE_STAGE"),
      dataIndex: `isClose`,
      key: "isClose",
      render: (value: undefined, record: Partial<any>) => {
        return (
          <>
            <span>{record?.isClose ? "Yes" : "No"}</span>
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

  const formatDate = (date: string) => {
    return date.replace("T", " ").replace(".000+00:00", "");
  }

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
                        <h4>{t("CONFIG.OPPORTUNITY_CONFIG")}</h4>
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
        <CreateOppConfig showPopup={showPopup} setShowPopup={setShowPopup} getList={getListConfig} />
        <CreateOppConfig showPopup={showEditPopup} setShowPopup={setShowEditPopup} getList={getListConfig} updateConfig={config} isEdit={true} />
      </>
    </>
  );
};

export default OpportunityConfig;