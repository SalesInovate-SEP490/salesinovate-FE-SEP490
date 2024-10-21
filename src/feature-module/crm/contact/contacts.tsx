import React, { useState, useEffect, ComponentFactory } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteContact, exportExcel, filterContacts } from "../../../services/Contact";

import { Contact } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateContact } from "./createContact";
import { getContacts } from "../../../services/Contact";
import Swal from "sweetalert2";
import { checkPermissionRole } from "../../../utils/authen";
import { toast, ToastContainer } from "react-toastify";
import { ContactFilter } from "./filter";
import DeleteModal from "../../support/deleteModal";
import ShareData from "../../commons/ShareData";
import { getListFilter } from "../../../services/filter";

const Contacts = () => {
  const route = all_routes;
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalContact, setTotalContact] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [id, setId] = useState<any>(0);
  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [listFilterOption, setListFilterOption] = useState<any>([]);
  const [filter, setFilter] = useState<any>(null);
  const { t } = useTranslation();
  const type = 3;

  const togglePopup = (id: any) => {
    setId(id);
    setShowEdit(true);
  }


  const getListContact = async (pageNo: number, pageSize: number, newQuery?: any) => {
    try {
      Swal.showLoading();
      const finalQuery = newQuery ? newQuery : query;
      filterContacts(pageNo - 1, pageSize, finalQuery).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items || []);
          setTotalContact(data?.data?.total * pageSize);
          checkPermissionRole(route.contacts);
        } else {
          toast.error(data.message);
        }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      Swal.close();
      console.error("Error fetching Contacts:", error);
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
    getListContact(pageNo, pageSize);
    checkPermissionRole(route.contacts);
    getFilterData();
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<Contact>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const removeContact = () => {
    Swal.showLoading();
    deleteContact(id)
      .then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          document.getElementById("close-btn-dc")?.click();
          getListContact(pageNo, pageSize);
          toast.success("Delete contact successfully");
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        console.log("error:", error);
        Swal.close();
      });
  }

  const columns = [
    {
      title: t("CONTACT.CONTACT_NAME"),
      dataIndex: `contactName`,
      key: "contactName",
      render: (value: undefined, record: Partial<Contact>) => {
        console.log("record : ", record)
        // return <Link to={"/Contacts-details/" + record?.contactId}>{`${record?.first_name} ${record?.middle_name} ${record?.last_name}`}</Link>}
        return <Link to={"/Contacts-details/" + record?.contactId} className="link-details">{`${record?.firstName || ''} ${record?.middleName || ''} ${record?.lastName || ''}`}</Link>
      }
    },
    // {
    //   title: t("CONTACT.ACCOUNT_NAME"),
    //   dataIndex: "accountName",
    //   key: "accountName",
    //   render: (value: undefined, record: Partial<Contact>) => (
    //     <Link to={"/accounts-details/" + record?.accountId}>
    //       {record?.accountName}
    //     </Link>
    //   )
    // },
    {
      title: t("CONTACT.TITLE"),
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) =>
        a?.title?.length - b?.title?.length,
      render: (value: undefined, record: Partial<Contact>) =>
        <p>
          {record?.title}
        </p>
    },
    {
      title: t("CONTACT.EMAIL"),
      dataIndex: "email",
      key: "email",
      sorter: (a: any, b: any) =>
        a?.email?.length - b?.email?.length,
      render: (value: undefined, record: Partial<Contact>) =>
        <p>
          {record?.email}
        </p>
    },
    {
      title: t("CONTACT.PHONE"),
      dataIndex: "phone",
      key: "phone",
      sorter: (a: any, b: any) =>
        a?.phone?.length - b?.phone?.length,
      render: (value: undefined, record: any) =>
        <p>
          {record?.phone}
        </p>
    },
    {
      title: t("CONTACT.DEPARTMENT"),
      dataIndex: "department",
      key: "department",
      sorter: (a: any, b: any) =>
        a?.department?.length - b?.department?.length,
      render: (value: undefined, record: Partial<Contact>) =>
        <p>
          {record?.department}
        </p>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Partial<Contact>) => (
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
              onClick={() => togglePopup(record?.contactId)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>
            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
              onClick={() => setId(record?.contactId)}
            >
              <i className="ti ti-trash text-danger"></i>
              {t("ACTION.DELETE")}
            </Link>
            <Link
              className="dropdown-item assign-btn-permission"
              to="#"
              onClick={() => {
                setId(record?.contactId);
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
                            <img className="icon-screen-image-circle" src="https://png.pngtree.com/png-vector/20230213/ourmid/pngtree-circle-phone-call-icon-in-black-color-png-image_6596895.png" alt="Lead" />
                            <div className="row">
                              <h4 className="col-md-12">{t("LABEL.CONTACTS.CONTACT")}</h4>
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
                                <div className="form-sorts dropdown">
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
                                <div className="form-sorts dropdown">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black"
                                    onClick={() => getListContact(pageNo, pageSize)}
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
                        total: totalContact,
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
        {/* Add User */}
        <CreateContact setShowPopup={setShowPopup} showPopup={showPopup} getContact={getListContact} />
        <CreateContact showPopup={showEdit} isEdit={true} setShowPopup={setShowEdit} id={id} getContactDetail={() => getListContact(pageNo, pageSize, null)} />
        <ContactFilter show={showFilter} setShow={setShowFilter} search={getListContact} setQuery={setQuery} newFilter={filter} />
        <DeleteModal closeBtn="close-btn-dc" deleteId="delete_contact" handleDelete={removeContact} />
        <ToastContainer />
        <ShareData isOpen={showShare} closeModal={() => setShowShare(false)} type="contact" id={id} />
      </>
    </>
  );
};

export default Contacts;
