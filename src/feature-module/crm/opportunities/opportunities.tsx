import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { TableData } from "../../../core/data/interface";
import CollapseHeader from "../../../core/common/collapse-header";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { deleteOpportunity, getOpportunity } from "../../../services/opportunities";
import { CreateOpportunity } from "./createOpportunity";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { OpportunityFilter } from "./filter";
import { convertTextToDate } from "../../../utils/commonUtil";
import DeleteModal from "../../support/deleteModal";
import ShareData from "../../commons/ShareData";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { getListFilter } from "../../../services/filter";


const Opportunities = () => {
  const route = all_routes;
  const [showFilter, setShowFilter] = useState(false);
  const { t } = useTranslation();
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
  const [filter, setFilter] = useState<any>(null);
  const type = 4;
  const togglePopup = (id: any) => {
    setId(id);
    setShowEdit(true);
  };

  const getListOpportunity = async (pageNo: number, pageSize: number, newQuery?: any) => {
    try {
      Swal.showLoading();
      const param = {
        page: pageNo - 1,
        size: pageSize,
      }
      const finalQuery = newQuery ? newQuery : query;
      getOpportunity(param, finalQuery).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items?.map((item: any) => {
            item.key = item.opportunityId;
            return item;
          }));
          setTotalOpportunity(data?.data?.total);
        }
      }
      ).catch((error) => { console.log("error:", error) })
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
    getListOpportunity(pageNo, pageSize);
    checkPermissionRole(route.opportunitiesDetails);
    getFilterData();
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const columns = [
    {
      title: t("LABEL.OPPORTUNITIES.OPPORTUNITY_NAME"),
      dataIndex: "opportunityName",
      key: "opportunityName",
      sorter: (a: TableData, b: TableData) =>
        a.opportunityName.length - b.opportunityName.length,
      render: (value: undefined, record: Partial<any>) =>
        <Link to={"/opportunities-details/" + record?.opportunityId} className="link-details">{record?.opportunityName}</Link>
    },
    // {
    //   title: t("LABEL.OPPORTUNITIES.ACCOUNT_NAME"),
    //   dataIndex: "accountId",
    //   key: "accountId",
    //   sorter: (a: TableData, b: TableData) =>
    //     a.accountId - b.accountId,
    //   render: (value: undefined, record: Partial<any>) =>
    //     <Link to={`accounts-details/${record?.accountId}`} className="link-details">
    //       {record?.accountName}
    //     </Link>
    // },
    {
      title: t("LABEL.OPPORTUNITIES.STAGE"),
      dataIndex: "title",
      key: "firstName",
      sorter: (a: TableData, b: TableData) =>
        a.stage.length - b.stage.length,
      render: (value: undefined, record: Partial<any>) => <p>{record?.stage?.stageName}</p>
    },
    {
      title: t("LABEL.OPPORTUNITIES.CLOSE_DATE"),
      dataIndex: "email",
      key: "company",
      sorter: (a: TableData, b: TableData) =>
        a.company.length - b.company.length,
      render: (value: undefined, record: Partial<any>) => <p>{record?.closeDate ? convertTextToDate(record?.closeDate) : ''}</p>
    },
    {
      title: t("LABEL.OPPORTUNITIES.OPPORTUNITY_OWNER"),
      dataIndex: "phone",
      key: "company",
      sorter: (a: TableData, b: TableData) =>
        a.company.length - b.company.length,
      render: (value: undefined, record: Partial<any>) => <p>{record?.last_modified_by}</p>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value: undefined, record: any) => (
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => togglePopup(record?.opportunityId)} >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_opportunity"
              onClick={() => setId(record?.opportunityId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
            <Link
              className="dropdown-item assign-btn-permission"
              to="#"
              onClick={() => {
                setId(record?.opportunityId);
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

  const removeOpportunity = (id: any) => {
    Swal.showLoading();
    deleteOpportunity(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          document.getElementById("close-btn-do")?.click();
          toast.success("Opportunity deleted successfully.");
          getListOpportunity(pageNo, pageSize);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error deleting opportunity:", error);
      });
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
                            <img className="icon-screen-image-circle" src="/assets/img/icons/crown.png" alt="Opp" />
                            <div className="row">
                              <h4>{t("LABEL.OPPORTUNITIES.OPPORTUNITY")}</h4>
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
                                <Link
                                  to="#"
                                  className="btn custom-btn-blue-black add-btn-permission"
                                  onClick={() => setShowPopup(!showPopup)}
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("ACTION.ADD")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="btn custom-btn-blue-black add-popup"
                                  onClick={() => getListOpportunity(pageNo, pageSize, null)}
                                >
                                  <i className="ti ti-refresh-dot" />
                                  {t("ACTION.REFRESH")}
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
                          <li>
                            <div className="view-icons">
                              <Link to="/leads" className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to="/opportunity-kanban">
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
                        total: totalOpportunity, // Total number of items
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
        <CreateOpportunity setShowPopup={setShowPopup} showPopup={showPopup} getOpportunities={getListOpportunity} />
        <CreateOpportunity showPopup={showEdit} setShowPopup={setShowEdit} id={id} getDetail={() => { getListOpportunity(pageNo, pageSize) }} isEdit={true} />
        <ToastContainer />
        <OpportunityFilter show={showFilter} setShow={setShowFilter} search={getListOpportunity} setQuery={setQuery} newFilter={filter}/>
        <DeleteModal deleteId="delete_opportunity" handleDelete={() => removeOpportunity(id)} closeBtn="close-btn-do" />

        <ShareData isOpen={showShare} closeModal={() => setShowShare(false)} id={id} type="opportunity" />
      </>
    </>
  );
};

export default Opportunities;
