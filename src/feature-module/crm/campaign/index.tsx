import React, { useState, useEffect } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Link, useLocation } from 'react-router-dom';
import { compaignData } from '../../../core/data/json/campaignData';
import { TableData } from '../../../core/data/interface';
import Table from '../../../core/common/dataTable/index';
import { useDispatch, useSelector } from 'react-redux';
import { setActivityTogglePopupTwo } from '../../../core/data/redux/commonSlice';
import { all_routes } from '../../router/all_routes';
import CollapseHeader from '../../../core/common/collapse-header';
import Select, { StylesConfig } from "react-select";

import { Campaign } from "./type"
import type { TableColumnGroupType, TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateCampaign } from "./createCampaign";
import { getCampaign, exportExcel, deleteCampaign } from "../../../services/campaign";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import DeleteModal from '../../support/deleteModal';
import { checkPermissionRole } from '../../../utils/authen';
import { convertTextToDate } from '../../../utils/commonUtil';

const CampaignList = () => {
  const route = all_routes;

  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCampaign, setTotalCampaign] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [id, setId] = useState(0);
  const { t } = useTranslation();

  const getListCampaign = async (pageNo: number, pageSize: number) => {
    Swal.showLoading();
    const params = {
      pageNo: pageNo,
      pageSize: pageSize
    }
    getCampaign(params)
      .then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data?.data?.items);
          setTotalCampaign(data?.data?.total);
          checkPermissionRole(route.campaign);
        }
      }
      ).catch((error) => {
        console.log("error:", error);
        Swal.close();
      })
  };

  useEffect(() => {
    getListCampaign(pageNo, pageSize);
  }, [pageNo, pageSize]);

  const handleTableChange: TableProps<Campaign>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const removeCampaign = () => {
    Swal.showLoading();
    const params = {
      id
    }
    deleteCampaign(params)
      .then((data: any) => {
        if (data.code === 1) {
          getListCampaign(pageNo, pageSize);
          toast.success("Delete Campaign Success");
        } else {
          toast.error("Delete Campaign Fail");
        }
      })
      .catch((error) => {
        console.log("error:", error);
        Swal.close();
      })
  }

  const columns = [
    {
      title: t("CAMPAIGN.CAMPAIGN_NAME"),
      dataIndex: "campaignName",
      key: "campaignName",
      sorter: (a: any, b: any) => a?.campaignName?.length - b?.campaignName?.length,
      render: (value: undefined, record: Partial<any>) => {
        console.log("record: ", record)
        return <Link to={"/campaign-details/" + record?.campaignId}>{record?.campaignName}</Link>
      }
    },
    {
      title: t("CAMPAIGN.STATUS"),
      dataIndex: "status",
      key: "status",
      sorter: (a: any, b: any) => a?.campaignStatus?.campaignStatusName?.length - b?.campaignStatus?.campaignStatusName?.length,
      render: (value: undefined, record: Partial<any>) => (
        <div>
          <span>{record?.campaignStatus?.campaignStatusId === 1 ? "" : record?.campaignStatus?.campaignStatusName}</span>
        </div>
      ),
    },
    {
      title: t("CAMPAIGN.iS_ACTIVE"),
      dataIndex: "isActive",
      key: "isActive",
      render: (value: undefined, record: Partial<Campaign>) =>
        <div>
          <span className={`badge badge-pill badge-status ${record.isActive == true ? 'bg-success' : 'bg-danger'}`}>
            {record.isActive == true ? t("CAMPAIGN.ACTIVE") : t("CAMPAIGN.INACTIVE")}
          </span>
        </div>
    },
    {
      title: t("CAMPAIGN.START_DATE"),
      dataIndex: "startDate",
      key: "startDate",
      // startDate is date type
      sorter: (a: any, b: any) => a?.startDate?.length - b?.startDate?.length,
      render: (value: undefined, record: Partial<Campaign>) =>
        <p>
          {convertTextToDate(record?.startDate)}
        </p>
    },
    {
      title: t("CAMPAIGN.END_DATE"),
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a: any, b: any) => a?.endDate?.length - b?.endDate?.length,
      render: (value: undefined, record: Partial<Campaign>) =>
        <p>
          {convertTextToDate(record?.endDate)}
        </p>
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (value: undefined, record: Partial<any>) => (
        <div className="dropdown table-action">
          <Link to="#" className="action-icon" data-bs-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate3d(-99.3333px, 35.3333px, 0px)' }} data-popper-placement="bottom-start">
            <Link
              className="dropdown-item edit-btn-permission"
              to="#"
              onClick={() => {
                setShowUpdate(!showUpdate);
                setId(record?.campaignId)
              }}
            >
              <i className="ti ti-edit text-blue"></i> {t("CAMPAIGN.EDIT")}
            </Link>
            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_campaign"
              onClick={() => setId(record.campaignId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("LABEL.CAMPAIGN.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },

  ];

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
                      Campaign<span className="count-title">{totalCampaign}</span>
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

                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn custom-btn-blue-black add-btn-permission"
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
                  {/* Campaign List */}
                  <div className="col-sm-12 table-responsive">
                    <Table dataSource={viewList} columns={columns} pagination={{
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* <CampaignModal /> */}
      <ToastContainer />
      <CreateCampaign setShowPopup={setShowPopup} showPopup={showPopup} getList={getListCampaign} />
      <CreateCampaign setShowPopup={setShowUpdate} showPopup={showUpdate} getList={getListCampaign} isEdit={true} id={id} />
      <DeleteModal deleteId="delete_campaign" closeBtn="close_delete_campaign" handleDelete={removeCampaign} />
    </>

  )
}

export default CampaignList
