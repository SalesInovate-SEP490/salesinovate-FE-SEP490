import React, { useState } from "react";
import Table from "../../core/common/dataTable/index";
import { contactReportsData } from "../../core/json/contactReport";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Chart from "react-apexcharts";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Reports_modal from "../../core/modals/reports_modal";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { TableData } from "../../core/data/interface";
import CollapseHeader from "../../core/common/collapse-header";
import Select from "react-select";
import {
  customStyles,
  options1,
} from "../../core/common/selectoption/selectoption";

const route = all_routes;

const ContactReport = () => {
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
  const [chartOptions3] = useState<any>({
    series: [44, 55, 41, 17],
    chart: {
      width: 350,
      type: "donut",
    },
    colors: ["#4A00E5", "#FFA201", "#0092E4", "#E41F07"],
    labels: ["Campaigns", "Google", "Referrals", "Paid Social"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    legend: {
      position: "bottom",
      formatter: function (val: any, opts: any) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  const [chartOptions4] = useState<any>({
    series: [
      {
        name: "Reports",
        data: [40, 30, 20, 30, 22, 20, 30, 20, 22, 30, 15, 20],
      },
    ],
    chart: {
      height: 273,
      type: "area",
      zoom: {
        enabled: false,
      },
    },
    colors: ["#4A00E5"],
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "",
      align: "left",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      min: 10,
      max: 60,
      tickAmount: 5,
      labels: {
        formatter: function (val: any) {
          return val / 1 + "K";
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
  });
  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "star",
      render: () => (
        <div className="set-star rating-select">
          <i className="fa fa-star" />
        </div>
      ),
      width: "2px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: TableData, b: TableData) => a.name.length - b.name.length,
      render: (text: any, record: any) => (
        <h2 className="table-avatar d-flex align-items-center">
          <Link to={route.contactDetails} className="avatar">
            <ImageWithBasePath
              className="avatar-img"
              src={record.avatar}
              alt="User Image"
            />
          </Link>
          <Link
            to={route.contactDetails}
            className="profile-split d-flex flex-column"
          >
            {record.name} <span>{record.role}</span>
          </Link>
        </h2>
      ),
      width: "146px",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: "78px",
      sorter: (a: TableData, b: TableData) => a.phone.length - b.phone.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "154px",
      sorter: (a: TableData, b: TableData) => a.email.length - b.email.length,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      sorter: (a: TableData, b: TableData) =>
        a.company.length - b.company.length,
      render: (text: any, record: any) => (
        <h2 className="table-avatar d-flex align-items-center">
          <Link to={route.companyDetails} className="company-img">
            <ImageWithBasePath
              className="avatar-img"
              src={record.company_image}
              alt="User Image"
            />
          </Link>
          <Link
            to={route.companyDetails}
            className="profile-split d-flex flex-column"
          >
            {record.company}
          </Link>
        </h2>
      ),
      width: "153px",
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      width: "101px",
      sorter: (a: TableData, b: TableData) =>
        a.industry.length - b.industry.length,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "54px",
      sorter: (a: TableData, b: TableData) => a.type.length - b.type.length,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: "57px",
      sorter: (a: TableData, b: TableData) => a.source.length - b.source.length,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: "135px",
      sorter: (a: TableData, b: TableData) =>
        a.createdDate.length - b.createdDate.length,
    },
  ];
  const dataSource = contactReportsData;

  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-8">
                    <h4 className="page-title">
                      Contact Report <span className="count-title">123</span>
                    </h4>
                  </div>
                  <div className="col-sm-4 text-sm-end">
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
                            placeholder="Search Contacts"
                          />
                        </div>
                      </div>
                      <div className="col-md-7 col-sm-8">
                        <div className="filter-list">
                          <ul>
                            <li>
                              <div>
                                <Link
                                  to="download_report"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#download_report"
                                >
                                  <i className="ti ti-file-download me-2" />
                                  Download Report
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}
                  <div className="row">
                    <div className="col-md-7">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="statistic-header report-header">
                            <h4>Contacts by Year</h4>
                            <div className="statistic-dropdown">
                              <div className="icon-form">
                                <span className="form-icon">
                                  <i className="ti ti-calendar" />
                                </span>
                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control  date-range bookingrange"
                                    type="text"
                                  />
                                </DateRangePicker>
                              </div>
                            </div>
                          </div>
                          <div id="contact-report">
                            <Chart
                              series={chartOptions4.series}
                              options={chartOptions4}
                              type="area"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 d-flex">
                      <div className="card report-card w-100">
                        <div className="card-body">
                          <div className="statistic-header report-header">
                            <h4>Contacts by Source</h4>
                            <div className="statistic-dropdown">
                              <div className="icon-form">
                                <span className="form-icon">
                                  <i className="ti ti-calendar" />
                                </span>
                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control  date-range bookingrange"
                                    type="text"
                                  />
                                </DateRangePicker>
                              </div>
                            </div>
                          </div>
                          <div id="contacts-analysis">
                            <Chart
                              series={chartOptions3.series}
                              options={chartOptions3}
                              type="donut"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card report-card-table">
                    <div className="card-body">
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
                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control  date-range bookingrange"
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
                                <div className="dropdown-menu  dropdown-menu-md-end">
                                  <h4>Want to manage datatables?</h4>
                                  <p>
                                    Please drag and drop your column to reorder
                                    your table and enable see option as you
                                    want.
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
                                        Phone
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
                                        Email
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
                                        Tags
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
                                        Location
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
                                        Rating
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
                                        Owner
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
                                        Contact
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-contact"
                                          className="check"
                                          defaultChecked
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
                                        Status
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-status"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-status"
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
                                <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end">
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
                      {/* Report List */}
                      <div className="table-responsive custom-table">
                        <Table columns={columns} dataSource={dataSource} />
                      </div>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="datatable-length" />
                        </div>
                        <div className="col-md-6">
                          <div className="datatable-paginate" />
                        </div>
                      </div>
                      {/* /Report List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <Reports_modal />
    </div>
  );
};

export default ContactReport;