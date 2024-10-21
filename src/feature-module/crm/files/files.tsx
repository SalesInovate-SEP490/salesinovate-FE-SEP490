import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select from "react-select";
import "bootstrap-daterangepicker/daterangepicker.css";
import CollapseHeader from "../../../core/common/collapse-header";

import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { getFileById, getListFile, removeFile, shareFileToOther, uploadFile } from "../../../services/files.service";
import { ToastContainer, toast } from "react-toastify";
import FilePreviewModal from "./FilePreviewModal";
import Swal from "sweetalert2";
import { convertTextToDateTime } from "../../../utils/commonUtil";

const users = [
  { value: "1", label: "User 1" },
  { value: "2", label: "User 2" },
]
const ListFile = () => {
  const [currentId, setCurrentId] = useState(0);
  const [listUser, setListUser] = useState([]);
  const { t } = useTranslation();

  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOpportunity, setTotalOpportunity] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fileUrl, setFileUrl] = useState('https://example.com/your-file.pdf'); // Replace with your file URL
  const [fileType, setFileType] = useState('application/pdf'); // Replace with your file type

  const closePreview = () => setShowPreview(false);

  const handleButtonClick = () => {
    if (fileInputRef?.current)
      fileInputRef?.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('userId', "1");
      formData.append('file', file);
      uploadFile(formData)
        .then((response: any) => {
          if (response.code === 1) {
            getListFiles(pageNo, pageSize);
          }
        })
        .catch((error: any) => { console.log("error:", error) })
    }
  };


  const getListFiles = async (pageNo: number, pageSize: number) => {
    try {
      Swal.showLoading();
      const param = {
        currentPage: pageNo,
        perPage: pageSize,
        userId: 1
      }
      getListFile(param).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data.data.items);
          setTotalOpportunity(data.data.total * pageSize);
        }
      }
      ).catch((error: any) => { console.log("error:", error) })
    } catch (error) {
      Swal.close();
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    getListFiles(pageNo, pageSize);
  }, [pageNo, pageSize]);

  const shareFile = () => {
    const listUserId = listUser.map((item: any) => item.value);
    console.log("list user id: ", listUserId);
    const body = {
      user_id: 1,
      fileId: currentId
    }
    shareFileToOther(body)
      .then((response: any) => {
        console.log(response);
        if (response.code === 1) {
          document.getElementById("close-btn-sf")?.click();
          toast.success("Share file successfully!");
        } else {
          toast.error(response.message);
        }
      })
      .catch((error: any) => {
        toast.error("Share file failed!");
      })
  }

  const deleteFile = () => {
    removeFile(currentId)
      .then(response => {
        if (response.code === 1) {
          document.getElementById("close-btn-df")?.click();
          toast.success("Delete file successfully!");
          getListFiles(pageNo, pageSize);
        } else {
          toast.error(response.message);
        }
      })
      .catch((error: any) => {
        console.log("error:", error)
        toast.error("Delete file failed!");
      })
  }

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const getFileDetail = (id: any) => {
    Swal.showLoading();
    getFileById(id)
      .then((response: Blob) => {
        Swal.close();
        // Assuming you have the content type in the response headers
        const contentType = response.type;
        const url = URL.createObjectURL(response);

        // You can determine the file type based on content type or file extension
        setFileUrl(url);
        setFileType(contentType);
        setShowPreview(true);
      })
      .catch((error: any) => {
        Swal.close();
        console.log("error: ", error);
      })
  }

  const downloadFile = (id: any, fileName: string) => {
    Swal.showLoading();
    getFileById(id)
      .then((response: Blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        // download
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        Swal.close();
        console.log("error: ", error);
      })
  }

  const columns = [
    {
      title: t("LABEL.FILES.TITLE"),
      dataIndex: "fileName",
      key: "fileName",
      sorter: (a: any, b: any) =>
        a.accountName.length - b.accountName.length,
      render: (value: undefined, record: Partial<any>) =>
        <Link className="link-details" to="#" onClick={() => getFileDetail(record.id)}>{record?.fileName}</Link>
    },
    {
      title: t("LABEL.FILES.OWNER"),
      dataIndex: "owner",
      key: "owner",
      sorter: (a: any, b: any) =>
        a.owner.length - b.owner.length,
      render: (value: undefined, record: Partial<any>) =>
        <p>
          Nguyễn Văn A
        </p>
    },
    {
      title: t("LABEL.FILES.CREATED_DATE"),
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value: undefined, record: Partial<any>) =>
        <p>{convertTextToDateTime(record?.createdDate)}</p>
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
            {/* <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#share_file" onClick={() => setCurrentId(record.id)}>
              <i className="ti ti-share text-blue" /> Share File
            </Link>
            <Link className="dropdown-item" to="#" data-bs-toggle="modal" data-bs-target="#un_share_file" onClick={() => setCurrentId(record.id)}>
              <i className="ti ti-share text-blue" /> Unshare File
            </Link> */}
            <Link className="dropdown-item" to="#" onClick={() => downloadFile(record.id, record?.fileName)}>
              <i className="ti ti-download text-blue" /> Download
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => setCurrentId(record.id)}
              data-bs-toggle="modal"
              data-bs-target="#delete_file"
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
      {showPreview && (
        <FilePreviewModal fileUrl={fileUrl} fileType={fileType} onClose={closePreview} />
      )}
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
                        {t("LABEL.FILES.FILE")}
                      </h4>
                    </div>
                    <div className="col-4 text-end">
                      <div className="head-icons">
                        <CollapseHeader />
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* /Page Header */}
                <div className="card main-card">
                  <div className="card-body">
                    {/* Search */}
                    <div className="search-section">
                      <div className="row">
                        <div className="col-md-5 col-sm-4">
                          <div className="icon-text-wrapper">
                            <img className="icon-screen-image-circle" src="https://uxwing.com/wp-content/themes/uxwing/download/file-and-folder-type/page-file-icon.png" alt="Lead" />
                            <h4>{t("LABEL.FILES.FILE")}</h4>
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="export-dropdwon">

                                  <button
                                    className="btn custom-btn-blue-black add-btn-permission"
                                    onClick={handleButtonClick}
                                  >
                                    <i className="ti ti-square-rounded-plus" />
                                    {t("ACTION.UPLOAD")}
                                  </button>
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="export-dropdwon">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black"
                                    onClick={() => getListFiles(pageNo, pageSize)}
                                  >
                                    <i className="ti ti-refresh-dot" />
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
        <div className="modal custom-modal fade" id="delete_file" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>{t("LABEL.FILES.DELETE_FILE")}</h3>
                  <p className="del-info">
                    {t("LABEL.FILES.DELETE_FILE_CONFIRM")}
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link id="close-btn-df" to="#" className="btn btn-light" data-bs-dismiss="modal">
                      {t("ACTION.CANCEL")}
                    </Link>
                    <Link to="#" onClick={deleteFile} className="btn btn-danger">
                      {t("ACTION.OK")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal custom-modal fade" id="share_file" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <h3>{t("LABEL.FILES.SHARE_FILE")}</h3>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("LABEL.FILES.SHARE_TO")} <span className="text-danger"> *</span>
                      </label>
                      <Select
                        className="select"
                        name='subject'
                        options={users}
                        isMulti={true}
                        onChange={(e: any) => { setListUser(e) }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 text-center modal-btn">
                    <button id="close-btn-sf" onClick={() => setListUser([])} className="btn btn-light" data-bs-dismiss="modal">
                      {t("ACTION.CANCEL")}
                    </button>
                    <Link to="#" className="btn btn-danger" onClick={() => shareFile()}>
                      {t("ACTION.OK")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    </>
  );
};

export default ListFile;
