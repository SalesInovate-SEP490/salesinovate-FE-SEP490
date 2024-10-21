import React, { useState, useEffect } from "react";
import Table from "../../core/common/dataTable/index";
import { rolesPermissionsData } from "../../core/data/json/rolesPermissions";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { TableData } from "../../core/data/interface";
import CollapseHeader from "../../core/common/collapse-header";

import { Role } from "./type"
import type { TableColumnGroupType, TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { getRoles, createRole, getRoleById, updateRole } from "../../services/role";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { initRole } from "./data";

const route = all_routes;

const RolesPermissions = () => {

  const { t } = useTranslation();
  const [addUser, setAddUser] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Role");
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRole, setTotalRole] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const [role, setRole] = useState<Role>(initRole);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const { id } = useParams<{ id: string }>();

  // create role
  const handleChange = (e: any, name?: any, nameChild?: any) => {
    console.log("E: ", e, name);
    if (e?.target) {
      const { name, value } = e.target;
      setRole({
        ...role,
        [name]: value,
      });
    } else {
      if (nameChild) {
        setRole({
          ...role,
          [name]: {
            [nameChild]: e.value,
            name: e.label
          },
          [nameChild]: e.value,
        });
      } else {
        setRole({
          ...role,
          [name]: e.value,
        });
      }
    }
  };

  const validate = () => {
    let tempErrors: { name?: string } = {};
    // Check required fields
    if (!role.name?.trim()) tempErrors.name = t("MESSAGE.ERROR.REQUIRED");
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      // Check if role name already exists
      const existingRole = viewList.find((item: Role) => item.name === role.name);
      if (existingRole) {
        toast.error("Role name already exists. Please choose a different name.");
        return; 
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}`;
      const currentDateTime = `${formattedDate} ${formattedTime}`;

      const roleToCreate: Role = {
        ...role,
        createdAt: currentDateTime,
      };
      createRole(roleToCreate)
        .then((response) => {
          toast.success("Create role successfully!");
          setRole({ ...initRole, id: viewList.length + 1 });
           getRoleDetail(role.id.toString());
          getListRole(pageNo, pageSize);
        })
        .catch((err) => {
          toast.error("Failed to create role.");
        });
    }
  };
  ///////////////////////////////////////////

  // update role
  useEffect(() => {
    if (id) {
      getRoleDetail(id);
    }
  }, [id]);

  const getRoleDetail = (roleId: string) => {
    getRoleById(roleId)
      .then(response => {
        console.log("Response: detail ", response);
        setRole(response);
      })
      .catch(err => {
        console.error("Error fetching role details:", err);
      });
  };

  const handleUpdate = () => {
    updateRole(role)
      .then(response => {
        toast.success("Update Role successfully!");
        getRoleDetail(role.id.toString());
        setShowPopup(false);
        getListRole(pageNo, pageSize);
      })
      .catch(err => {
        console.error("Failed to update role:", err);
        toast.error("Failed to update role.");
      });
  };


  ///////////////////////////////////////////

  const togglePopup = (isEditing: any) => {
    setModalTitle(isEditing ? "Edit Role" : "Add New Role");
    setAddUser(!addUser);
  };

  const getListRole = async (pageNo: number, pageSize: number) => {
    try {
      getRoles(pageNo, pageSize).then((data: any) => {
        console.log("data:", data)
        // if (data.code == 1) {
        setViewList(data);
        setTotalRole(data.total * pageSize);
        // }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  console.log("check view list: ", viewList)

  useEffect(() => {
    getListRole(pageNo, pageSize);
  }, [pageNo, pageSize]);


  const handleTableChange: TableProps<Role>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const handleEdit = (roleId:string ) => {
    setShowPopup(true);
    getRoleDetail(roleId);
  };

  const dataSource = rolesPermissionsData;
  const columns = [
    {
      title: t("ROLE.ROLE_NAME"),
      dataIndex: "name",
      sorter: (a: Role, b: Role) =>
        a.name.length - b.name.length,
      key: "name",
      width: "235px",
      render: (value: undefined, record: Partial<Role>) => {
        console.log("record: ", record)
        return <p>{record?.name}</p>
      }
    },
    {
      title: t("ROLE.CREATED_AT"),
      dataIndex: "createdAt",
      sorter: (a: Role, b: Role) =>
        a.createdAt.length - b.createdAt.length,
      key: "createdAt",
      width: "316px",
      render: (value: undefined, record: Partial<Role>) =>
        <p>
          {record?.createdAt}
        </p>
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "128px",
      render: (value: undefined, record:any) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={() => handleEdit(record.id)}
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_role"
            >
              <i className="ti ti-edit text-blue" /> {t("ROLE.EDIT")}
            </Link>
            <Link className="dropdown-item" to={route.permissions} >
              <i className="ti ti-shield text-success" /> {t("ROLE.PERMISSION")}
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="page-title">{t("ROLE.ROLES")}</h4>
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
                          <div className="form-wrap icon-form">
                            <span className="form-icon">
                              <i className="ti ti-search" />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search Roles"
                            />
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  className="btn btn-primary add-popup"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_role"
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  Add New Role
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Search */}
                    {/* Roles List */}
                    <div className="table-responsive custom-table">
                      <Table
                        dataSource={viewList}
                        columns={columns}
                        pagination={{
                          current: pageNo,
                          pageSize,
                          total: totalRole,
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
                    {/* /Roles List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Role */}
        {/* <Link
          to="#"
          className="btn btn-primary add-popup"
          onClick={() => setShowPopup(!showPopup)}
        >
          <i className="ti ti-square-rounded-plus" />
          {t("ROLE.ADD_NEW_ROLE")}
        </Link> */}
        {/* <div className="modal custom-modal fade" id="add_role" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Role</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Role Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="modal-btn">
                    <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
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
        </div>  */}

        <div className="modal custom-modal fade" id="add_role" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("ROLE.ADD_ROLE")}</h5>
                <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowPopup(false)}>
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-wrap" style={{ display: "none" }}>
                    <label className="col-form-label">
                      Role ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="id"
                      onChange={handleChange}
                      value={role?.id || ""}
                    />
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      {t("ROLE.ROLE_NAME")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      onChange={handleChange}
                      value={role?.name || ""}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                  <div className="modal-btn">
                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light" data-bs-dismiss="modal">
                      {t("ROLE.CANCEL")}
                    </Link>
                    <Link  to="#" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleCreate}>
                      {t("ROLE.SAVE_CHANGE")}
                    </Link>
                    
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer/>

        {/* /Add Role*/}
        {/* Edit Role */}
        <div className="modal custom-modal fade" id="edit_role" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("ROLE.EDIT_ROLE")}</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowPopup(false)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      {t("ROLE.ROLE_NAME")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      onChange={(e) => handleChange(e)}
                      value={role?.name}
                    />
                     {errors.name && <div className="text-danger">{errors.name}</div>}
                  </div>
                  <div className="modal-btn">
                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light" data-bs-dismiss="modal">
                      {t("ROLE.CANCEL")}
                    </Link>
                    <Link to='#' className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate}>
                       {t("ROLE.SAVE_CHANGE")}
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Edit Role */}
      </div>
    </>
  );
};

export default RolesPermissions;
