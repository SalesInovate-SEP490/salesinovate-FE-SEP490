import React, { useState, useEffect } from "react";
import Table from "../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { all_routes } from "../router/all_routes";
import { manageusersData } from "../../core/data/json/manageuser";
import CollapseHeader from "../../core/common/collapse-header";

import { User } from "./type"
import { useTranslation } from "react-i18next";
import { adminFilter, getUsers } from "../../services/user";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from 'react-toastify'
import './user.scss'
import { UpdateAndAdd } from './updateAndAdd'
import { Filter } from "./filter";


const route = all_routes;


const Manageusers = () => {
  const [adduser, setAdduser] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New User");
  const data = manageusersData;

  const { t } = useTranslation();

  const [viewList, setViewList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editId, setEditId] = useState<null | string>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<any>(null);


  const customStyles: StylesConfig = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#E41F07" : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      "&:hover": {
        backgroundColor: "#E41F07",
      },
    }),
  };

  const togglePopup = (id?: string | null) => {
    if (id) {
      setEditId(id);
      setIsEdit(true);
    } else {
      setEditId(null);
      setIsEdit(false);
    }
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    togglePopup(null);
  };

  const filter = (newQuery?: any) => {
    Swal.showLoading();
    const param = {
      page: pageNo - 1,
      size: pageSize,
    }
    const finalQuery = newQuery ? newQuery : query;
    adminFilter(finalQuery, param).then((data: any) => {
      Swal.close();
      if (data.code == 1) {
        setViewList(data?.data?.items);
        setTotal(data?.data?.total);
      }
    }).catch((error) => { console.log("error:", error) })
  }

  const getListUser = async () => {
    filter(null);
  };

  useEffect(() => {
    getListUser();
  }, []);

  const options1 = [
    { value: "Select a View", label: "Select a View" },
    { value: "Contact View List", label: "Contact View List" },
    { value: "Contact Location View", label: "Contact Location View" },
  ];
  const options2 = [
    { value: "Choose", label: "Choose" },
    { value: "Germany", label: "Germany" },
    { value: "USA", label: "USA" },
    { value: "Canada", label: "Canada" },
    { value: "India", label: "India" },
    { value: "China", label: "China" },
  ];

  const [passwords, setPasswords] = useState([false, false]);

  const togglePassword = (index: any) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index] = !updatedPasswords[index];
    setPasswords(updatedPasswords);
  };

  const openEditModal = () => {

  }

  const columns = [
    {
      title: t("LABEL.USER.USER_NAME"),
      dataIndex: `userName`,
      key: "userName",
      sorter: (a: User, b: User) => {
        return a.userName.localeCompare(b.userName);
      },
      render: (text: any, record: any) =>  {
        console.log("record : ", record)
        return <Link to={"/user-detail/" + record?.userId} className="link-details">{record?.firstName} {record?.lastName}</Link>
      }
    },
    {
      title: t("USER_MANAGE.EMAIL"),
      dataIndex: "email",
      key: "email",
      render: (text: string, record: Partial<User>) => (
        <div>{record?.email}</div>
      )
    },
    {
      title: t("USER_MANAGE.PHONE"),
      dataIndex: "phone",
      key: "phone",
      render: (text: string, record: Partial<User>) => (
        <div>{record?.phone}</div>
      )
    },
    {
      title: t("LABEL.USER.ROLE_NAME"),
      dataIndex: "roleName",
      key: "roleName",
      render: (text: string, record: Partial<User>) => (
        <div className="role-names">
          {record?.roles?.map(role => (
            <span key={role.id} className="role-name">
              {role.name}
            </span>
          ))}
        </div>
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => togglePopup(record?.userId)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>


            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.BAN")}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>

      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      User
                      <span className="count-title">{total}</span>
                    </h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
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
                              <div className="export-dropdwon">
                                <Link
                                  to="#"
                                  className="btn custom-btn-blue-black add-popup"
                                  onClick={() => filter(null)}
                                >
                                  <i className="ti ti-refresh-dot" />
                                  {t("ACTION.REFRESH")}
                                </Link>
                              </div>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn custom-btn-blue-black add-btn-permission"
                                onClick={() => togglePopup(null)}
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
                  <div className="filter-section filter-flex d-flex justify-content-end">
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
                    <Table dataSource={viewList} columns={columns} />
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
      <div className={`toggle-popup ${adduser ? "sidebar-popup" : ""}`}>
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>{modalTitle}</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={closePopup}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="pro-create">
              <form>
                <div className="accordion-lists" id="list-accord">
                  {/* Basic Info */}
                  <div className="manage-user-modal">
                    <div className="manage-user-modals">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="profile-pic-upload">
                            <div className="profile-pic">
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            </div>
                            <div className="upload-content">
                              <div className="upload-btn">
                                <input type="file" />
                                <span>
                                  <i className="ti ti-file-broken" />
                                  Upload File
                                </span>
                              </div>
                              <p>JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              {" "}
                              Name <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              User Name <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <div className="d-flex justify-content-between align-items-center">
                              <label className="col-form-label">
                                Email <span className="text-danger">*</span>
                              </label>
                              <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                <span className="me-2 label-text">
                                  Email Opt Out
                                </span>
                                <input
                                  type="checkbox"
                                  id="user1"
                                  className="check"
                                  defaultChecked={true}
                                />
                                <label
                                  htmlFor="user1"
                                  className="checktoggle"
                                />
                              </div>
                            </div>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Role <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Phone 1 <span className="text-danger">*</span>
                            </label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Phone 2</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="icon-form-end">
                              <span
                                className="form-icon"
                                onClick={() => togglePassword(0)}
                              >
                                <i
                                  className={
                                    passwords[0]
                                      ? "ti ti-eye"
                                      : "ti ti-eye-off"
                                  }
                                ></i>
                              </span>
                              <input
                                type={passwords[0] ? "text" : "password"}
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Repeat Password{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <div className="icon-form-end">
                              <span
                                className="form-icon"
                                onClick={() => togglePassword(1)}
                              >
                                <i
                                  className={
                                    passwords[1]
                                      ? "ti ti-eye"
                                      : "ti ti-eye-off"
                                  }
                                ></i>
                              </span>
                              <input
                                type={passwords[1] ? "text" : "password"}
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Location <span className="text-danger">*</span>
                            </label>
                            <Select styles={customStyles} className="select" options={options2} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="radio-wrap">
                            <label className="col-form-label">Status</label>
                            <div className="d-flex flex-wrap">
                              <div className="radio-btn">
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="active1"
                                  name="status"
                                  defaultChecked={true}
                                />
                                <label htmlFor="active1">Active</label>
                              </div>
                              <div className="radio-btn">
                                <input
                                  type="radio"
                                  className="status-radio"
                                  id="inactive1"
                                  name="status"
                                />
                                <label htmlFor="inactive1">Inactive</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                </div>
                <div className="submit-button text-end">
                  <Link to="#" className="btn btn-light sidebar-close">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add User */}
      <div
        className="modal custom-modal fade"
        id="delete_contact"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Remove User?</h3>
                <p className="del-info">
                  Are you sure you want to remove it.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.manageusers} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      {/* <UpdateAndAdd setShowPopup={setShowPopup} showPopup={showPopup} getUser={getListUser} /> */}
      <UpdateAndAdd
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        getUser={getListUser}
        isEdit={isEdit}
        id={editId}
      />
      <Filter show={showFilter} setShow={setShowFilter} setQuery={setQuery} search={filter} />
    </>
  );
};

export default Manageusers;
