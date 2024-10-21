import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { exportExcel, getLeads, removeLead } from "../../../services/lead";
import Select, { StylesConfig } from "react-select";
import { Lead } from "./type"
import type { TableColumnsType, TableProps } from 'antd';
import { CreateLeads } from './createLead';
import { useTranslation } from 'react-i18next';
import Swal from "sweetalert2";
import { checkPermissionRole } from "../../../utils/authen";
import { Filter } from "./filter";
import ImportLead from "./importLeads";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import ShareData from "../../commons/ShareData";
import { getListFilter } from "../../../services/filter";

const Leads = () => {
  const route = all_routes;
  const [id, setId] = useState<any>(0);
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState<any>(undefined)
  const [showShare, setShowShare] = useState(false);
  const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
  const [listFilterOption, setListFilterOption] = useState<any>([]);
  const [filter, setFilter] = useState<any>(null);
  const { t } = useTranslation();
  const type = 1;
  const togglePopup = (id: any) => {
    setId(id);
    setShowEdit(true);
  };

  const getListLeads = async (pageNo: number, pageSize: number, newQuery?: any) => {
    try {
      Swal.showLoading();
      let finalQuery = newQuery ? newQuery : query;
      getLeads(pageNo - 1, pageSize, finalQuery)
        .then((data: any) => {
          Swal.close();
          checkPermissionRole(route.leads);
          if (data.code === 1) {
            setViewList(data?.data?.items?.map((item: any) => {
              return {
                ...item,
                key: item.leadId,
              }
            }));
            setTotalLeads(data?.data?.total * pageSize);
          } else {
            toast.error(data?.message);
          }
        }).catch((error) => {
          Swal.close();
          console.log("error:", error)
        })
    } catch (error) {
      Swal.close();
      console.error("Error fetching leads:", error);
    }
  };

  const getFilterData = () => {
    getListFilter(type)
      .then((res) => {
        if (res.code === 1) {
          setListFilterOption(res.data.map((item: any) => {
            return {
              value: item.filterStoreId,
              label: item.filterName
            }
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    getListLeads(pageNo, pageSize, null);
    checkPermissionRole(route.leads);
    getFilterData();
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedProductKeys(selectedRowKeys);
    }
  };

  const customStyles: StylesConfig = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#E41F07" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#E41F07",
      },
      zIndex: 100010,
      position: "relative",
    }),
  };

  const deleteLead = () => {
    Swal.showLoading();
    removeLead(id)
      .then((response) => {
        Swal.close();
        if (response.code === 1) {
          document.getElementById("close-btn-dl")?.click();
          toast.success("Lead deleted successfully");
          getListLeads(pageNo, pageSize, null);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        Swal.close();
        console.log("Error deleting lead:", error);
        toast.error("Error deleting lead");
      })
  }

  const columns: TableColumnsType<Lead> = [
    {
      title: `${t("TITLE.LEADS.LEAD_NAME")}`,
      dataIndex: "leadName",
      key: "leadName",
      render: (value: undefined, record: any) =>
        <Link to={"/leads-details/" + record?.leadId} className="link-details">{(record?.firstName ?? "") + " " + (record?.lastName ?? "")}</Link>
    },
    {
      title: `${t("TITLE.LEADS.TITLE")}`,
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) => a?.title?.length - b?.title?.length,
      render: (value: undefined, record: any) => <p>{record?.title}</p>
    },
    {
      title: `${t("TITLE.LEADS.EMAIL")}`,
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) => a?.email?.length - b?.email?.length,
      render: (value: undefined, record: any) => <p>{record?.email}</p>
    },
    {
      title: `${t("TITLE.LEADS.PHONE")}`,
      dataIndex: "phone",
      key: "phone",
      sorter: (a: any, b: any) => a?.phone?.length - b?.phone?.length,
      render: (value: undefined, record: any) => <p>{record?.phone}</p>
    },
    {
      title: `${t("TITLE.LEADS.COMPANY_NAME")}`,
      dataIndex: "company",
      key: "company",
      sorter: (a: any, b: any) => a?.company?.length - b?.company?.length,
      render: (value: undefined, record: any) => (
        <span>{record?.company}</span>
      ),
    },
    {
      title: `${t("TITLE.LEADS.RATING")}`,
      dataIndex: "rating",
      key: "rating",
      sorter: (a: any, b: any) => a?.rating?.leadRatingName?.length - b?.rating?.leadRatingName?.length,
      render: (value: undefined, record: any) => (
        <div>
          {record?.rating?.leadRatingName === "Cold" && (
            <span className="badge badge-pill badge-status bg-danger">
              {record?.rating?.leadRatingName}
            </span>
          )}
          {record?.rating?.leadRatingName === "Warm" && (
            <span className="badge badge-pill badge-status bg-warning">
              {record?.rating?.leadRatingName}
            </span>
          )}
          {record?.rating?.leadRatingName === "Hot" && (
            <span className="badge badge-pill badge-status bg-success">
              {record?.rating?.leadRatingName}
            </span>
          )}
        </div>
      ),
    },
    {
      title: `${t("TITLE.LEADS.LEAD_STATUS")}`,
      dataIndex: "status",
      key: "status",
      sorter: (a: any, b: any) => a?.status?.leadStatusName?.length - b?.status?.leadStatusName?.length,
      render: (value: undefined, record: any) => <p>{record?.status?.leadStatusName}</p>
    },
    {
      title: `${t("TITLE.LEADS.CREATED_BY")}`,
      dataIndex: "createdBy",
      key: "createdBy",
      render: (value: undefined, record: any) => <p>{record?.createdBy}</p>
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => togglePopup(record?.leadId)} >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete-lead"
              onClick={() => setId(record?.leadId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
            {/* <Link
              className="dropdown-item assign-btn-permission"
              to="#"
              onClick={() => {
                setId(record?.leadId);
                setShowShare(true);
              }}
            >
              <i className="ti ti-share"></i> {t("ACTION.ASSIGN")}
            </Link> */}
          </div>
        </div>
      ),
    },
  ];

  const excelExport = () => {
    Swal.showLoading();
    exportExcel()
      .then(response => {
        Swal.close();
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xls');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
        toast.error("Error exporting excel file");
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
                {/* Page Header */}
                {/* /Page Header */}
                <div className="card main-card">
                  <div className="card-body">
                    {/* Search */}
                    <div className="search-section">
                      <div className="row">
                        <div className="col-md-5 col-sm-4">
                          <div className="icon-text-wrapper">
                            <img className="icon-screen-image-circle" src="https://cdn.iconscout.com/icon/free/png-256/free-generate-lead-902107.png?f=webp&w=256" alt="Lead" />
                            <div className="row">
                              <h4 className="col-md-12">{t("LABEL.LEADS.LEAD")} {filter?.label ? `(${filter.label})` : ""}</h4>
                              <div>
                                <div className="sort-dropdown drop-down">
                                  <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="ti ti-sort-ascending-2" />
                                    {t("FILTER.LIST_VIEW")}
                                  </Link>
                                  <div className="dropdown-menu  dropdown-menu-start">
                                    <ul>
                                      {listFilterOption.map((item: any) => {
                                        return (
                                          <li key={item.value}>
                                            <Link to="#" onClick={() => { setFilter(item); }} className="dropdown-item">{item.label}</Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black add-popup"
                                    onClick={() => {
                                      setId(0);
                                      setShowShare(true);
                                    }}
                                  >
                                    {t("ACTION.ASSIGN")}
                                  </Link>
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black import-btn-permission"
                                    data-bs-toggle="modal"
                                    data-bs-target="#import_leads"
                                  >
                                    <i className="ti ti-package-export" />
                                    {t("ACTION.IMPORT")}
                                  </Link>
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black export-btn-permission"
                                    onClick={() => excelExport()}
                                  >
                                    <i className="ti ti-package-export" />
                                    {t("ACTION.EXPORT")}
                                  </Link>
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black add-popup add-btn-permission"
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
                                    onClick={() => getListLeads(pageNo, pageSize, null)}
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
                            <div className="form-sorts dropdown">
                              <Link
                                to="#"
                                className="btn custom-btn-blue-black filter-btn-permission"
                                onClick={() => setShowFilter(!showFilter)}
                              >
                                <i className="ti ti-filter-share" />
                                Filter
                              </Link>
                            </div>
                          </li>
                          <li>
                            <div className="view-icons">
                              <Link to="/leads" className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to="/leads-kanban">
                                <i className="ti ti-grid-dots" />
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
                        current: pageNo,
                        pageSize,
                        total: totalLeads, // Total number of items
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
        <CreateLeads setShowPopup={setShowPopup} showPopup={showPopup} getLeads={getListLeads} />
        <CreateLeads setShowPopup={setShowEdit} showPopup={showEdit} id={id} isEdit={true} getDetailLead={getListLeads} />
        <Filter show={showFilter} setShow={setShowFilter} search={getListLeads} setQuery={setQuery} newFilter={filter} />
        <ImportLead />
        <DeleteModal closeBtn="close-btn-dl" deleteId="delete-lead" handleDelete={deleteLead} />
        <ShareData isOpen={showShare} closeModal={() => setShowShare(false)} id={id} type="lead" listLeads={selectedProductKeys} />
      </>
    </>
  );
};

export default Leads;