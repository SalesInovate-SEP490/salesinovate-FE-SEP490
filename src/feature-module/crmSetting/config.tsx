import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import "bootstrap-daterangepicker/daterangepicker.css";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { all_routes } from "../router/all_routes";
import { checkPermissionRole } from "../../utils/authen";
import LeadsDetail from "../crm/leads/LeadsDetail";
import CommonActivity from "../crm/activity";
import LeadConfig from "./LeadConfig";
import OpportunityConfig from "./OppConfig";

const Configs = () => {
    const route = all_routes;
    const { t } = useTranslation();
    const [viewList, setViewList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalContract, setTotalContract] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [contractId, setContractId] = useState(null);

    const getListContracts = async (currentPage: number, pageSize: number) => {
        const param = {
            currentPage: currentPage,
            perPage: pageSize
        }

    };

    useEffect(() => {
        getListContracts(currentPage, pageSize);
    }, [currentPage, pageSize]);

    useEffect(() => {
        checkPermissionRole(route.contracts);
    }, [])

    const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
        setCurrentPage(pagination.current || 1);
        setPageSize(pagination.pageSize || 15);
    };

    const triggerDeleteContract = (id: any) => {
        setContractId(id);
        setShowDeleteModal(true);
    };

    const removeContract = () => {

    };
    const columns = [
        {
            title: t("CONTRACT.CONTRACT_NUMBER"),
            dataIndex: `contractNumber`,
            key: "contractNumber",
            render: (value: undefined, record: Partial<any>) => {
                console.log("record : ", record)
                return <Link to={"/contract-details/" + record?.contractId} className="link-details">{record?.contractId}</Link>
            }
        },
        {
            title: t("CONTRACT.ACCOUNT_NAME"),
            dataIndex: "accountName",
            key: "accountName",
            render: (value: undefined, record: Partial<any>) =>
                <p>
                    {record?.accountId}
                </p>
        },
        {
            title: t("CONTRACT.CONTRACT_START_DATE"),
            dataIndex: "startDate",
            key: "startDate",
            render: (value: undefined, record: Partial<any>) =>
                <p>
                    {record?.contractStartDate ? formatDate(record?.contractStartDate) : ""}
                </p>
        },
        {
            title: t("CONTRACT.CONTRACT_END_DATE"),
            dataIndex: "endDate",
            key: "endDate",
            render: (value: undefined, record: Partial<any>) =>
                <p>
                    {record?.ownerExpirationNotice ? formatDate(record?.ownerExpirationNotice) : ""}
                </p>
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_: any, record: any) => (
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
                            onClick={() => {
                                setShowEditPopup(true);
                                setContractId(record?.contractId);
                            }}
                        >
                            <i className="ti ti-edit text-blue" />
                            {t("ACTION.EDIT")}
                        </Link>

                        <Link className="dropdown-item" to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_contract"
                            onClick={() => triggerDeleteContract(record?.contractId)}
                        >
                            <i className="ti ti-trash text-danger"></i>
                            {t("ACTION.DELETE")}
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    const formatDate = (date: string) => {
        return date.replace("T", " ").replace(".000+00:00", "");
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
                                        <div className="search-section">
                                            <div className="row">
                                                <div className="col-md-5 col-sm-4">
                                                    {/* <div className="icon-text-wrapper">
                                                        <img className="icon-screen-image-circle" src="/assets/img/icons/setting.png" alt="settings" />
                                                        <h4>{t("CONFIG.CONFIG")}</h4>
                                                    </div> */}
                                                    <div>
                                                        <ul className="contact-nav nav">
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#lead_config"
                                                                    className="active"
                                                                >
                                                                    {t("CONFIG.LEAD_CONFIG")}
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#opportunity_config"
                                                                >
                                                                    {t("CONFIG.OPPORTUNITY_CONFIG")}
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Tab Content */}
                                        <div className="contact-tab-view">
                                            <div className="tab-content pt-0">
                                                {/* Detail */}
                                                <div className="tab-pane active show" id="lead_config">
                                                    <LeadConfig />
                                                </div>
                                                {/* /Detail */}
                                                {/* Activities */}
                                                <div className="tab-pane fade" id="opportunity_config">
                                                    <OpportunityConfig />
                                                </div>
                                                {/* /Activities */}
                                            </div>
                                        </div>
                                        {/* /Tab Content */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Page Wrapper */}
                <ToastContainer />
            </>
        </>
    );
};

export default Configs;
