import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { TableData } from "../../../core/data/interface";
import CollapseHeader from "../../../core/common/collapse-header";
import { all_routes } from "../../router/all_routes";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { downloadFileFromDrive, downloadFileJson, generateReport } from "../../../services/report";
import Swal from "sweetalert2";

const exampleData = [
  { id: 1, reportName: 'Lead', reportType: 'Lead', description: 'Report about lead' },
  { id: 2, reportName: "Opportunity", reportType: "Opportunity", description: "Report about opportunity" },
  { id: 3, reportName: "Account", reportType: "Account", description: "Report about account" },
]
const ListReport = () => {
  const [viewList, setViewList] = useState<any>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [ListReports, setListReports] = useState<any>([]);
  const { t } = useTranslation();

  const getListReport = async (pageNo: number, pageSize: number) => {
    setViewList(exampleData);
    setTotalLeads(1);
  };

  useEffect(() => {
    getListReport(pageNo, pageSize);
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const columns = [
    {
      title: t("LABEL.REPORT.REPORT_NAME"),
      dataIndex: "reportName",
      key: "reportName",
      sorter: (a: TableData, b: TableData) =>
        a.reportName.length - b.reportName.length,
      render: (value: undefined, record: Partial<any>) =>
        <Link to={"/report-details/" + record?.id} className="link-details">{record?.reportName}</Link>
    },
    {
      title: t("LABEL.REPORT.REPORT_TYPE"),
      dataIndex: "reportType",
      key: "reportType",
      sorter: (a: TableData, b: TableData) =>
        a.reportType.length - b.reportType.length,
      render: (value: undefined, record: Partial<any>) => <p>{record?.reportType}</p>
    },
    {
      title: t("LABEL.REPORT.DESCRIPTION"),
      dataIndex: "description",
      key: "description",
      sorter: (a: TableData, b: TableData) =>
        a.description.length - b.description.length,
      render: (value: undefined, record: Partial<any>) =>
        <p>
          {record?.description}
        </p>
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
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="page-title">
                        {t("LABEL.REPORT.REPORT")}
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
                          <div className="form-wrap icon-form">
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Search */}
                    {/* Filter */}
                    <div className="filter-section filter-flex">
                      <div className="sortby-list">
                      </div>
                      <div className="filter-list">
                        <ul>
                          <li>
                          </li>
                          <li>
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
                        total: totalLeads, // Total number of items
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
      </>
    </>
  );
};

export default ListReport;
