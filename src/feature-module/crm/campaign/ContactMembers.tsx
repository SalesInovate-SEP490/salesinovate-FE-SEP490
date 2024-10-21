import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteProductFromPriceBook, getPriceBookById, getProductsByPriceBook } from "../../../services/priceBook";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import { getCampaignById } from "../../../services/campaign";
import Swal from "sweetalert2";
import { deleteContactMember, deleteLeadMember, patchContactMember, patchLeadMember, viewContactMember, viewLeadMember } from "../../../services/campaign_member";
import AddLeadCampaign from "./AddLeadCampaign";
import UpdateStatusModal from "./updateStatusModal";
import AddContactCampaign from "./AddContactCampaign";

const ContactMembers = () => {
  const [campaign, setCampaign] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [contact, setContact] = useState<any>({});
  const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;


  useEffect(() => {
    getLeadsMember();
  }, [pageNo, pageSize]);

  useEffect(() => {
    getCampaignDetail();
  }, [])

  const getCampaignDetail = () => {
    Swal.showLoading();
    getCampaignById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setCampaign(response.data);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting campaign detail: ", error);
      })
  }


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getLeadsMember = () => {
    const param = {
      pageNo: pageNo - 1,
      pageSize,
      campaignId: id
    }
    viewContactMember(param).then(response => {
      if (response.code === 1) {
        setViewList(response.data.items.map((item: any) => {
          return {
            ...item,
            key: item.contactMember.contactId
          }
        }));
        console.log("viewList", viewList);
        setTotals(response.data.total);
      }
    })
      .catch(error => {
        console.error("Error getting products by PriceBook: ", error);
      })
  }

  const removeContactsFromCampaign = () => {
    const body = selectedProductKeys.map((item: any) => {
      return {
        campaignId: id,
        contactId: item
      }
    });
    deleteContactMember(body)
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getLeadsMember();
          document.getElementById('close-btn-rlc')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const removeContactFromCampaign = () => {
    deleteContactMember([{ campaignId: id, contactId: contact?.contactMember?.contactId }])
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getLeadsMember();
          document.getElementById('close-btn-dlfc')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const openEditModal = (contactId: any) => {
    setShowPopup(true);
    setContact(viewList.find((item: any) => item?.contactMember?.contactId === contactId));
  }

  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: any[]) => {
      setSelectedProductKeys(selectedRowKeys);
    }
  };

  const updateStatusContactMember = (status: any) => {
    Swal.showLoading();
    const body = selectedProductKeys.map((item: any) => {
      return {
        campaignId: id,
        contactId: item,
        memberStatus: status.value
      }
    });
    patchContactMember(body)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Status updated successfully.");
          getLeadsMember();
          setOpenUpdate(false);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const updateStatusContact = (status: any) => {
    Swal.showLoading();
    patchContactMember([{ campaignId: id, contactId: contact?.contactMember?.contactId , memberStatus: status.value }])
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Status updated successfully.");
          getLeadsMember();
          setShowPopup(false);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const closeUpdate = () => {
    setOpenUpdate(false);
  }

  const openUpdateStatus = () => {
    if (selectedProductKeys.length === 0) {
      toast.warn("Please select at least one product.");
      return;
    }
    setOpenUpdate(true);
  }

  const columns = [
    {
      title: t("LABEL.LEADS.STATUS"),
      dataIndex: "status",
      key: "status",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.contactMember?.memberStatus?.campaignMemberStatusName ?? ""}
        </span>
    },
    {
      title: t("TITLE.LEADS.NAME"),
      dataIndex: 'name',
      key: "name",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/leads-details/" + record?.contactMember?.contactId}>{record?.firstName + " " + record?.lastName}</Link>
      }
    },
    {
      title: t("LABEL.LEADS.TITLE"),
      dataIndex: "title",
      key: "title",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.title}
        </span>
    },
    {
      title: t("TITLE.LEADS.COMPANY"),
      dataIndex: "company",
      key: "company",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.company}
        </span>
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
            <Link className="dropdown-item edit-btn-permission" to="#"
              onClick={() => openEditModal(record?.contactMember?.contactId)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact_from_campaign"
              onClick={() => setContact(viewList.find((item: any) => item?.contactMember?.contactId === record?.contactMember?.contactId ))}
            >
              <i className="ti ti-trash text-danger"></i> Delete
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
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_contacts_campaign"
                                  className='btn custom-btn-blue-black'
                                >
                                  {t("ACTION.ADD")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  onClick={openUpdateStatus}
                                  className='btn custom-btn-blue-black'
                                >
                                  {t("ACTION.UPDATE_STATUS")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#remove_contacts_campaign"
                                  className='btn custom-btn-blue-black'
                                >
                                  {t("ACTION.REMOVE")}
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
                            <Link to={route.campaign}>
                              {t("CAMPAIGN.CAMPAIGN")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/campaign-details/${id}`}>
                              {campaign?.campaignName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("CAMPAIGN.CONTACT_MEMBERS")}</h5>
                      </div>
                    </div>
                    {/* /Filter */}
                    {/* Manage Users List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={viewList} columns={columns} pagination={{
                        current: pageNo,
                        pageSize,
                        total: totals,
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
        <DeleteModal closeBtn={"close-btn-rlc"} deleteId={"remove_contacts_campaign"} handleDelete={removeContactsFromCampaign} />
        <DeleteModal closeBtn={"close-btn-dlfc"} deleteId={"delete_contact_from_campaign"} handleDelete={removeContactFromCampaign} />
        <AddContactCampaign campaignId={id} data={campaign} getList={getLeadsMember}/>
        <UpdateStatusModal handleUpdate={updateStatusContactMember} isOpen={openUpdate} closeModal={closeUpdate} total={selectedProductKeys.length} />
        <UpdateStatusModal handleUpdate={updateStatusContact} isOpen={showPopup} closeModal={() => setShowPopup(false)} />
      </>
    </>
  );
};

export default ContactMembers;
