import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { deletePriceBook, deleteProductFromPriceBook, filterPriceBook, getPriceBookById, getProductsByPriceBook } from '../../../services/priceBook'
import { initPriceBook } from './data'
import { CreatePriceBook } from './createPriceBook'
import DetailPriceBook from './DetailPriceBook'
import './priceBook.scss'
import AddProductModal from './AddProductModal';
import DeleteModal from '../../support/deleteModal';
import { UpdateProducts } from './updateProduct';
import { checkPermissionRole } from '../../../utils/authen';

const route = all_routes;

const PriceBookDetail = () => {
  const [priceBook, setPriceBook] = useState<any>(initPriceBook);
  const [products, setProducts] = useState<any>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState<any>({});
  const [showUpdate, setShowUpdate] = useState(false);
  const { t } = useTranslation();
  const nav = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    getPriceBookDetail();
    getProducts();
    checkPermissionRole(route.priceBookDetail);
  }, [id]);

  const getPriceBookDetail = () => {
    getPriceBookById(id)
      .then(response => {
        if (response.code === 1) {
          setPriceBook(response.data);
        }
      })
      .catch(error => { })
  }

  const getProducts = () => {
    // call api to get products by price book
    const param = {
      pageNo: 0,
      pageSize: 5,
      pricebookId: id
    }
    getProductsByPriceBook(param)
      .then(response => {
        checkPermissionRole(route.priceBookDetail);
        if (response.code === 1) {
          setProducts(response.data.items);
        }
      })
      .catch(error => {
        console.error("Error getting products by PriceBook: ", error);
      })
  }

  const removePriceBook = () => {
    // call api to delete opportunity
    deletePriceBook(id)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav(route.priceBook);
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, Price Book with admin to fix.");
        console.error("Error deleting PriceBook: ", error)
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
          customToast("success", "Product removed successfully.");
          getProducts();
          document.getElementById('close-btn-pfpb')?.click();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }

  const openEditModal = (productId: any) => {
    setShowUpdate(true);
    setProduct(products.find((item: any) => item.product.productId === productId));
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
        <div>{record?.listPrice?.toLocaleString() ? record?.listPrice?.toLocaleString() + " đ" : ""}</div>
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
            className="action-icon products-btn-permission"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item edit-btn-permission" to="#"
              onClick={() => openEditModal(record.product.productId)}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_product_from_pb"
              onClick={() => setProduct(products.find((item: any) => item.product.productId === record.product.productId))}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },
  ];

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
                  <div className="col-sm-4">
                    <h4 className="page-title">{t("LABEL.PRICE_BOOK.PRICE_BOOK_OVERVIEW")}</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {/* Leads User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.priceBook}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.PRICE_BOOK.PRICE_BOOK")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="contact-wrap">
                <div className="contact-profile">
                  <div className="avatar company-avatar">
                    <span className="text-icon">
                      <img src='https://cdn-icons-png.flaticon.com/512/4993/4993414.png' alt="price-book" />
                    </span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {priceBook?.priceBookName}
                    </h5>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black delete-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_price_book"
                    >
                      Delete
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Details */}
            <div className="col-xl-12">
              <div className="contact-tab-wrap">
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#activities"
                    >
                      <i className="ti ti-alarm-minus" />
                      Related
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#details"
                      className="active"
                    >
                      <i className="ti ti-alarm-minus" />
                      Details
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Tab Content */}
              <div className="contact-tab-view">
                <div className="tab-content pt-0">
                  {/* Details */}
                  <div className="tab-pane active show" id="details">
                    <div className="calls-activity">
                      <DetailPriceBook priceBook={priceBook} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="activities">
                    <div className="view-header">
                      <div className='col-md-12 space-between'>
                        <div className='row'>
                          <div className='col-md-3'>
                            <div className='avatar company-avatar'>
                              <img src='https://www.iconarchive.com/download/i103495/paomedia/small-n-flat/tag.1024.png' alt="price-book" />
                            </div>
                          </div>
                          <div className='col-md-9'>
                            <h4>{t("LABEL.PRICE_BOOK.PRICE_BOOK_ENTRIES")}</h4>
                          </div>
                        </div>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#add_products"
                          className='btn custom-btn-blue-black products-btn-permission'>Add Product</button>
                      </div>
                      <div className="table-responsive custom-table col-md-12">
                        <Table
                          dataSource={products}
                          columns={columns}
                          pagination={false}
                          footer={() => (
                            <div style={{ textAlign: 'center' }}>
                              <Link to={`/price-book-details/${id}/products`}>View All</Link>
                            </div>
                          )}
                        />
                        <div className="text-center" style={{ minHeight: '50px' }}>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Related */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <AddProductModal pricebookId={id} getList={getProducts} />
      <ToastContainer />
      <CreatePriceBook showPopup={showPopup} setShowPopup={setShowPopup} id={id} getDetail={getPriceBookDetail} isEdit={true} />
      <DeleteModal closeBtn={"close-btn"} deleteId={"delete_price_book"} handleDelete={removePriceBook} />
      <DeleteModal closeBtn={"close-btn-pfpb"} deleteId={"delete_product_from_pb"} handleDelete={removeProducts} />
      <UpdateProducts showPopup={showUpdate} setShowPopup={setShowUpdate} getDetail={getProducts} id={id} initProduct={product} />
    </>

  )
}

export default PriceBookDetail
