import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteProductFromPriceBook, getPriceBookById, getProductsByPriceBook } from "../../../services/priceBook";

import { PriceBook } from "./type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import AddProductModal from "./AddProductModal";
import { UpdateProducts } from "./updateProduct";
import Swal from "sweetalert2";

const ProductsPriceBook = () => {
  const [priceBook, setPriceBook] = useState<any>({});
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState<any>({});
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getProducts();
    getPriceBookDetail();
  }, [pageNo, pageSize]);

  const getPriceBookDetail = () => {
    getPriceBookById(id)
      .then(response => {
        if (response.code === 1) {
          setPriceBook(response.data);
        }
      })
      .catch(error => { })
  }


  const handleTableChange: TableProps<PriceBook>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getProducts = () => {
    // call api to get products by price book
    const param = {
      pageNo: pageNo - 1,
      pageSize,
      pricebookId: id
    }
    Swal.showLoading();
    getProductsByPriceBook(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setViewList(response.data.items);
          setTotalPriceBook(response.data.total);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting products by PriceBook: ", error);
      })
  }

  const removeProducts = () => {
    const param = {
      pricebookId: id,
      productId: product.product.productId
    }
    deleteProductFromPriceBook(param)
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getProducts();
          document.getElementById('close-btn-pfpb')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        toast.error("System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const openEditModal = (productId: any) => {
    setShowPopup(true);
    setProduct(viewList.find((item: any) => item.product.productId === productId));
  }

  const columns = [
    {
      title: t("LABEL.PRODUCT.PRODUCT_NAME"),
      dataIndex: `productName`,
      key: "productName",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/product-details/" + record?.productId}>{record?.product?.productName}</Link>
      }
    },
    {
      title: t("LABEL.PRODUCT.PRODUCT_CODE"),
      dataIndex: "productCode",
      key: "productCode",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.product?.productCode}
        </span>
    },
    {
      title: t("LABEL.PRODUCT.LIST_PRICE"),
      dataIndex: "listPrice",
      key: "listPrice",
      render: (value: any, record: Partial<any>) => (
        <div>{record?.listPrice}</div>
      )
    },
    {
      title: t("LABEL.PRODUCT.ACTIVE"),
      dataIndex: "active",
      key: "active",
      render: (value: any, record: Partial<any>) => (
        <input type='checkbox' className='form-check-input' checked={record?.product?.isActive} />
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
            <Link className="dropdown-item edit-btn-permission" to="#"
              onClick={() => openEditModal(record.product.productId)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_product_from_pb"
              onClick={() => setProduct(viewList.find((item: any) => item.product.productId === record.product.productId))}
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
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_products"
                                  className='btn custom-btn-blue-black'
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("ACTION.ADD")}
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
                        <ul className="contact-breadcrumb" style={{ padding: 0, margin: 0, height: '20px' }}>
                          <li>
                            <Link to={route.priceBook}>
                              {t("LABEL.PRICE_BOOK.PRICE_BOOK")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/price-book-details/${id}`}>
                              {priceBook?.priceBookName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("LABEL.PRICE_BOOK.PRICE_BOOK_ENTRIES")}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          {/* <li>
                            <div className="form-sorts dropdown">
                              <Link
                                to="#"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="false"
                              >
                                <i className="ti ti-filter-share" />
                                Filter
                              </Link>
                            </div>
                          </li>
                          <li>
                            <div className="view-icons">
                              <Link to="#" className="active">
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to="#">
                                <i className="ti ti-grid-dots" />
                              </Link>
                            </div>
                          </li> */}
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
        <DeleteModal closeBtn={"close-btn-pfpb"} deleteId={"delete_product_from_pb"} handleDelete={removeProducts} />
        <AddProductModal pricebookId={id} getList={getProducts} />
        <UpdateProducts showPopup={showPopup} setShowPopup={setShowPopup} getDetail={getProducts} id={id} initProduct={product}/>
      </>
    </>
  );
};

export default ProductsPriceBook;
