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
import Swal from "sweetalert2";
import { findPriceBookIdByOrderId, getListProductOrder, getOrderContractDetail } from "../../../services/order";
import { deleteQuoteProduct, detailQuoteOpportunity, getListQuoteProduct, getPriceBookQuote } from "../../../services/quote";
import EditProductModal from "./EditProductModal";
import { UpdateProducts } from "./updateProduct";
import EditProductsModal from "./EditProductsModal";

const ProductsQuote = () => {
  const [priceBook, setPriceBook] = useState<any>({});
  const [quote, setQuote] = useState<any>(null);
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [productId, setProductId] = useState('');
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getProductsQuote();
    getPriceBookDetail();
    getQuoteDetail();
  }, [pageNo, pageSize]);

  const getPriceBookDetail = () => {
    getPriceBookQuote(id)
      .then(response => {
        if (response.code === 1) {
          setPriceBook(response.data);
        }
      })
      .catch(error => { })
  }


  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const getProductsQuote = () => {
    getListQuoteProduct(id)
      .then(response => {
        if (response.code === 1 && response.data) {
          setViewList(response?.data?.products?.map((item: any) => {
            return {
              ...item,
              key: item?.opportunityProductId
            }
          }));
          setTotalPriceBook(response.data.length);
        }
      })
      .catch(error => {
        console.error("Error getting products order: ", error)
      })
  }

  const getQuoteDetail = () => {
    detailQuoteOpportunity(id)
      .then(response => {
        if (response.code === 1) {
          setQuote(response?.data);
        }
      })
      .catch(error => {
        console.error("Error getting contract detail: ", error)
      })
  }

  const removeProducts = () => {
    deleteQuoteProduct(product.quoteProductId)
      .then(response => {
        if (response.code === 1) {
          toast.success("Product removed successfully.");
          getProductsQuote();
          document.getElementById('close-btn-dpfq')?.click();
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
    setShowUpdate(true);
    setProduct(productId);
  }

  const removeProduct = () => {
    const param = {
      opportunityProductId: productId,
      quoteId: id
    }
    Swal.showLoading();
    deleteQuoteProduct(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Product deleted successfully.");
          document.getElementById('close-btn-dqp')?.click();
          getProductsQuote();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error deleting product: ", error)
      });
  }

  const columns = [
    {
      title: t("ORDER.PRODUCT_NAME"),
      dataIndex: "productName",
      key: "productName",
      render: (text: any, record: any) =>
        <span>{record?.product?.productName}</span>,
    },
    {
      title: t("ORDER.PRODUCT_CODE"),
      dataIndex: "productCode",
      key: "productCode",
      render: (text: any, record: any) =>
        <span>{record?.product?.productCode}</span>,
    },
    {
      title: t("ORDER.QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any, record: any) =>
        <span>{record?.quantity}</span>,
    },
    {
      title: t("ORDER.UNIT_PRICE"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text: any, record: any) =>
        <span>{record?.sales_price}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value: any, record: Partial<any>) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon products-btn-permission"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item edit-btn-permission" to="#"
              onClick={() => openEditModal(record)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_quote_product"
              onClick={() => setProductId(record?.opportunityProductId)}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },
  ]

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
                                  data-bs-target="#add_products_quote"
                                  className='btn custom-btn-blue-black'
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("ACTION.ADD")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#edit_products"
                                  className='btn custom-btn-blue-black'
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("ACTION.EDIT")}
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
                            <Link to={route.quotes}>
                              {t("QUOTE.QUOTE")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/quotes-details/${id}`}>
                              {quote?.quoteName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("QUOTE.QUOTE_LINE_ITEMS")}</h5>
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
        <DeleteModal closeBtn={"close-btn-dpfq"} deleteId={"delete_product_from_quote"} handleDelete={removeProducts} />
        <AddProductModal pbId={priceBook?.priceBookId} getList={getProductsQuote} quoteId={id} opportunityId={quote?.opportunityId} />
        <DeleteModal deleteId="delete_quote_product" closeBtn="close-btn-dqp" handleDelete={removeProduct} />
        <UpdateProducts showPopup={showUpdate} setShowPopup={setShowUpdate} getDetail={getProductsQuote} id={id} initProduct={product} />
        <EditProductsModal id={id} getList={getProductsQuote} />
      </>
    </>
  );
};

export default ProductsQuote;
