import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Product } from './type'
import { deleteProduct, getPriceBookByProduct, getProductById } from '../../../services/Product'
import Swal from 'sweetalert2'
import FixProductDetail from './fixProductDetail';
import { CreateProduct } from './createProduct'
import PriceBookByProduct from './PriceBookByProduct'
import ListProductFamily from './listProductFamily'
import './product.scss';
import AddProductFamilyModal from './addProductFamilyModal';
import { checkPermissionRole } from '../../../utils/authen'
import AddPriceBookModal from './addPriceBookModal'

const route = all_routes;

const ProductDetail = () => {
  const [product, setProduct] = useState<any>(null);
  const { t } = useTranslation();
  const nav = useNavigate();
  const [isAddProductFamilyModalVisible, setAddProductFamilyModalVisible] = useState(false);
  const [priceBook, setPriceBook] = useState<any>([]);
  const [showPopup, setShowPopup] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getProductDetail();
    getPriceBooks();
    checkPermissionRole(route.productDetail);
  }, [id]);

  const getPriceBooks = () => {
    // call api to get priceBooks by product
    const param = {
      pageNo: 0,
      pageSize: 5,
      productId: id
    }
    getPriceBookByProduct(param)
      .then(response => {
        if (response.code === 1) {
          setPriceBook(response.data.items);
        }
      })
      .catch(error => {
        console.error("Error getting price book by product: ", error);
      })
  }

  const getProductDetail = () => {
    Swal.showLoading();
    getProductById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setProduct(response.data);
          console.log("data:", response);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting product detail: ", error)
      })
  }

  const removeProduct = () => {
    deleteProduct(id)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav(route.product);
        } else {
          customToast("error", "The product can't be delete because there are records that refer to it. you can mark the product as inactive instead.");
        }
      })
      .catch(error => {
        customToast("error", "System error, product with admin to fix.");
        console.error("Error deleting product: ", error)
      })
  }

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
                    <h4 className="page-title">{t("LABEL.PRODUCT.PRODUCT_OVERVIEW")}</h4>
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
                        <Link to={route.product}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.PRODUCT.PRODUCT")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
                      <ul>
                        <li>
                          <Link to="/leads-details">
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to="/leads-details">
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
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
                      {product?.productName}
                    </h5>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowPopup(!showPopup)}
                    >
                      {t("ACTION.EDIT")}
                    </Link>
                  </span>
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black delete-btn-permission"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_account"
                    >
                      {t("ACTION.DELETE")}
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
                      data-bs-target="#related"
                    >
                      <i className="ti ti-alarm-minus" />
                      {t("PRODUCT.RELATED_PRICE_BOOK")}
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
                      {t("PRODUCT.DETAILS")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#productFamily"
                    >
                      <i className="ti ti-alarm-minus" />
                      {t("PRODUCT.LIST_PRODUCT_FAMILY")}
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
                      <FixProductDetail product={product} getProductDetail={getProductDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="related">
                    <PriceBookByProduct initProduct={product}/>
                  </div>
                  {/* /Related */}
                  {/* list Product Family */}
                  <div className="tab-pane fade" id="productFamily">
                    <div className="view-header">
                      <div className="table-responsive custom-table col-md-12">
                        <ListProductFamily />
                      </div>
                    </div>
                  </div>
                  {/* /list Product Family */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>

            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ToastContainer />
      <CreateProduct showPopup={showPopup} isEdit={true} setShowPopup={setShowPopup} id={id} getProductDetail={getProductDetail} />
      <AddProductFamilyModal
        isVisible={isAddProductFamilyModalVisible}
        onClose={() => setAddProductFamilyModalVisible(false)}
        onCreateSuccess={() => {
          setAddProductFamilyModalVisible(false);
          getProductDetail();
        }}
      />
      {/* Delete Lead Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_account"
        role="dialog"
      >
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
                <h3>{t("PRODUCT.DELETE_PRODUCT")}</h3>
                <p className="del-info">{t("MESSAGE.CONFIRM.DELETE")}</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                    {t("ACTION.CANCEL")}
                  </Link>
                  <Link to="#" onClick={removeProduct} className="btn btn-danger">
                    {t("ACTION.DELETE")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Lead Modal */}
    </>

  )
}

export default ProductDetail
