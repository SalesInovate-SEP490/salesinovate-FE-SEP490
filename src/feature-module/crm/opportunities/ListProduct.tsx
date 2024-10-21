import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import Swal from "sweetalert2";
import { addPriceBook, deleteProduct, getOpportunityDetail, getProductList } from "../../../services/opportunities";
import ChoosePriceBookModal from "./ChoosePriceBookModal";
import AddProductModal from "./AddProductModal";
import EditProductsModal from "./EditProductsModal";
import EditProductModal from "./EditProductModal";

const ProductsOpportunity = () => {
  const [opportunity, setOpportunity] = useState<any>({});
  const [priceBook, setPriceBook] = useState<any>({});
  const [product, setProduct] = useState<any>([]);
  const [viewList, setViewList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPriceBook, setTotalPriceBook] = useState(0);
  const [productId, setProductId] = useState(0);
  const { id } = useParams();
  const { t } = useTranslation();
  const route = all_routes;

  useEffect(() => {
    getProducts();
    getDetailOpportunity();
  }, [pageNo, pageSize]);

  const getDetailOpportunity = () => {
    getOpportunityDetail(id)
      .then((response: any) => {
        if (response.code === 1) {
          const newOpportuniry = response.data;
          setOpportunity(newOpportuniry);
        }
      })
      .catch((error: any) => {
      })
  }

  const getProducts = () => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
    }
    getProductList(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setViewList(response.data.products);
          setPriceBook(response.data.priceBook);
          setTotalPriceBook(response.data.total);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      });
  }

  const handleTableChange: TableProps<any>['onChange'] = (pagination) => {
    setPageNo(pagination.current || 1);
    setPageSize(pagination.pageSize || 15);
  };

  const handleChoosePriceBook = (priceBookId: any) => {
    if (!priceBookId) {
      toast.error("Please choose price book!");
      return;
    } else if (priceBookId == priceBook?.priceBookId) {
      document.getElementById('btn-close-cpb')?.click();
      return;
    }
    if (priceBook?.priceBookId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to change price book? All product will be removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result: any) => {
        if (result.isConfirmed) {
          choosePriceBook(priceBookId);
        }
      });
    } else {
      choosePriceBook(priceBookId);
    }
  }

  const choosePriceBook = (priceBookId: any) => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
      pricebookId: priceBookId
    }
    addPriceBook(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Choose price book success");
          document.getElementById('btn-close-cpb')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      })
  }

  const openEditModal = (id: any) => {
    setProductId(id);
    setProduct(viewList.find((item: any) => item.product.productId === id));
  }

  const columns = [
    {
      title: t("LABEL.PRODUCT.PRODUCT"),
      dataIndex: `product`,
      key: "product",
      render: (value: undefined, record: Partial<any>) => {
        return <Link to={"/product-details/" + record?.product?.productId}>{record?.product?.productName}</Link>
      }
    },
    {
      title: t("LABEL.PRODUCT.QUANTITY"),
      dataIndex: "quantity",
      key: "quantity",
      render: (value: undefined, record: Partial<any>) =>
        <span >
          {record?.quantity}
        </span>
    },
    {
      title: t("LABEL.PRODUCT.SALES_PRICE"),
      dataIndex: "sales_price",
      key: "sales_price",
      render: (value: any, record: Partial<any>) => (
        <div>{record?.sales_price ? record?.sales_price.toLocaleString() : ''}</div>
      )
    },
    {
      title: t("LABEL.PRODUCT.TOTAL_PRICE"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: any, record: Partial<any>) => (
        <div>{(record?.sales_price && record?.quantity) ? (record?.sales_price * record?.quantity).toLocaleString() : ''}</div>
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
            <Link
              className="dropdown-item edit-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_product"
              onClick={() => openEditModal(record?.product?.productId)}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_product"
              onClick={() => setProductId(record?.product?.productId)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div >
      ),
    },
  ];

  const removeProduct = () => {
    deleteProduct(id, productId)
      .then(response => {
        if (response.code === 1) {
          toast.success("Delete Success!");
          document.getElementById('close-btn-dp')?.click();
          getProducts();
        } else {
          toast.error("error", response.message);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
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
                                  {t("LABEL.PRODUCT.ADD_PRODUCTS")}
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
                                  {t("LABEL.PRODUCT.EDIT_PRODUCTS")}
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#choose_price_book_modal"
                                  className='btn custom-btn-blue-black'
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  {t("LABEL.PRODUCT.CHOOSE_PRICE_BOOK")}
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
                            <Link to={route.opportunities}>
                              {t("LABEL.OPPORTUNITIES.OPPORTUNITY")}
                              <span>&nbsp;{">"}</span>
                            </Link>
                          </li>
                          <li>
                            <Link to={`/opportunities-details/${id}`}>
                              {opportunity?.opportunityName}
                            </Link>
                          </li>
                        </ul>
                        <h5>{t("LABEL.PRODUCT.PRODUCTS")} {`(${priceBook?.priceBookName != undefined ? priceBook?.priceBookName : ''})`}</h5>
                      </div>
                      <div className="filter-list">
                        <ul>
                          <li>
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
        <DeleteModal deleteId={"delete_product"} handleDelete={removeProduct} closeBtn={"close-btn-dp"} />
        <ChoosePriceBookModal id={id} modalId={"choose_price_book_modal"} action={handleChoosePriceBook} pbId={priceBook?.priceBookId} priceBook={priceBook} />
        <AddProductModal id={id} getList={getProducts} />
        <EditProductsModal id={id} getList={getProducts} />
        <EditProductModal id={id} product={product} priceBook={priceBook} opportunity={opportunity} getList={getProducts} />
      </>
    </>
  );
};

export default ProductsOpportunity;
