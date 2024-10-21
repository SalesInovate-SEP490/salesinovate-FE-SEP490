import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { all_routes } from '../../router/all_routes';
import Table from '../../../core/common/dataTable/index';
import { TableData } from '../../../core/data/interface';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { useDispatch, useSelector } from 'react-redux';
import { setActivityTogglePopup, setActivityTogglePopupTwo } from '../../../core/data/redux/commonSlice';
import CollapseHeader from '../../../core/common/collapse-header';
import Select, { StylesConfig } from "react-select";

import { Campaign } from "./type"
import type { TableColumnGroupType, TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateCampaign } from "./createCampaign";
import { getCampaign, exportExcel } from "../../../services/campaign";


const CampaignArchieve = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const activityToggle = useSelector((state: any) => state?.activityTogglePopup);
  const activityToggleTwo = useSelector((state: any) => state?.activityToggleTwo);

  const [viewList, setViewList] = useState<Campaign[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCampaign, setTotalCampaign] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Campaign");
  const [filters, setFilters] = useState<{ field: number; operator: number; value: string; }[]>([]);
  const [newFilter, setNewFilter] = useState({ field: 1, operator: 1, value: "" })
  const { t } = useTranslation();

  const location = useLocation();
  const isLinkActive = (route: string) => {
    return location.pathname === route;
  };
  const multiSelectOption = [
    { value: "small_business", label: "Small Business" },
    { value: "corporate_companies", label: "Corporate Companies" },
    { value: "urban_apartment", label: "Urban Apartment" },
    { value: "business", label: "Business" }
  ];

  const filterSelect = [
    { value: 'default', label: 'Select a View' },
    { value: 'contactViewList', label: 'Contact View List' },
    { value: 'contactLocationView', label: 'Contact Location View' }
  ];
  const togglePopup = (isEditing: any) => {
    setModalTitle(isEditing ? "Edit Campaign" : "Add New Campaign");
    setAddUser(!addUser);
  };

  const handleChange = (e: any, fieldName?: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setNewFilter({
        ...newFilter,
        [name]: value
      });
    } else
      setNewFilter({ ...newFilter, [fieldName]: e.value });
  }

  const addNewFilter = () => {
    setFilters([...filters, newFilter]);
    setNewFilter({ field: 1, operator: 1, value: "" });
    document.getElementById("close-btn-add-filter")?.click();
  }

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

  const getListCampaign = async (pageNo: number, pageSize: number) => {
    const param = {
      pageNo: pageNo,
      pageSize: pageSize
    }
    getCampaign(param).then((data: any) => {
      console.log("data:", data)
      if (data.code == 1) {
        setViewList(data.data.items);
        setTotalCampaign(data.data.total);
      }
    }
    ).catch((error) => { console.log("error:", error) })
  };

  console.log("check view list: ", viewList)

  useEffect(() => {
    getListCampaign(pageNo, pageSize);
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<Campaign>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const filteredCampaigns = viewList.filter((campaign) => campaign.status === 'In Progress');

  const columns = [
    {
      title: t("CAMPAIGN.CAMPAIGN_NAME"),
      dataIndex: "campaignName",
      key: "campaignName",
      sorter: (a: Campaign, b: Campaign) => a.campaignName.length - b.campaignName.length,
      render: (value: undefined, record: Partial<Campaign>) => {
        console.log("record: ", record)
        return <Link to={"/campaign-details/" + record?.id}>{record?.campaignName}</Link>
      }
    },
    {
      title: t("CAMPAIGN.STATUS"),
      dataIndex: "status",
      key: "status",
      render: (value: undefined, record: Partial<Campaign>) => (
        <div>
          {record?.status === "In Progress" && (
            <span className="badge badge-pill badge-status bg-success">In Progress</span>
          )}
          {record?.status === "Completed" && (
            <span className="badge badge-pill badge-status bg-warning">Completed</span>
          )}
          {record?.status === "Aborted" && (
            <span className="badge badge-pill badge-status bg-danger">Aborted</span>
          )}
          {record?.status === "Planned" && (
            <span className="badge badge-pill badge-status bg-info">Planned</span>
          )}
        </div>
      ),
      sorter: true,
    },
    {
      title: t("CAMPAIGN.iS_ACTIVE"),
      dataIndex: "isActive",
      key: "isActive",
      sorter: (a: Campaign, b: Campaign) =>
        a.campaignName.length - b.campaignName.length,
      render: (value: undefined, record: Partial<Campaign>) =>
        <div>
          <span className={`badge badge-pill badge-status ${record.isActive == true ? 'bg-success' : 'bg-danger'}`}>
            {record.isActive == true ? t("CAMPAIGN.ACTIVE") : t("CAMPAIGN.INACTIVE")}
          </span>
        </div>
    },
    {
      title: t("CAMPAIGN.START_DATE"),
      dataIndex: "",
      key: "isActive",
      sorter: (a: Campaign, b: Campaign) =>
        a.campaignName.length - b.campaignName.length,
      render: (value: undefined, record: Partial<Campaign>) =>
        <p>
          {record?.startDate}
        </p>
    },
    {
      title: t("CAMPAIGN.END_DATE"),
      dataIndex: "",
      key: "isActive",
      sorter: (a: Campaign, b: Campaign) =>
        a.campaignName.length - b.campaignName.length,
      render: (value: undefined, record: Partial<Campaign>) =>
        <p>
          {record?.endDate}
        </p>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: () => (
        <div className="dropdown table-action">
          <Link to="#" className="action-icon" data-bs-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate3d(-99.3333px, 35.3333px, 0px)' }} data-popper-placement="bottom-start">
            <Link className="dropdown-item edit-popup" to="#" onClick={() => dispatch(setActivityTogglePopupTwo(!activityToggleTwo))}>
              <i className="ti ti-edit text-blue"></i> {t("CAMPAIGN.EDIT")}
            </Link>
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#delete_campaign">
              <i className="ti ti-trash text-danger"></i> {t("LABEL.CAMPAIGN.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },

  ];
  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };

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
                  <div className="col-4">
                    <h4 className="page-title">
                      Campaign<span className="count-title">123</span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              {/* Campaign Status */}
              <div className="row">
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-danger-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-campaignmonitor" />
                      </span>
                      <p>Campaign</p>
                    </div>
                    <h2>474</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-warning-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-send" />
                      </span>
                      <p>Sent</p>
                    </div>
                    <h2>454</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-purple-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-feedly" />
                      </span>
                      <p>Opened</p>
                    </div>
                    <h2>658</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-success-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-pocket" />
                      </span>
                      <p>Completed</p>
                    </div>
                    <h2>747</h2>
                  </div>
                </div>
              </div>
              {/* /Campaign Status */}
              {/* Campaign Tab */}
              <div className="campaign-tab">
                <ul className="nav">
                  <li>
                    <Link to={route.campaign} className={isLinkActive(route.campaign) ? "active" : ""}>
                      Active Campaign<span>24</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={route.campaignComplete} className={isLinkActive(route.campaignComplete) ? "active" : ""}>
                      Completed Campaign
                    </Link>
                  </li>
                  <li>
                    <Link to={route.campaignArchieve} className={isLinkActive(route.campaignArchieve) ? "active" : ""}>Archived Campaign</Link>
                  </li>
                </ul>
              </div>
              {/* Campaign Tab */}
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
                            placeholder="Search Campaign"
                          />
                        </div>
                      </div>
                      <div className="col-md-7 col-sm-8">
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                              <div className="export-dropdwon">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export" />
                                  Export
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-pdf text-danger" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-xls text-green" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() => setShowPopup(!showPopup)}
                              >
                                <i className="ti ti-square-rounded-plus" />
                                {t("ACTION.ADD_NEW_CAMPAIGN")}
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
                        <li>
                          <div className="sort-dropdown drop-down">
                            <Link
                              to="#"
                              className="dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-sort-ascending-2" />
                              Sort{" "}
                            </Link>
                            <div className="dropdown-menu  dropdown-menu-start">
                              <ul>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Ascending
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Descending
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Recently Viewed
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Recently Added
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="form-wrap icon-form">
                            <span className="form-icon">
                              <i className="ti ti-calendar" />
                            </span>

                            <DateRangePicker initialSettings={initialSettings}>
                              <input
                                className="form-control bookingrange"
                                type="text"
                              />
                            </DateRangePicker>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="filter-list">
                      <ul>
                        <li>
                          <div className="manage-dropdwon">
                            <Link
                              to="#"
                              className="btn btn-purple-light"
                              data-bs-toggle="dropdown"
                              data-bs-auto-close="false"
                            >
                              <i className="ti ti-columns-3" />
                              Manage Columns
                            </Link>
                            <div className="dropdown-menu  dropdown-menu-xl-end">
                              <h4>Want to manage datatables?</h4>
                              <p>
                                Please drag and drop your column to reorder your
                                table and enable see option as you want.
                              </p>
                              <ul>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Name
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-name"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-name"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Type
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-phone"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-phone"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Progress
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-email"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-email"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Members
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-tag"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-tag"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Start Date
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-loc"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-loc"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    End Date
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-rate"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-rate"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Status
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-owner"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-owner"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Created
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-contact"
                                      className="check"
                                      defaultChecked={true}
                                    />
                                    <label
                                      htmlFor="col-contact"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Action
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-action"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-action"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
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
                            <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-xl-end">
                              <div className="filter-set-view">
                                <div className="filter-set-head">
                                  <h4>
                                    <i className="ti ti-filter-share" />
                                    Filter
                                  </h4>

                                </div>

                                <div
                                  className="accordion"
                                  id="accordionExample"
                                >
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo"
                                        aria-expanded="true"
                                        aria-controls="collapseTwo"
                                      >
                                        Country
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse show"
                                      id="collapseTwo"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <div className="form-wrap icon-form">
                                          <span className="form-icon">
                                            <i className="ti ti-search" />
                                          </span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Country"
                                          />
                                        </div>
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>India</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>USA</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>France</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>United Kingdom</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>UAE</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Italy</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Japan</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Germany</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#owner"
                                        aria-expanded="false"
                                        aria-controls="owner"
                                      >
                                        Owner
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="owner"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <div className="form-wrap icon-form">
                                          <span className="form-icon">
                                            <i className="ti ti-search" />
                                          </span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Owner"
                                          />
                                        </div>
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Hendry</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Guillory</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Jami</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Theresa</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Espinosa</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#Status"
                                        aria-expanded="false"
                                        aria-controls="Status"
                                      >
                                        Status
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="Status"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Active</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Inactive</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                        aria-expanded="false"
                                        aria-controls="collapseOne"
                                      >
                                        Rating
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="collapseOne"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <span>5.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <span>4.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>3.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>2.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>1.0</span>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree"
                                        aria-expanded="false"
                                        aria-controls="collapseThree"
                                      >
                                        Tags
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="collapseThree"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Promotion</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Rated</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Rejected</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Collab</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Calls</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-reset-btns">
                                  <div className="row">
                                    <div className="col-6">
                                      <Link to="#" className="btn btn-light">
                                        Reset
                                      </Link>
                                    </div>
                                    <div className="col-6">
                                      <Link
                                        to={route.contactList}
                                        className="btn btn-primary"
                                      >
                                        Filter
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Filter */}
                  {/* Campaign List */}
                  <div className="table-responsive custom-table">
                    <Table dataSource={filteredCampaigns} columns={columns} pagination={{
                      current: pageNo,
                      pageSize,
                      total: totalCampaign,
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
                  {/* /Campaign List */}
                  {/* Add New Campaign */}
                  <div className={`toggle-popup ${addUser ? "sidebar-popup" : ""}`}>
                    <div className="sidebar-layout">
                      <div className="sidebar-header">
                        <h4>{modalTitle}</h4>
                        <Link
                          to="#"
                          className="sidebar-close toggle-btn"
                          onClick={togglePopup}
                        >
                          <i className="ti ti-x" />
                        </Link>
                      </div>
                      <div className="toggle-body">
                        <form className="toggle-height">
                          <div className="pro-create">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Name <span className="text-danger">*</span>
                                  </label>
                                  <input type="text" className="form-control" />
                                </div>
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Campaign Type <span className="text-danger">*</span>
                                  </label>
                                  <select className="select2">
                                    <option>Choose</option>
                                    <option>Public Relations</option>
                                    <option>Brand</option>
                                    <option>Media</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Deal Value<span className="text-danger"> *</span>
                                  </label>
                                  <input className="form-control" type="text" />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Currency <span className="text-danger">*</span>
                                  </label>
                                  <select className="select">
                                    <option>Select</option>
                                    <option>$</option>
                                    <option>€</option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Period <span className="text-danger">*</span>
                                  </label>
                                  <input className="form-control" type="text" />
                                </div>
                              </div>
                              <div className="col-lg-3 col-md-6">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Period Value <span className="text-danger">*</span>
                                  </label>
                                  <input className="form-control" type="text" />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Target Audience <span className="text-danger">*</span>
                                  </label>
                                  <Select
                                    options={multiSelectOption}
                                    isMulti
                                    defaultValue={[multiSelectOption[0], multiSelectOption[1], multiSelectOption[2]]}
                                  />
                                </div>
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Description <span className="text-danger">*</span>
                                  </label>
                                  <textarea
                                    className="form-control"
                                    rows={4}
                                    defaultValue={""}
                                  />
                                </div>
                                <div className="form-wrap">
                                  <label className="col-form-label">
                                    Attachment <span className="text-danger">*</span>
                                  </label>
                                  <div className="drag-attach">
                                    <input type="file" />
                                    <div className="img-upload">
                                      <i className="ti ti-file-broken" />
                                      Upload File
                                    </div>
                                  </div>
                                </div>
                                <div className="form-wrap">
                                  <label className="col-form-label">Uploaded Files</label>
                                  <div className="upload-file upload-list">
                                    <div>
                                      <h6>tes.txt</h6>
                                      <p>4.25 MB</p>
                                    </div>
                                    <Link to="#" className="text-danger">
                                      <i className="ti ti-trash-x" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                  {/* /Add New Campaign */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>

  )
}

export default CampaignArchieve
