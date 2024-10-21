import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { getContractById } from '../../../services/contract'
import Swal from 'sweetalert2'
import { findPriceBookIdByOrderId, getListProductOrder, getListStatus, getOrderContractDetail, updateOrderContract } from '../../../services/order'
import DetailOrder from './DetailOrder'
import Table from "../../../core/common/dataTable/index";
import AddProductModal from './AddProductModal'
import { CreateOrder } from './createOrders'

const route = all_routes;

const OrderDetail = () => {
  const [order, setOrder] = useState<any>(null);
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [priceBookId, setPriceBookId] = useState<any>(null);
  const [listStatus, setListStatus] = useState<any>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [status, setStatus] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    getOrderDetail();
    getProductsOrder();
    getPriceBookId();
    getListStatusOrder();
  }, [id]);

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const getOrderDetail = () => {
    Swal.showLoading();
    getOrderContractDetail(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setOrder(response?.data);
          setStatus(response?.data?.orderStatus);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting contract detail: ", error)
      })
  }

  const getPriceBookId = () => {
    findPriceBookIdByOrderId(id)
      .then(response => {
        if (response.code === 1 && response.data) {
          setPriceBookId(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting price book id: ", error)
      })
  }

  const getProductsOrder = () => {
    const param = {
      OrderId: id
    }
    console.log(param)
    getListProductOrder(param)
      .then(response => {
        if (response.code === 1 && response.data) {
          setProducts(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting products order: ", error)
      })
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
  ]

  const changePipeStatus = () => {
    const currentStatus = listStatus.find((item: any) => item.orderStatusId === status);
    const currentStatusIndex = listStatus.findIndex((item: any) => item.orderStatusId === status);
    const nextStatus = listStatus[currentStatusIndex + 1];
    if (order && currentStatus && nextStatus) {
      const stageUpdate = order?.orderStatus === currentStatus.orderStatusId ? nextStatus : currentStatus;
      setStatus(stageUpdate.orderStatusId);
      const body = {
        orderStatus: stageUpdate.orderStatusId,
        BillingInformation: {
          street: "Hi"
        },
        ShippingInformation: {
          street: "Hello"
        }
      }
      updateOrderContract(id, body)
        .then(response => {
          if (response.code === 1) {
            toast.success("Status updated successfully.");
            getOrderDetail();
          } else {
            toast.error(response.message);
          }
        })
        .catch(error => {
          console.error("Error updating status: ", error)
        });
    }
  }

  const getListStatusOrder = () => {
    getListStatus()
      .then(response => {
        if (response.code === 1 && response.data) {
          setListStatus(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting list status: ", error)
      })
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
                    <h4 className="page-title">{t("ORDER.ORDER")}</h4>
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
                        <Link to={route.contracts}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("ORDER.ORDER")}
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
                      <img src='https://www.svgrepo.com/show/18783/contract.svg' alt="price-book" />
                    </span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {order?.orderNumber}
                    </h5>
                    <p>
                      {t("ORDER.ACCOUNT_NAME")}: {order?.accountId}
                    </p>
                    <p>
                      {t("ORDER.CONTRACT_NUMBER")}: {order?.contractNumber}
                    </p>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    {/* <i className="ti ti-lock" /> */}
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black edit-btn-permission"
                      onClick={() => setShowUpdate(!showUpdate)}
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
                      Delete
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Details */}
            <div className="col-xl-12">
              <div className="contact-tab-wrap">
                <h4>{t("ORDER.ORDER_STATUS")}</h4>
                <div className="pipeline-list">
                  <ul>
                    {listStatus.map((item: any, index: number) => {
                      const statusIndex = listStatus.findIndex((itemS: any) => itemS.orderStatusId === status);
                      const hoveredIndex = listStatus.findIndex((itemS: any) => itemS.orderStatusId === hoveredItem);
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => handleMouseEnter(item.orderStatusId)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link
                            to="#"
                            onClick={() => setStatus(item.orderStatusId)}
                            className={statusIndex > index ? 'bg-success' : statusIndex === index ? 'bg-info' : ''}
                          >
                            {hoveredIndex === index || statusIndex <= index ? item.orderStatusName : <i className='fas fa-check' />}
                          </Link>
                        </li>)
                    })
                    }
                  </ul>
                  <div className='row row-btn-mark-as'>
                    <button onClick={() => changePipeStatus()} className='btn btn-primary btn-mark-as'>
                      {listStatus[listStatus.length - 1]?.orderStatusId === status
                        ? "Selected Converted Status"
                        : (status === order?.orderStatus ?
                          <div><i className="fas fa-check"></i>&nbsp;Mark Status as Complete </div>
                          : 'Mark as current state')}
                    </button>
                  </div>
                </div>
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#related"
                    >
                      <i className="ti ti-alarm-minus" />
                      {t("CONTRACT.RELATED")}
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
                      {t("CONTRACT.DETAILS")}
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
                      <DetailOrder data={order} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="related">
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12'>
                        <ul>
                          <h4>{t("ORDER.PRODUCTS")} {products?.length > 3 ? `(3+)` : `(${products?.length})`}</h4>
                        </ul>
                        <ul>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black"
                            data-bs-toggle="modal"
                            data-bs-target="#add_products_order"
                          >
                            {t("ORDER.ADD_PRODUCT")}
                          </Link>
                        </ul>
                      </div>
                      <div className="table-responsive custom-table col-md-12">
                        {/* // display 3 items */}
                        <Table
                          dataSource={products?.slice(0, 3)}
                          columns={columns}
                          pagination={false}
                          footer={() => (
                            <div style={{ textAlign: 'center' }}>
                            </div>
                          )}
                        />
                      </div>
                      <div className='col-md-12 footer-border'>
                        <Link to={`/orders-details/${id}/products`}>{t("ACTION.VIEW_ALL")}</Link>
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
      <ToastContainer />
      <AddProductModal orderId={id} pbId={priceBookId} getList={getProductsOrder} />
      <CreateOrder setShowPopup={setShowUpdate} showPopup={showUpdate} getDetail={getOrderDetail} isEdit={true} id={id} />
    </>

  )
}

export default OrderDetail;
