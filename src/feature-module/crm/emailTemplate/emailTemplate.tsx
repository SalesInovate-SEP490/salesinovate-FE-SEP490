import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { TableData } from "../../../core/data/interface";
import CollapseHeader from "../../../core/common/collapse-header";
import { all_routes } from "../../router/all_routes";

import { EmailTemplate } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateEmailTemplate } from "./createEmailTemplate";
import { getListEmail } from "../../../services/emailTemplate";
import { ToastContainer } from "react-toastify";

const EmailTemplates = () => {
  const route = all_routes;
  const { t } = useTranslation();
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOpportunity, setTotalOpportunity] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const getEmails = async (pageNo: number, pageSize: number) => {
    try {
      const param = {
        currentPage: pageNo,
        pageSize: pageSize,
        userId: localStorage.getItem("userId") || 1,
      }
      getListEmail(param).then((data: any) => {
        if (data.code === 1) {
          setViewList(data?.data?.items);
          setTotalOpportunity(data?.data?.total * pageSize);
        }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    getEmails(pageNo, pageSize);
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<EmailTemplate>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const columns = [
    {
      title: t("LABEL.EMAIL_TEMPLATE.EMAIL_TEMPLATE_NUMBER"),
      dataIndex: "emailTemplateId",
      key: "emailTemplateId",
      sorter: (a: TableData, b: TableData) =>
        a.emailTemplateId - b.emailTemplateId,
      render: (value: undefined, record: Partial<EmailTemplate>) =>
        <Link to={"/email-template-details/" + record?.emailTemplateId} className="link-details">{record?.emailTemplateId}</Link>
    },
    {
      title: t("LABEL.EMAIL_TEMPLATE.SUBJECT"),
      dataIndex: "mailSubject",
      key: "mailSubject",
      sorter: (a: TableData, b: TableData) =>
        a.mailSubject.length - b.mailSubject.length,
      render: (value: undefined, record: Partial<EmailTemplate>) => <p>{record?.mailSubject}</p>
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
                            <img className="icon-screen-image-circle" src="https://banner2.cleanpng.com/20180526/eio/avq7ytjqj.webp" alt="Lead" />
                            <h4>{t("LABEL.EMAIL_TEMPLATE.EMAIL_TEMPLATE")}</h4>
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="export-dropdwon">
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
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black"
                                    onClick={() => getEmails(pageNo, pageSize)}
                                  >
                                    <i className="ti ti-square-rounded-plus" />
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
        {showPopup && (
          <CreateEmailTemplate
            setShowPopup={setShowPopup}
            showPopup={showPopup}
            getEmails={getEmails}
          />
        )}
        <ToastContainer />
      </>
    </>
  );
};

export default EmailTemplates;
