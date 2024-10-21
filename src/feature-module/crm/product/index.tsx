import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import CollapseHeader from "../../../core/common/collapse-header";
import { all_routes } from "../../router/all_routes";
import { deleteProduct, exportExcel, filterProduct, getTotalProduct } from "../../../services/Product";

import { Product } from "./type"
import type { TableColumnGroupType, TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { CreateProduct } from "./createProduct";
import Swal from "sweetalert2";
import { checkPermissionRole } from "../../../utils/authen";
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { ProductFilter } from "./filter";

const Products = () => {
  const route = all_routes;
  const { t } = useTranslation();
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProduct, setTotalProduct] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productId, setProductId] = useState<any>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [query, setQuery] = useState<any>(null);

  const getListProduct = async (pageNo: number, pageSize: number, newQuery?: any) => {
    try {
      Swal.showLoading();
      const param = {
        pageNo: pageNo - 1,
        pageSize: pageSize
      }
      const finalQuery = newQuery ? newQuery : query;
      filterProduct(param, finalQuery).then((data: any) => {
        Swal.close();
        console.log("data contact:", data)
        if (data.code === 1) {
          setViewList(data?.data?.items?.map((item: any) => {
            return {
              ...item,
              key: item.productId
            }
          }));
          setTotalProduct(data.total * pageSize);
          checkPermissionRole(route.product)
        }
      }
      ).catch((error) => { console.log("error:", error) })
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  useEffect(() => {
    getListProduct(pageNo, pageSize);
    checkPermissionRole(route.product)
  }, [pageNo, pageSize]);

  useEffect(() => {
    checkPermissionRole(route.contacts);
  }, [])

  const handleTableChange: TableProps<Product>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const triggerDeleteProduct = (id: any) => {
    setProductId(id);
    setShowDeleteModal(true);
  };

  const removeProduct = () => {
    deleteProduct(productId)
      .then((response) => {
        setShowDeleteModal(false);
        if (response.code === 1) {
          customToast("success", response.message);
          getListProduct(pageNo, pageSize);
        } else {
          customToast("error", response.message);
        }
      })
      .catch((error) => {
        customToast("error", "System error, contact admin to fix.");
        console.error("Error deleting product: ", error);
      });
  };

  const customToast = (type: string, message: string) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
    }
  }

  const togglePopup = (id: any) => {
    setShowUpdate(true);
    setProductId(id);
  }

  const columns = [
    {
      title: t("PRODUCT.PRODUCT_NAME"),
      dataIndex: `productName`,
      key: "productName",
      sorter: (a: Product, b: Product) =>
        a?.productName?.length - b?.productName?.length,
      render: (value: undefined, record: Partial<Product>) => {
        console.log("record : ", record)
        return <Link to={"/product-details/" + record?.productId} className="link-details">{record?.productName}</Link>
      }
    },
    {
      title: t("PRODUCT.PRODUCT_CODE"),
      dataIndex: "productCode",
      key: "productCode",
      sorter: (a: Product, b: Product) =>
        a?.productCode?.length - b?.productCode?.length,
      render: (value: undefined, record: Partial<Product>) =>
        <p>
          {record?.productCode}
        </p>
    },
    {
      title: t("PRODUCT.IS_ACTIVE"),
      dataIndex: "isActive",
      key: "isActive",
      render: (value: undefined, record: Partial<Product>) =>
        <div>
          <span className={`badge badge-pill badge-status ${record?.isActive == 1 ? 'bg-success' : 'bg-danger'}`}>
            {record?.isActive == 1 ? t("PRODUCT.ACTIVE") : t("PRODUCT.INACTIVE")}
          </span>
        </div>
    },
    {
      title: t("PRODUCT.PRODUCT_FAMILY"),
      dataIndex: "productFamily",
      key: "productFamily",
      sorter: (a: any, b: any) => a?.productFamily?.productFamilyName?.length - b?.productFamily?.productFamilyName?.length,
      render: (value: undefined, record: Partial<Product>) =>
        <p>
          {record?.productFamily?.productFamilyName}
        </p>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Product) => (
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
            <Link className="dropdown-item edit-btn-permission" to="#" onClick={() => togglePopup(record?.productId)} >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link className="dropdown-item delete-btn-permission" to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_product"
              onClick={() => triggerDeleteProduct(record.productId)}
            >
              <i className="ti ti-trash text-danger"></i>
              {t("ACTION.DELETE")}
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
                {/* Page Header */}
                {/* <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <h4 className="page-title">
                        {t("LABEL.PRODUCT.PRODUCT")}
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
                            <img className="icon-screen-image-circle" src="https://www.svgrepo.com/show/36558/sell-product.svg" alt="Lead" />
                            <h4>{t("LABEL.PRODUCT.PRODUCT")}</h4>
                          </div>
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <div className="form-sorts dropdown">
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
                                <div className="form-sorts dropdown">
                                  <Link
                                    to="#"
                                    className="btn custom-btn-blue-black"
                                    onClick={() => getListProduct(pageNo, pageSize)}
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
                    <div className="filter-section filter-flex d-flex justify-content-end ">
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
                              <Link to="/#" className="active">
                                <i className="ti ti-list-tree" />
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
                        total: totalProduct,
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
        {/* /remove Product */}
        <div
          className={`modal custom-modal fade ${showDeleteModal ? "show" : ""}`}
          id="delete_product"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 m-0 justify-content-end">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <div className="success-message text-center">
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>{t("PRODUCT.REMOVE_PRODUCT")}</h3>
                  <p className="del-info">
                    {t("PRODUCT.CONFIRM_REMOVE_PRODUCT")}
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      {t("PRODUCT.CANCEL")}
                    </Link>
                    <Link to={route.product} className="btn btn-danger" onClick={removeProduct}>
                      {t("PRODUCT.AGREE_REMOVE_PRODUCT")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <CreateProduct setShowPopup={setShowPopup} showPopup={showPopup} getProduct={getListProduct} />
        <CreateProduct showPopup={showUpdate} isEdit={true} setShowPopup={setShowUpdate} id={productId} getProductDetail={() => { getListProduct(pageNo, pageSize) }} />
        <ProductFilter show={showFilter} setShow={setShowFilter} search={getListProduct} setQuery={setQuery} />

      </>
    </>
  );
};

export default Products;
