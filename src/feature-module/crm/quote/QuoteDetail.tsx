import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import DetailQuote from './DetailQuote'
import Table from "../../../core/common/dataTable/index";
import AddProductModal from './AddProductModal'
import { deleteQuoteProduct, detailQuoteOpportunity, generateQuotePdf, getListQuoteProduct, getListQuoteStatus, getOpportunityInfoQuoteDTO, getPriceBookQuote, startSync, stopSync, updateQuote } from '../../../services/quote'
import { CreateQuotes } from './createQuotes'
import FilePreviewModal from './FilePreviewModal'
import DeleteModal from '../../support/deleteModal'
import { UpdateProducts } from './updateProduct'

const route = all_routes;

const QuoteDetail = () => {
  const [quote, setQuote] = useState<any>(null);
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [priceBook, setPriceBook] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState('https://example.com/your-file.pdf');
  const [showPreview, setShowPreview] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [productId, setProductId] = useState('');
  const [listStatus, setListStatus] = useState<any>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [status, setStatus] = useState<any>(null);
  const { id } = useParams();


  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    getQuoteDetail();
    getProductsQuote();
    getListStatus();
  }, [id]);

  const getQuoteDetail = () => {
    Swal.showLoading();
    detailQuoteOpportunity(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setQuote(response?.data);
          setStatus(response?.data?.quoteStatus?.quoteStatusId);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting contract detail: ", error)
      })
  }

  const getProductsQuote = () => {
    getListQuoteProduct(id)
      .then(response => {
        if (response.code === 1 && response.data) {
          setProducts(response?.data?.products);
        }
      })
      .catch(error => {
        console.error("Error getting products order: ", error)
      })
  }

  const openEditModal = (product: any) => {
    setProduct(product);
    setShowUpdate(true);
  }

  const getListStatus = () => {
    getListQuoteStatus()
      .then(response => {
        if (response.code === 1) {
          setListStatus(response.data);
        }
      })
      .catch(error => {
        console.error("Error getting list status: ", error)
      })
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

  const generatePDF = () => {
    generateQuotePdf(id)
      .then(response => {
        Swal.close();
        // Assuming you have the content type in the response headers
        const url = URL.createObjectURL(response);
        // You can determine the file type based on content type or file extension
        setFileUrl(url);
        setShowPreview(true);
      })
      .catch(error => {
        console.error("Error generating PDF: ", error)
      });
  }

  const startSyncQuote = () => {
    Swal.showLoading();
    startSync(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Sync started successfully.");
          getQuoteDetail();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error starting sync: ", error)
      });
  }

  const stopSyncQuote = () => {
    Swal.showLoading();
    stopSync(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Sync stopped successfully.");
          getQuoteDetail();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error stopping sync: ", error)
      });
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

  const changePipeStatus = () => {
    const currentStatus = listStatus.find((item: any) => item.quoteStatusId === status);
    const currentStatusIndex = listStatus.findIndex((item: any) => item.quoteStatusId === status);
    const nextStatus = listStatus[currentStatusIndex + 1];
    if (quote && currentStatus) {
      const stageUpdate = quote?.quoteStatus?.quoteStatusId === currentStatus.quoteStatusId ? nextStatus : currentStatus;
      setStatus(stageUpdate.quoteStatusId);
      const body = {
        quoteStatus: stageUpdate.quoteStatusId
      }
      updateQuote(id, body)
        .then(response => {
          if (response.code === 1) {
            toast.success("Status updated successfully.");
            getQuoteDetail();
          } else {
            toast.error(response.message);
          }
        })
        .catch(error => {
          console.error("Error updating status: ", error)
        });
    }
  }

  return (
    <>
      {showPreview && (
        <FilePreviewModal fileUrl={fileUrl} fileType={"application/pdf"} onClose={() => setShowPreview(false)} />
      )}
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">{t("QUOTE.QUOTE")}</h4>
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
                        <Link to={route.quotes}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("QUOTE.QUOTE")}
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
                      {quote?.quoteName}
                    </h5>
                    <p>
                      {t("QUOTE.QUOTE_NUMBER")}: {quote?.quoteNumber}
                    </p>
                    <p>
                      {t("QUOTE.EXPIRATION_DATE")}: {quote?.expirationDate ? new Date(quote?.expirationDate).toLocaleDateString() : ''}
                    </p>
                    <p>
                      {t("QUOTE.OPPORTUNITY_NAME")}: {quote?.opportunityName}
                    </p>
                    <p>
                      {t("QUOTE.CONTACT_NAME")}: {quote?.contactName}
                    </p>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black"
                      onClick={quote?.isSync ? stopSyncQuote : startSyncQuote}
                    >
                      {quote?.isSync ? t("ACTION.STOP_SYNC") : t("ACTION.START_SYNC")}
                    </Link>
                  </span>
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
                  {/* Export PDF */}
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black"
                      onClick={generatePDF}
                    >
                      {t("ACTION.EXPORT_PDF")}
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Details */}
            <div className="col-xl-12">
              <div className="contact-tab-wrap">
                <h4>{t("QUOTE.QUOTE_STATUS")}</h4>
                <div className="pipeline-list">
                  <ul>
                    {listStatus.map((item: any, index: number) => {
                      const statusIndex = listStatus.findIndex((itemS: any) => itemS.quoteStatusId === status);
                      const hoveredIndex = listStatus.findIndex((itemS: any) => itemS.quoteStatusId === hoveredItem);
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => handleMouseEnter(item.quoteStatusId)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link
                            to="#"
                            onClick={() => setStatus(item.quoteStatusId)}
                            className={statusIndex > index ? 'bg-success' : statusIndex === index ? 'bg-info' : ''}
                          >
                            {hoveredIndex === index || statusIndex <= index ? item.quoteStatusName : <i className='fas fa-check' />}
                          </Link>
                        </li>)
                    })
                    }
                  </ul>
                  <div className='row row-btn-mark-as'>
                    <button onClick={() => changePipeStatus()} className='btn btn-primary btn-mark-as'>
                      {listStatus[listStatus.length - 1]?.quoteStatusId === status
                        ? "Selected Converted Status"
                        : (status === quote?.quoteStatus?.quoteStatusId ?
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
                      <DetailQuote data={quote} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="related">
                    <div className="view-header border-beautiful">
                      <div className='space-between col-md-12'>
                        <ul>
                          <h4>{t("QUOTE.QUOTE_LINE_ITEMS")} {products?.length > 3 ? `(3+)` : `(${products?.length})`}</h4>
                        </ul>
                        <ul>
                          <Link
                            to="#"
                            className="btn custom-btn-blue-black"
                            data-bs-toggle="modal"
                            data-bs-target="#add_products_quote"
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
                        <Link to={`/quotes-details/${id}/products`}>{t("ACTION.VIEW_ALL")}</Link>
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
      <AddProductModal quoteId={id} pbId={priceBook?.priceBookId} getList={getProductsQuote} opportunityId={quote?.opportunityId} />
      <CreateQuotes id={id} showPopup={showPopup} setShowPopup={setShowPopup} getDetail={getQuoteDetail} isEdit={true} />
      <DeleteModal deleteId="delete_quote_product" closeBtn="close-btn-dqp" handleDelete={removeProduct} />
      <UpdateProducts showPopup={showUpdate} setShowPopup={setShowUpdate} getDetail={getProductsQuote} id={id} initProduct={product} />
    </>

  )
}

export default QuoteDetail;
