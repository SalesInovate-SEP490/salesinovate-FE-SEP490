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
import { findPriceBookIdByOrderId, getListProductOrder, getOrderContractDetail } from "../../../services/order";

const ProductsOrder = () => {
  const [priceBook, setPriceBook] = useState<any>({});
  const [order, setOrder] = useState<any>(null);
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
    getProductsOrder();
    getPriceBookDetail();
    getOrderDetail();
  }, [pageNo, pageSize]);

  const getPriceBookDetail = () => {
    findPriceBookIdByOrderId(id)
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

  const getProductsOrder = () => {
    const param = {
      OrderId: id
    }
    console.log(param)
    getListProductOrder(param)
      .then(response => {
        if (response.code === 1 && response.data) {
          setViewList(response.data.map((item: any) => {
            return {
              ...item,
              key: item.orderContractProductId
            }
          }));
          setTotalPriceBook(response.data.length);
        }
      })
      .catch(error => {
        console.error("Error getting products order: ", error)
      })
  }

  const getOrderDetail = () => {
    getOrderContractDetail(id)
      .then(response => {
        if (response.code === 1) {
          setOrder(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting contract detail: ", error)
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
          getProductsOrder();
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
      title: t("ORDER.PRODUCT_NAME"),
      dataIndex: "productName",
      key: "productName",
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: t("ORDER.PRODUCT_CODE"),
      dataIndex: "productCode",
      key: "productCode",
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: t("ORDER.QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: t("ORDER.UNIT_PRICE"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text: any) => <span>{text}</span>,
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

  const removeProduct = () => {

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
                        </div>
                        <div className="col-md-7 col-sm-8">
                          <div className="export-list text-sm-end">
                            <ul>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add_products_order"
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
                            <Link to={route.orders}>
                              {t("ORDER.ORDER")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/orders-details/${id}`}>
                              {order?.orderId}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("ORDER.ORDER_PRODUCTS")}</h5>
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
        <DeleteModal closeBtn={"close-btn-pfpb"} deleteId={"delete_product_from_pb"} handleDelete={removeProducts} />
        <AddProductModal pbId={priceBook?.priceBookId} getList={getProductsOrder} orderId={id} />
      </>
    </>
  );
};

export default ProductsOrder;
