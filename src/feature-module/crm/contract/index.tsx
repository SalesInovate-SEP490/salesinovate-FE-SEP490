import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteContract, getListContract, getListOrderStatus } from "../../../services/contract";

import { Contract, Address } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateContract } from "./createContract";
import Swal from "sweetalert2";
import { checkPermissionRole } from "../../../utils/authen";
import { Bounce, ToastContainer, toast } from 'react-toastify'
import './contract.scss'
import DeleteModal from "../../support/deleteModal";

const Contracts = () => {
  const route = all_routes;
  const { t } = useTranslation();
  const [viewList, setViewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalContract, setTotalContract] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractId, setContractId] = useState(null);

  const getListContracts = async (currentPage: number, pageSize: number) => {
    try {
      Swal.showLoading();
      const param = {
        currentPage: currentPage,
        perPage: pageSize
      }
      getListContract(param).then((data: any) => {
        Swal.close();
        if (data.code == 1) {
          setViewList(data?.data?.items);
          setTotalContract(data?.total * pageSize);
        }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      console.error("Error fetching Contract:", error);
    }
  };

  useEffect(() => {
    getListContracts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    checkPermissionRole(route.contracts);
  }, [])

  const handleTableChange: TableProps<Contract>['onChange'] = (pagination) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const triggerDeleteContract = (id: any) => {
    setContractId(id);
    setShowDeleteModal(true);
  };

  const removeContract = () => {
    deleteContract(contractId)
      .then((response) => {
        setShowDeleteModal(false);
        if (response.code === 1) {
          customToast("success", response.message);
          getListContracts(currentPage, pageSize);
        } else {
          customToast("error", response.message);
        }
      })
      .catch((error) => {
        customToast("error", "System error, contract admin to fix.");
        console.error("Error deleting contract: ", error);
      });
  };

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
      title: t("CONTRACT.CONTRACT_NUMBER"),
      dataIndex: `contractNumber`,
      key: "contractNumber",
      render: (value: undefined, record: Partial<Contract>) => {
        console.log("record : ", record)
        return <Link to={"/contract-details/" + record?.contractId} className="link-details">{record?.contractId}</Link>
      }
    },
    {
      title: t("CONTRACT.ACCOUNT_NAME"),
      dataIndex: "accountName",
      key: "accountName",
      render: (value: undefined, record: Partial<Contract>) =>
        <p>
          {record?.accountId}
        </p>
    },
    {
      title: t("CONTRACT.CONTRACT_START_DATE"),
      dataIndex: "startDate",
      key: "startDate",
      render: (value: undefined, record: Partial<Contract>) =>
        <p>
          {record?.contractStartDate ? formatDate(record?.contractStartDate) : ""}
        </p>
    },
    {
      title: t("CONTRACT.CONTRACT_END_DATE"),
      dataIndex: "endDate",
      key: "endDate",
      render: (value: undefined, record: Partial<Contract>) =>
        <p>
          {record?.ownerExpirationNotice ? formatDate(record?.ownerExpirationNotice) : ""}
        </p>
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
                setContractId(record?.contractId);
              }}
            >
              <i className="ti ti-edit text-blue" />
              {t("ACTION.EDIT")}
            </Link>

            <Link className="dropdown-item" to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contract"
              onClick={() => triggerDeleteContract(record?.contractId)}
            >
              <i className="ti ti-trash text-danger"></i>
              {t("ACTION.DELETE")}
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
                            <img className="icon-screen-image-circle" src="https://www.svgrepo.com/show/18783/contract.svg" alt="contract" />
                            <h4>{t("LABEL.CONTRACTS.CONTRACT")}</h4>
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
                                    onClick={() => getListContracts(currentPage, pageSize)}
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
                          <li>
                            <div className="view-icons">
                              <Link to="/#" className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                            </div>
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
                        total: totalContract,
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
          </div>
        </div>
        {/* /Page Wrapper */}
        <ToastContainer />
        <CreateContract setShowPopup={setShowPopup} showPopup={showPopup} getContract={getListContracts} />
        <CreateContract setShowPopup={setShowEditPopup} showPopup={showEditPopup} getContract={getListContracts} isEdit={true} id={contractId} />
        <DeleteModal deleteId="delete_contract" closeBtn="close-btn-dc" handleDelete={removeContract} />

      </>
    </>
  );
};

export default Contracts;
