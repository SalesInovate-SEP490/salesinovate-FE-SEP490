import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import CollapseHeader from "../../../core/common/collapse-header";
import { deletePriceBook, filterPriceBook } from "../../../services/priceBook";

import { PriceBook } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreatePriceBook } from "./createPriceBook";
import { getPriceBook } from "../../../services/priceBook";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import Swal from "sweetalert2";
import { set } from 'lodash';
import { PriceBookFilter } from "./filter";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";

const route = all_routes;
const PriceBooks = () => {
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [showFilter, setShowFilter] = useState<any>(false);
  const [query, setQuery] = useState<any>(null);
  const { t } = useTranslation();

  const getListPriceBook = async (pageNo: number, pageSize: number, newQuery?: any) => {
    try {
      Swal.showLoading();
      const param = {
        pageNo: pageNo,
        pageSize: pageSize
      }
      const finalQuery = newQuery ? newQuery : query;
      filterPriceBook(param, finalQuery).then((data: any) => {
        Swal.close();
        if (data.code === 1) {
          setViewList(data.data.items);
          setTotalPriceBook(data.data.total);
          checkPermissionRole(route.priceBook)
        }
      }
      ).catch((error) => {
        Swal.close();
        console.log("error:", error);
      })
    } catch (error) {
      Swal.close();
      console.error("Error fetching Price Books:", error);
    }
  };

  useEffect(() => {
    getListPriceBook(pageNo, pageSize);
    checkPermissionRole(route.priceBook)
  }, [pageNo, pageSize]);


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const clickUpdate = (id: number) => {
    setShowUpdate(true);
    setCurrentId(id);
  }

  const columns = [
    {
      title: t("PRICE_BOOK.PRICE_BOOK_NAME"),
      dataIndex: `priceBookName`,
      key: "priceBookName",
      sorter: (a: any, b: any) => a.priceBookName.localeCompare(b.priceBookName),
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/price-book-details/" + record?.priceBookId} className="link-details">{record?.priceBookName}</Link>
      }
    },
    {
      title: t("PRICE_BOOK.IS_ACTIVE"),
      dataIndex: "isActive",
      key: "isActive",
      render: (value: undefined, record: Partial<any>) =>
        <div>
          <input
            type="checkbox"
            checked={record.isActive}
            disabled
          />
        </div>
    },
    {
      title: t("PRICE_BOOK.DESCRIPTION"),
      dataIndex: "description",
      key: "description",
      render: (value: any, record: Partial<any>) => (
        <div dangerouslySetInnerHTML={{ __html: record?.priceBookDescription ?? "" }} />
      )
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => clickUpdate(record?.priceBookId)} >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              onClick={() => { setCurrentId(record?.priceBookId) }}
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_price_book">
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const removePriceBook = () => {
    deletePriceBook(currentId)
      .then(response => {
        if (response.code === 1) {
          toast.success("Delete successfully");
          getListPriceBook(pageNo, pageSize);
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
        toast.error("Delete failed");
      })
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
                            <img className="icon-screen-image-circle" src="https://static.thenounproject.com/png/1410523-200.png" alt="Lead" />
                            <h4>{t("LABEL.PRICE_BOOK.PRICE_BOOK")}</h4>
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
                                    className="btn custom-btn-blue-black add-popup"
                                    onClick={() => getListPriceBook(pageNo, pageSize)}
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
                        </ul>
                      </div>
                    </div>
                    {/* /Filter */}
                    {/* Manage Users List */}
                    <div className="table-responsive custom-table">
                      <Table dataSource={viewList} columns={columns} pagination={{
                        current: pageNo,
                        pageSize,
                        total: totalPriceBook,
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
        <ToastContainer />
        <CreatePriceBook setShowPopup={setShowPopup} showPopup={showPopup} getList={getListPriceBook} />
        <CreatePriceBook setShowPopup={setShowUpdate} showPopup={showUpdate} getDetail={getListPriceBook} isEdit={true} id={currentId} />
        <DeleteModal deleteId={"delete_price_book"} handleDelete={removePriceBook} />
        <PriceBookFilter show={showFilter} setShow={setShowFilter} search={getListPriceBook} setQuery={setQuery} />
      </>
    </>
  );
};

export default PriceBooks;
