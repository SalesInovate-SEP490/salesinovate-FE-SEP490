import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { TableData } from "../../../core/data/interface";
import { all_routes } from "../../router/all_routes";

import { Account } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateAccount } from "./createAccount";
import { deleteAccount, exportAccount, filterAccountForManager, filterAccounts } from "../../../services/account";
import { Filter } from "./filter";
import Swal from "sweetalert2";
import ImportAccount from "./importAccounts";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import ShareData from "../../commons/ShareData";
import { checkPermissionRole } from "../../../utils/authen";
import { getListFilter } from "../../../services/filter";

const Accounts = () => {
  const route = all_routes;
  const [showFilter, setShowFilter] = useState(false);
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOpportunity, setTotalOpportunity] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [query, setQuery] = useState<any>(null);
  const [id, setId] = useState<any>(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [listFilterOption, setListFilterOption] = useState<any>([]);
  const [newFilter, setNewFilter] = useState<any>(null);
  const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
  const [state, setState] = useState<any>({
    typeAccount: 'My Account',
  });
  const { t } = useTranslation();
  const type = 2;

  const togglePopup = (id: any) => {
    setShowEdit(true);
    setId(id);
  };

  const getListAccount = async (pageNo: number, pageSize: number) => {
    if (state.typeAccount === 'My Account') {
      filter(null);
    } else {
      filterManager(null);
    }
  };

  const filter = (newQuery?: any) => {
    Swal.showLoading();
    const param = {
      page: pageNo - 1,
      size: pageSize,
    }
    const finalQuery = newQuery ? newQuery : query;
    filterAccounts(param, finalQuery)
      .then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items?.map((item: any) => {
            return {
              ...item,
              key: item?.accountId
            }
          }));
          setTotalOpportunity(data?.data?.total * pageSize);
          checkPermissionRole(route.accounts);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      })
  }

  const filterManager = (newQuery?: any) => {
    Swal.showLoading();
    const param = {
      page: pageNo - 1,
      size: pageSize,
    }
    const finalQuery = newQuery ? newQuery : query;
    filterAccountForManager(param, finalQuery)
      .then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items?.map((item: any) => {
            return {
              ...item,
              key: item?.accountId
            }
          }));
          setTotalOpportunity(data?.data?.total * pageSize);
          checkPermissionRole(route.accounts);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      });
  }

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
  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedProductKeys(selectedRowKeys);
    }
  };
  useEffect(() => {
    getListAccount(pageNo, pageSize);
    checkPermissionRole(route.accounts);
    getFilterData();
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const removeAccount = () => {
    Swal.showLoading();
    deleteAccount(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          document.getElementById("close-btn-dc")?.click();
          getListAccount(pageNo, pageSize);
          toast.success("Delete successfully");
        } else {
          toast.error("Delete failed");
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
        toast.error("Delete failed");
      });
  }

  const columns = [
    {
      title: t("LABEL.ACCOUNTS.ACCOUNT_NAME"),
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a: TableData, b: TableData) =>
        a.accountName.length - b.accountName.length,
      render: (value: undefined, record: Partial<Account>) =>
        <Link to={"/accounts-details/" + record?.accountId}>{record?.accountName}</Link>
    },
    {
      title: t("LABEL.ACCOUNTS.PHONE"),
      dataIndex: "phone",
      key: "phone",
      sorter: (a: TableData, b: TableData) =>
        a.phone.length - b.phone.length,
      render: (value: undefined, record: Partial<Account>) =>
        <p>
          {record?.phone}
        </p>
    },
    {
      title: t("LABEL.ACCOUNTS.ACCOUNT_OWNER"),
      dataIndex: "owner",
      key: "owner",
      render: (value: undefined, record: Partial<any>) =>
        <p>
          Ngo Quang Trung
        </p>
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => togglePopup(record?.accountId)} >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
              onClick={() => setId(record?.accountId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
            <Link
              className="dropdown-item assign-btn-permission"
              to="#"
              onClick={() => {
                setId(record?.accountId);
                setShowShare(true);
              }}
            >
              <i className="ti ti-share"></i> {t("ACTION.ASSIGN")}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const excelExport = () => {
    Swal.showLoading();
    exportAccount()
      .then(response => {
        Swal.close();
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        Swal.close();
        toast.error("Export failed");
      })
  }

  const changeFilter = (value: any) => {
    setState({
      ...state,
      typeAccount: value
    })
    if (value === 'My Account') {
      filter(value);
    } else {
      filterManager(value);
    }
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
                            <img className="icon-screen-image-circle" src="https://e7.pngegg.com/pngimages/128/641/png-clipart-computer-icons-accounting-money-finance-business-accounting-text-service.png" alt="accounts" />
                            <div className="row">
                              <h4 className="col-md-12">{t("LABEL.ACCOUNTS.ACCOUNT")}</h4>
                              <div className="row">
                                <div className="sort-dropdown drop-down col-md-6">
                                  <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="ti ti-sort-ascending-2" />
                                    {t("FILTER.LIST_VIEW_FILTER")}
                                  </Link>
                                  <div className="dropdown-menu  dropdown-menu-start">
                                    <ul>
                                      {listFilterOption.map((item: any) => {
                                        return (
                                          <li key={item.value}>
                                            <Link to="#" onClick={() => { setNewFilter(item); }} className="dropdown-item">{item.label}</Link>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </div>
                                </div>
                                <div className="sort-dropdown drop-down col-md-6">
                                  <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    {state.typeAccount}
                                  </Link>
                                  <div className="dropdown-menu  dropdown-menu-start">
                                    <ul>
                                      <li>
                                        <Link to="#" onClick={() => changeFilter('My Account')} className="dropdown-item">My Account</Link>
                                      </li>
                                      <li>
                                        <Link to="#" onClick={() => changeFilter('Unassigned Account')} className="dropdown-item">Unassigned Account</Link>
                                      </li>
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
                                    className="btn custom-btn-blue-black import-btn-permission"
                                    data-bs-toggle="modal"
                                    data-bs-target="#import_accounts"
                                  >
                                    <i className="ti ti-package-export" />
                                    Import
                                  </Link>
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black export-btn-permission"
                                    onClick={excelExport}
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
                                    onClick={() => getListAccount(pageNo, pageSize)}
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
                    <div className="filter-section filter-flex" style={{ flexDirection: 'row-reverse' }}>
                      <div className="filter-list">
                        <ul>
                          <li>
                            <div className="form-sorts dropdown">
                              <Link
                                to="#"
                                className="btn custom-btn-blue-black"
                                onClick={() => setShowFilter(!showFilter)}
                              >
                                <i className="ti ti-filter-share" />
                                Filter
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
                        total: totalOpportunity, // Total number of items
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
        <CreateAccount setShowPopup={setShowPopup} showPopup={showPopup} getList={getListAccount} />
        <CreateAccount setShowPopup={setShowEdit} showPopup={showEdit} getDetail={() => getListAccount(pageNo, pageSize)} isEdit={true} id={id} />
        <Filter show={showFilter} setShow={setShowFilter} setQuery={setQuery} newFilter={newFilter} search={state.typeAccount === 'My Account' ? filter : filterManager} />
        <ImportAccount />
        <ToastContainer />
        <DeleteModal closeBtn="close-btn-dc" deleteId="delete_contact" handleDelete={removeAccount} />
        <ShareData isOpen={showShare} closeModal={() => setShowShare(false)} type="account" id={id} listLeads={selectedProductKeys} accountType={state?.typeAccount} />
      </>
    </>
  );
};

export default Accounts;
