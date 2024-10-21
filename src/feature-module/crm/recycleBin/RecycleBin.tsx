import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import CollapseHeader from "../../../core/common/collapse-header";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import {
  getListAccountDelete,
  getListContactDelete,
  getListEmailTemplateDelete,
  getListLeadDelete,
  getListOpportunityDelete,
  restoreAccountById,
  restoreContactById,
  restoreEmailTemplateById,
  restoreLeadById,
  restoreListAccount,
  restoreListContact,
  restoreListEmailTemplate,
  restoreListLead,
  restoreListOpportunity,
  restoreOpportunityById,
  deleteAccountById,
  deleteContactById,
  deleteEmailTemplateById,
  deleteLeadById,
  deleteListAccount,
  deleteListContact,
  deleteListEmailTemplate,
  deleteListLead,
  deleteListOpportunity,
  deleteOpportunityById
} from "../../../services/recycleBin";
import Swal from "sweetalert2";
import DeleteModal from "../../support/deleteModal";
import RestoreModal from "../../support/restoreModal";

const listSelect = {
  account: "Account",
  contact: "Contact",
  lead: "Lead",
  opportunity: "Opportunity",
  email_template: "Email Template",
};
const RecycleBin = () => {
  const [currentId, setCurrentId] = useState(0);
  const { t } = useTranslation();

  const [viewList, setViewList] = useState<any>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState<any>("Lead");
  const [selectedRecordKeys, setSelectedRecordKeys] = useState<any[]>([]);
  const getListRecord = async (typeRecord?: any) => {
    try {
      const typeValue = typeRecord || type;
      Swal.showLoading();
      switch (typeValue) {
        case listSelect.lead:
          getListLeads()
          break;
        case listSelect.account:
          getListAccount()
          break;
        case listSelect.contact:
          getListContact()
          break;
        case listSelect.opportunity:
          getListOpportunity()
          break;
        case listSelect.email_template:
          getListEmailDelete()
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const getListLeads = () => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize,
    }
    getListLeadDelete(param)
      .then((res) => {
        Swal.close();
        if (res.code === 1) {
          setViewList(res?.data?.items.map((item: any) => {
            return {
              key: item.leadId,
              id: item.leadId,
              recordName: `${item.firstName} ${item.lastName}`,
              type: "Lead",
              deletedDate: item?.deletedDate,
              deletedBy: item?.deletedBy,
            }
          }));
          setTotal(res.data.total * pageSize);
        }
      })
      .catch((error) => {
        Swal.close();
        toast.error("Have error occur, contact admin for support.");
      });
  }

  const getListAccount = () => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize,
    }
    getListAccountDelete(param)
      .then((res) => {
        if (res.code === 1) {
          Swal.close();
          setViewList(res?.data?.items.map((item: any) => {
            return {
              key: item.accountId,
              id: item.accountId,
              recordName: item.accountName,
              type: "Account",
              deletedDate: item?.deletedDate,
              deletedBy: item?.deletedBy,
            }
          }));
          setTotal(res.data.total * pageSize);
        }
      })
      .catch((error) => {
        Swal.close();
        toast.error("Have error occur, contact admin for support.");
      });
  }

  const getListOpportunity = () => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize,
    }
    getListOpportunityDelete(param)
      .then((res) => {
        Swal.close();
        if (res.code === 1) {
          setViewList(res?.data?.items.map((item: any) => {
            return {
              key: item.opportunityId,
              id: item.opportunityId,
              recordName: item.opportunityName,
              type: "Opportunity",
              deletedDate: item?.deletedDate,
              deletedBy: item?.deletedBy,
            }
          }));
          setTotal(res.data.total * pageSize);
        }
      })
      .catch((error) => {
        Swal.close();
        toast.error("Have error occur, contact admin for support.");
      });
  }

  const getListContact = () => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize,
    }
    getListContactDelete(param)
      .then((res) => {
        Swal.close();
        if (res.code === 1) {
          setViewList(res?.data?.items.map((item: any) => {
            return {
              key: item.contactId,
              id: item.contactId,
              recordName: `${item.firstName} ${item.lastName}`,
              type: "Contact",
              deletedDate: item?.deletedDate,
              deletedBy: item?.deletedBy,
            }
          }));
          setTotal(res.data.total * pageSize);
        }
      })
      .catch((error) => {
        Swal.close();
        toast.error("Have error occur, contact admin for support.");
      });
  }

  const getListEmailDelete = () => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize,
    }
    getListEmailTemplateDelete(param)
      .then((res) => {
        Swal.close();
        if (res.code === 1) {
          setViewList(res?.data?.items.map((item: any) => {
            return {
              key: item.id,
              id: item.id,
              recordName: item.mailSubject,
              type: "Email Template",
              deletedDate: item?.deletedDate,
              deletedBy: item?.deletedBy,
            }
          }));
          setTotal(res.data.total * pageSize);
        }
      })
      .catch((error) => {
        Swal.close();
        toast.error("Have error occur, contact admin for support.");
      });
  }

  useEffect(() => {
  }, []);

  const doSearch = () => {
    getListRecord();
  }

  useEffect(() => {
    getListRecord();
  }, [pageNo, pageSize]);

  const removeRecord = () => {
    switch (type) {
      case listSelect.lead:
        deleteLeadById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
              document.getElementById("close-btn-dr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.account:
        deleteAccountById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
              document.getElementById("close-btn-dr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.contact:
        deleteContactById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
              document.getElementById("close-btn-dr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.opportunity:
        deleteOpportunityById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
              document.getElementById("close-btn-dr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.email_template:
        deleteEmailTemplateById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
              document.getElementById("close-btn-dr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      default:
        break
    }
  }

  const removeList = () => {
    if(selectedRecordKeys.length === 0) {
      toast.error("Please select record to delete.");
      return;
    };
    switch(type) {
      case listSelect.lead:
        deleteListLead(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.account:
        deleteListAccount(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.contact:
        deleteListContact(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.opportunity:
        deleteListOpportunity(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.email_template:
        deleteListEmailTemplate(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Delete successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      default:
        break;
    }
  }

  const restoreList = () => {
    if (selectedRecordKeys.length === 0) {
      toast.error("Please select record to restore.");
      return;
    }
    switch (type) {
      case listSelect.lead:
        restoreListLead(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.account:
        restoreListAccount(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.contact:
        restoreListContact(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.opportunity:
        restoreListOpportunity(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.email_template:
        restoreListEmailTemplate(selectedRecordKeys)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      default:
        break;
    }
  }

  const restoreById = () => {
    switch (type) {
      case listSelect.lead:
        restoreLeadById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
              document.getElementById("close-btn-rr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.account:
        restoreAccountById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
              document.getElementById("close-btn-rr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.contact:
        restoreContactById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
              document.getElementById("close-btn-rr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.opportunity:
        restoreOpportunityById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
              document.getElementById("close-btn-rr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      case listSelect.email_template:
        restoreEmailTemplateById(currentId)
          .then((res) => {
            if (res.code === 1) {
              toast.success("Restore successfully.");
              getListRecord();
              document.getElementById("close-btn-rr")?.click();
            }
          })
          .catch((error) => {
            toast.error("Have error occur, contact admin for support.");
          });
        break;
      default:
        break;
    }
  }

  const rowSelection = {
    selectedRowKeys: selectedRecordKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedRecordKeys(selectedRowKeys);
    }
  };

  const handleChangeType = (type: string) => {
    setType(type);
    getListRecord(type);
    setPageNo(1);
    setSelectedRecordKeys([]);
  }

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const columns = [
    {
      title: t("LABEL.RECYCLE_BIN.RECORD_NAME"),
      dataIndex: "recordName",
      key: "recordName",
      sorter: (a: any, b: any) =>
        a.recordName.length - b.recordName.length,
      render: (value: undefined, record: Partial<any>) =>
        <p>{record?.recordName}</p>
    },
    {
      title: t("LABEL.RECYCLE_BIN.TYPE"),
      dataIndex: "type",
      key: "type",
      render: (value: undefined, record: Partial<any>) =>
        <p>{type}</p>
    },
    {
      title: t("LABEL.RECYCLE_BIN.DELETED_DATE"),
      dataIndex: "deletedDate",
      key: "deletedDate",
      render: (value: undefined, record: Partial<any>) =>
        <p>{record?.deletedDate}</p>
    },
    {
      title: t("LABEL.RECYCLE_BIN.DELETED_BY"),
      dataIndex: "deletedBy",
      key: "deletedBy",
      render: (value: undefined, record: Partial<any>) =>
        <p>{record?.deletedBy}</p>
    },
    {
      title: t("ACTION.ACTION"),
      dataIndex: "action",
      render: (value: undefined, record: Partial<any>) => (
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
              data-bs-toggle="modal"
              data-bs-target="#restore_record"
              onClick={() => setCurrentId(record.id)}
            >
              Restore
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => setCurrentId(record.id)}
              data-bs-toggle="modal"
              data-bs-target="#delete_record"
            >
              Delete
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
                {/* Page Header */}
                {/* <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="page-title">
                        {type}
                      </h4>
                    </div>
                    <div className="col-4 text-end">
                      <div className="head-icons">
                        <CollapseHeader doSearch={doSearch} />
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* /Page Header */}
                <div className="card main-card">
                  <div className="card-body">
                    {/* Search */}
                    <div className="search-section">
                      <div className="row mb-2">
                        <div className="col-md-5 col-sm-4">
                          <div className="form-wrap icon-form">
                            <div className="sort-dropdown drop-down">
                              <Link
                                to="#"
                                className="dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                <i className="ti ti-sort-ascending-2" />
                                {t("LABEL.RECYCLE_BIN.TYPE")}
                              </Link>
                              <div className="dropdown-menu  dropdown-menu-start">
                                <ul>
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => handleChangeType(listSelect.lead)}
                                    >
                                      {t("LABEL.RECYCLE_BIN.LEAD")}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => handleChangeType(listSelect.account)}
                                    >
                                      {t("LABEL.RECYCLE_BIN.ACCOUNT")}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => handleChangeType(listSelect.contact)}
                                    >
                                      {t("LABEL.RECYCLE_BIN.CONTACT")}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => handleChangeType(listSelect.opportunity)}
                                    >
                                      {t("LABEL.RECYCLE_BIN.OPPORTUNITY")}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="#"
                                      onClick={() => handleChangeType(listSelect.email_template)}
                                    >
                                      {t("LABEL.RECYCLE_BIN.EMAIL_TEMPLATE")}
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <button
                                  className="btn custom-btn-blue-black add-btn-permission"
                                  onClick={restoreList}
                                >
                                  {t("ACTION.RESTORE")}
                                </button>
                              </li>
                              <li>
                                <button
                                  className="btn custom-btn-blue-black delete-btn-permission"
                                  onClick={removeList}
                                >
                                  {t("ACTION.DELETE")}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Search */}
                    {/* Manage Users List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={viewList} columns={columns} pagination={{
                        current: pageNo,
                        pageSize,
                        total: total, // Total number of items
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
        <div className="modal custom-modal fade" id="save_view" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New View</h5>
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
                    <label className="col-form-label">View Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-danger">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <DeleteModal deleteId={"delete_record"} closeBtn={"close-btn-dr"} handleDelete={removeRecord} />
        <RestoreModal action={restoreById} modalId={"restore_record"} closeBtn={"close-btn-rr"} />
        <ToastContainer />
      </>
    </>
  );
};

export default RecycleBin;
