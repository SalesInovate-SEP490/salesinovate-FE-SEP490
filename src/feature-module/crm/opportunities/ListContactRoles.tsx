import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import Swal from "sweetalert2";
import { deleteContactRole, getListContactRole, getOpportunityDetail } from "../../../services/opportunities";
import AddContactRole from "./AddContactRole";
import EditContactRole from "./EditContactRole";
import EditOneContactRole from "./EditOneContactRole";

const ListContactRoles = () => {
  const [opportunity, setOpportunity] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [openModal, setOpenModal] = useState<any>({
    addContactRole: false,
    editContactRole: false,
    editOneContactRole: false
  });
  const [contactRole, setContactRole] = useState<any>({});
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getContactRoles();
    getDetailOpportunity();
  }, [pageNo, pageSize]);

  const getDetailOpportunity = () => {
    getOpportunityDetail(id)
      .then((response: any) => {
        if (response.code === 1) {
          const newOpportuniry = response.data;
          setOpportunity(newOpportuniry);
        }
      })
      .catch((error: any) => {
      })
  }

  const getContactRoles = () => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
      pageNo: pageNo - 1,
      pageSize: pageSize
    }
    getListContactRole(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setViewList(response.data.items);
          setTotalPriceBook(response.data.total);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      });
  }

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const columns = [
    {
      title: t("CONTACT.CONTACT_NAME"),
      dataIndex: `contactName`,
      key: "contactName",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/contact-details/" + record?.contactId}>{record?.contactName}</Link>
      }
    },
    {
      title: t("CONTACT.ROLE"),
      dataIndex: "role",
      key: "role",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.coOppRelation?.contactRole?.roleName}
        </span>
    },
    {
      title: t("LABEL.OPPORTUNITIES.TITLE"),
      dataIndex: "title",
      key: "title",
      render: (value: any, record: Partial<any>) => (
        <span >
          {record?.title}
        </span>
      )
    },
    {
      title: t("LABEL.OPPORTUNITIES.PRIMARY"),
      dataIndex: "primary",
      key: "primary",
      render: (value: any, record: Partial<any>) => (
        <div>
          <input
            type="checkbox"
            checked={record?.coOppRelation?.primary}
            disabled
          />
        </div>
      )
    },
    {
      title: t("CONTACT.PHONE"),
      dataIndex: "phone",
      key: "phone",
      render: (value: any, record: Partial<any>) => (
        <span >
          {record?.phone}
        </span>
      )
    },
    {
      title: t("CONTACT.EMAIL"),
      dataIndex: "email",
      key: "email",
      render: (value: any, record: Partial<any>) => (
        <span >
          {record?.email}
        </span>
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
            <Link
              className="dropdown-item edit-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_one_contact_roles"
              onClick={() => openEditModalContactRole(record)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact_roles"
              onClick={() => setContactRole(record)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
          </div>
        </div >
      ),
    },
  ];

  const openEditModalContactRole = (item: any) => {
    setContactRole(item);
    setOpenModal({ ...openModal, editOneContactRole: true });
  }

  const setAddContactRole = (value: any) => {
    setOpenModal({ ...openModal, addContactRole: value });
  }

  const setEditContactRole = (value: any) => {
    setOpenModal({ ...openModal, editContactRole: value });
  }

  const setEditOneContactRole = (value: any) => {
    setOpenModal({ ...openModal, editOneContactRole: value });
  }


  const removeContactRole = () => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
      contactId: contactRole?.contactId
    }
    deleteContactRole(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Delete Success!");
          getContactRoles();
          document.getElementById('close-btn-dcr')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
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
                                  data-bs-target="#add_contact_roles"
                                  className='btn custom-btn-blue-black'
                                  onClick={() => setAddContactRole(true)}
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("LABEL.OPPORTUNITIES.ADD_CONTACT_ROLES")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_contact_roles"
                                  className='btn custom-btn-blue-black'
                                  onClick={() => setEditContactRole(true)}
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("LABEL.OPPORTUNITIES.EDIT_CONTACT_ROLES")}
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
                            <Link to={route.opportunities}>
                              {t("LABEL.OPPORTUNITIES.OPPORTUNITY")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/opportunities-details/${id}`}>
                              {opportunity?.opportunityName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("LABEL.OPPORTUNITIES.CONTACT_ROLES")}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <li>
                            <div className="form-sorts dropdown">
                              <Link
                                to="#"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="false"
                              >
                                <i className="ti ti-filter-share" />
                                Filter
                              </Link>
                            </div>
                          </li>
                          <li>
                            <div className="view-icons">
                              <Link to="#" className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to="#">
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
        <AddContactRole id={id} getList={getContactRoles} isOpen={openModal?.addContactRole} setIsOpen={setAddContactRole} />
        <EditContactRole id={id} getList={getContactRoles} isOpen={openModal?.editContactRole} setIsOpen={setEditContactRole} />
        <DeleteModal deleteId={"delete_contact_roles"} handleDelete={removeContactRole} closeBtn={"close-btn-dcr"} />
        <EditOneContactRole contact={contactRole} opportunity={opportunity} getList={getContactRoles}
          id={id} isOpen={openModal.editOneContactRole} setIsOpen={setEditOneContactRole} />
      </>
    </>
  );
};

export default ListContactRoles;
