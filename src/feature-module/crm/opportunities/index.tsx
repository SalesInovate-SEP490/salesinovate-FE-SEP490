import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import './opportunities.css'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { addPriceBook, deleteContactRole, deleteOpportunity, deleteProduct, getCampaignInfluence, getListContactRole, getListStage, getOpportunityDetail, getProductList, patchOpportunity, updateOpportunity } from '../../../services/opportunities'
import Swal from 'sweetalert2'
import { CreateOpportunity } from './createOpportunity'
import DetailOpportunity from './OpportunityDetail'
import { checkPermissionRole } from '../../../utils/authen'
import ChoosePriceBookModal from './ChoosePriceBookModal'
import DeleteModal from '../../support/deleteModal'
import AddProductModal from './AddProductModal'
import EditProductsModal from './EditProductsModal'
import EditProductModal from './EditProductModal'
import AddContactRole from './AddContactRole'
import EditContactRole from './EditContactRole'
import EditOneContactRole from './EditOneContactRole'
import UpdateStatusModal from './updateStatusModal'
import ShareData from '../../commons/ShareData'
import CommonActivity from '../activity'
import { getUserById } from '../../../services/user'
import { getListQuoteOpportunityByOpportunityId } from '../../../services/quote'
import { convertTextToDateTime } from '../../../utils/commonUtil'
const route = all_routes;

const OpportunityDetail = () => {
  const [opportunity, setOppotunity] = useState<any>({});
  const [status, setStatus] = useState<number>(0);
  const [priceBook, setPriceBook] = useState<any>({});
  const [product, setProduct] = useState<any>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [stages, setStage] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [productId, setProductId] = useState(0);
  const [contactRoles, setContactRoles] = useState<any>([]);
  const [stageClose, setStageClose] = useState<any>([])
  const [total, setTotal] = useState<any>({
    totalContactRoles: 0,
    totalCampaignInfluence: 0,
    totalQuotes: 0
  });
  const [openModal, setOpenModal] = useState<any>({
    addContactRole: false,
    editContactRole: false,
    editOneContactRole: false,
    updateStageClose: false,
    priceBookchange: false,
    openShareData: false
  });
  const [contactRole, setContactRole] = useState<any>({});
  const { t } = useTranslation();
  const nav = useNavigate();

  const { id } = useParams();

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleClick = (id: any) => {
    setStatus(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    getListStage()
      .then(response => {
        if (response.code === 1) {
          setStage(response.data.filter((item: any) => item.isClose === 0));
          setStageClose(response.data.filter((item: any) => item.isClose === 1)?.map(
            (item: any) => {
              return {
                value: item.id,
                label: item.stageName
              }
            }
          ));
          //find the largest stage id with isClose = 0
          const theLargestIdStage = response.data.filter((item: any) => item.isClose === 0).reduce((prev: any, current: any) => (prev.id > current.id) ? prev : current);
          getDetailOpportunity(theLargestIdStage);
        }
      })
      .catch(error => { })
    checkPermissionRole(route.opportunitiesDetails);
    getContactRoles();
    getTotalCampaignInfluence();
    getTotalQuotes();
  }, [])

  const getTotalQuotes = () => {
    const param = {
      currentPage: 0,
      perPage: 100,
      opportunityId: id
    }
    getListQuoteOpportunityByOpportunityId(param)
      .then(response => {
        if (response.code === 1) {
          setTotal((prev: any) => ({ ...prev, totalQuotes: response?.data?.total }));
        }
      })
      .catch(error => {
        console.log("Error: ", error)
      });
  }

  useEffect(() => {
    getProducts();
  }, [id]);

  const getProducts = () => {
    const param = {
      opportunityId: id,
    }
    getProductList(param)
      .then(response => {
        if (response.code === 1) {
          setProducts(response.data.products);
          setPriceBook(response.data.priceBook);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }
  const getDetailOpportunity = (largetId?: any) => {
    Swal.showLoading();
    getOpportunityDetail(id)
      .then((response: any) => {
        Swal.close();
        if (response.code === 1) {
          const newOpportuniry = response.data;
          getOwner(newOpportuniry.createBy);
          newOpportuniry.stage.id = newOpportuniry.stage.stageId;
          setOppotunity(newOpportuniry);
          setStatus(response.data.stage.stageId);
          if (response.data.stage.isClose === 1) {
            const theLargestIdStage = stages[stages.length - 1]?.id || largetId?.id;
            setStatus(theLargestIdStage);
            setStage((prev: any) => prev.map((item: any) => item.id === theLargestIdStage ? {
              ...item,
              stageName: response?.data?.stage?.stageName
            } : item));
            console.log("Status: ", theLargestIdStage, status, stages);
          }
        }
      })
      .catch((error: any) => {
        Swal.close();
      })
  }

  const getOwner = (id: any) => {
    getUserById(id)
      .then(response => {
        if (response.code === 1) {
          setOppotunity((prev: any) => ({ ...prev, owner: response?.data?.firstName + ' ' + (response?.data?.lastName || '') }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const getContactRoles = () => {
    const param = {
      pageNo: 0,
      pageSize: 3,
      opportunityId: id
    }
    getListContactRole(param)
      .then(response => {
        if (response.code === 1) {
          setContactRoles(response.data.items.filter((item: any) => item?.contactId !== 0));
          setTotal((prev: any) => ({ ...prev, totalContactRoles: response.data.total }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const changePipeStatus = () => {
    const currentStage: any = stages?.find((item: any) => item.id === status);
    const currentStageIndex = stages.findIndex((item: any) => item.id === status);
    const nextStage: any = stages[currentStageIndex + 1];
    if (opportunity != null && currentStage && !nextStage) {
      setUpdateStatus(true);
    } else if (opportunity != null && currentStage) {
      opportunity.stage = opportunity.stage.id === currentStage?.id ? nextStage : currentStage;
      setOppotunity({ ...opportunity });
      setStatus(opportunity.stage.id);
      opportunity.stageId = opportunity.stage.id;
      opportunity.forecastCategoryId = opportunity.forecast.forecastCategoryId;
      const body = {
        stage: opportunity.stageId,
        id: opportunity.opportunityId,
      }
      patchOpportunity(body)
        .then(response => {
          if (response.code === 1) {
            customToast("success", response.message);
            getDetailOpportunity();
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          customToast("error", "System error, contact with admin to fix.");
          console.log("Error: ", error);
        })
    }
  }

  const closeOpportunity = (stageId: any) => {
    const body = {
      stage: stageId,
      id: id,
    }
    Swal.showLoading();
    patchOpportunity(body)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          customToast("success", response.message);
          setUpdateStatus(false);
          getDetailOpportunity();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        Swal.close();
        customToast("error", "System error, contact with admin to fix.");
        console.log("Error: ", error);
      })
  }

  const getTotalCampaignInfluence = () => {
    const param = {
      pageNo: 0,
      pageSize: 1,
      opportunityId: id
    }
    getCampaignInfluence(param)
      .then(response => {
        if (response.code === 1) {
          setTotal((prev: any) => ({ ...prev, totalCampaignInfluence: response.data.total }));
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const removeOpportunity = () => {
    deleteOpportunity(opportunity?.opportunityId)
      .then(response => {
        document.getElementById('btn-close')?.click();
        if (response.code === 1) {
          customToast("success", response.message);
          nav(route.opportunities);
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
      })
  }

  const removeProduct = () => {
    deleteProduct(id, productId)
      .then(response => {
        if (response.code === 1) {
          customToast("success", "Delete Success!");
          document.getElementById('close-btn-dp')?.click();
          getProducts();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        console.log("Error: ", error);
      })
  }

  const removeContactRole = () => {
    Swal.showLoading();
    const param = {
      opportunityId: id,
      contactId: contactRole?.contactId
    }
    deleteContactRole(param)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          toast.success("Delete Success!");
          getContactRoles();
          document.getElementById('close-btn-dcr')?.click();
        } else {
          toast.error(response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      })
  }

  const handleChoosePriceBook = (priceBookId: any) => {
    if (!priceBookId) {
      customToast("error", "Please choose price book!");
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
          customToast("success", "Choose price book success");
          document.getElementById('btn-close-cpb')?.click();
          getProducts();
          getDetailOpportunity();
          setOpenModal({ ...openModal, priceBookchange: true });
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        Swal.close();
        console.log("Error: ", error);
      })
  }

  const openEditModal = (id: any) => {
    setProductId(id);
    setProduct(products?.find((item: any) => item.product.productId === id));
  }

  const openEditModalContactRole = (item: any) => {
    setContactRole(item);
    setOpenModal({ ...openModal, editOneContactRole: true });
  }

  const setAddContactRole = (value: any) => {
    setOpenModal({ ...openModal, addContactRole: value });
  }

  const setEditContactRole = (value: any) => {
    setOpenModal({ ...openModal, editContactRole: value });
  }

  const setEditOneContactRole = (value: any) => {
    setOpenModal({ ...openModal, editOneContactRole: value });
  }

  const setUpdateStatus = (value: any) => {
    setOpenModal({ ...openModal, updateStageClose: value });
  }

  const setOpenShareData = (value: any) => {
    setOpenModal({ ...openModal, openShareData: value });
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
                    <h4 className="page-title">{t("LABEL.OPPORTUNITIES.OPPORTUNITY_OVERVIEW")}</h4>
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
                        <Link to={route.opportunities}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("LABEL.OPPORTUNITIES.OPPORTUNITY")}
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
                      <img src='https://cdn-icons-png.flaticon.com/512/10434/10434252.png' alt='opportunity-icon' />
                    </span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {opportunity?.opportunityName}{" "}
                    </h5>
                    <p className="mb-1">
                      <i className="ti ti-wallet" /> {opportunity?.amount?.toLocaleString()} đ
                    </p>
                    <p className="mb-0">
                      <i className="ti ti-clock" /> {opportunity?.closeDate ? convertTextToDateTime(opportunity?.closeDate) : ''}
                    </p>
                  </div>
                </div>
                <div className="contacts-action">
                  <span className="badge">
                    <Link
                      to="#"
                      className="btn custom-btn-blue-black assign-btn-permission"
                      onClick={() => setOpenShareData(true)}
                    >
                      {t("ACTION.ASSIGN")}
                    </Link>
                  </span>
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
                      data-bs-target="#delete_opportunity"
                    >
                      Delete
                    </Link>
                  </span>
                </div>
              </div>
              {/* /Leads User */}
            </div>
            {/* Leads Sidebar */}
            <div className="col-xl-3">
              <div className="contact-sidebar">
                <ul className="deals-info">
                  <li>
                    <div className='space-between col-md-12'>
                      <div>
                        <Link to={`/opportunities-details/${id}/list-contact-role`} >
                          <h6 className='link-blue-underline'>{t("LABEL.OPPORTUNITIES.CONTACT_ROLES")} {`(${total?.totalContactRoles})`}</h6>
                        </Link>
                        <Link to={`/opportunities-details/${id}/list-campaign-influenced`} >
                          <h6 className='link-blue-underline'>{t("LABEL.OPPORTUNITIES.CAMPAIGN_INFLUENCE")} {`(${total?.totalCampaignInfluence})`}</h6>
                        </Link>
                        <Link to={`/opportunities-details/${id}/list-quotes`} >
                          <h6 className='link-blue-underline'>{t("LABEL.OPPORTUNITIES.QUOTES")} {`(${total?.totalQuotes})`}</h6>
                        </Link>
                      </div>

                    </div>
                  </li>
                </ul>
              </div>
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <Link to={`/opportunities-details/${id}/list-contact-role`}>
                    <h6>{t("LABEL.OPPORTUNITIES.CONTACT_ROLES")} {total?.totalContactRoles > 3 ? "(3+)" : `(${total?.totalContactRoles})`}</h6>
                  </Link>
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
                        className="dropdown-item add-btn-permission"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add_contact_roles"
                        onClick={() => setAddContactRole(true)}
                      >
                        {t("ACTION.ADD")}
                      </Link>
                      <Link
                        className="dropdown-item edit-btn-permission"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_contact_roles"
                        onClick={() => setEditContactRole(true)}
                      >
                        {t("ACTION.EDIT")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {contactRoles?.slice(0, 3).map((item: any) => (
                    <li key={item.contactId}>
                      <div className='space-between col-md-12'>
                        <div>
                          <Link to={`/contact-details/${item?.contactId}`}>
                            <h6>{item?.contactName}</h6>
                          </Link>
                          <p>{t("LABEL.OPPORTUNITIES.ROLE")} : {item?.coOppRelation?.contactRole?.roleName}</p>
                          <p>{t("LABEL.OPPORTUNITIES.TITLE")} : {item?.title}</p>
                        </div>
                        <div className="dropdown table-action">
                          <Link
                            to="#"
                            className="action-icon contact-role-btn-permission"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa fa-ellipsis-v" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_one_contact_roles"
                              onClick={() => openEditModalContactRole(item)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_contact_roles"
                              onClick={() => setContactRole(item)}
                            >
                              {t("ACTION.DELETE")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="contact-sidebar">
                <div className="con-sidebar-title">
                  <Link to={`/opportunities-details/${id}/list-products`}>
                    <h6>{t("LABEL.OPPORTUNITIES.PRODUCTS")} {`(${products.length > 3 ? '3+' : products.length})`}</h6>
                  </Link>
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
                      {opportunity?.priceBook && <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#add_products"
                      >
                        {t("LABEL.OPPORTUNITIES.ADD_PRODUCTS")}
                      </Link>}
                      {opportunity?.priceBook && <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_products"
                      >
                        {t("LABEL.OPPORTUNITIES.EDIT_PRODUCTS")}
                      </Link>}
                      <Link
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#choose_price_book_modal"
                      >
                        {t("LABEL.OPPORTUNITIES.CHOOSE_PRICE_BOOK")}
                      </Link>
                    </div>
                  </div>
                </div>
                <ul className="deals-info">
                  {/* Show 3 producut only */}
                  {products?.slice(0, 3).map((item: any) => (
                    <li key={item.productId}>
                      <div className='space-between col-md-12'>
                        <div>
                          <Link to={`/product-details/${item?.product?.productId}`}>
                            <h6>{item?.product?.productName}</h6>
                          </Link>
                          <p>{t("LABEL.PRODUCT.QUANTITY")} : {item?.quantity}</p>
                          <p>{t("LABEL.PRODUCT.SALES_PRICE")} : {item?.sales_price.toLocaleString()} đ</p>
                          <p>{t("LABEL.PRODUCT.TOTAL_PRICE")} : {(item?.quantity && item?.sales_price) ? (item?.quantity * item?.sales_price).toLocaleString() : 0} đ</p>
                        </div>
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
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_product"
                              onClick={() => openEditModal(item?.product?.productId)}
                            >
                              {t("ACTION.EDIT")}
                            </Link>
                            <Link
                              className="dropdown-item delete-btn-permission"
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#delete_product"
                              onClick={() => setProductId(item?.product?.productId)}
                            >
                              {t("ACTION.DELETE")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* /Leads Sidebar */}
            {/* Leads Details */}
            <div className="col-xl-9">
              <div className="contact-tab-wrap">
                <div className="pipeline-list">
                  <ul>
                    {stages.map((item: any, index: any) => {
                      const statusIndex = stages.findIndex((itemS: any) => itemS.id === status);
                      const hoveredIndex = stages.findIndex((itemS: any) => itemS.id === hoveredItem);
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => handleMouseEnter(item.id)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link
                            to="#"
                            onClick={() => handleClick(item.id)}
                            className={statusIndex > index ? 'bg-success' : statusIndex === index ? 'bg-info' : ''}
                          >
                            {hoveredIndex === index || statusIndex <= index ? item.stageName : <i className='fas fa-check' />}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <div className='row row-btn-mark-as'>
                    <button onClick={() => changePipeStatus()} className='btn btn-primary btn-mark-as'><i className="fas fa-check"></i>&nbsp;
                      {status === opportunity?.stage?.id ? 'Mark Status as Complete' : 'Mark as current state'}
                    </button>
                  </div>
                </div>
                <ul className="contact-nav nav">
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
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#activities"
                    >
                      Activities
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
                      <DetailOpportunity opportunity={opportunity} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Activities */}
                  <div className="tab-pane fade" id="activities">
                    <CommonActivity id={id} type="opportunities" />
                  </div>
                  {/* /Activities */}
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
      <CreateOpportunity data={opportunity} showPopup={showPopup} setShowPopup={setShowPopup} id={id} getDetail={getDetailOpportunity} isEdit={true} />
      <DeleteModal deleteId={"delete_opportunity"} handleDelete={removeOpportunity} />
      <DeleteModal deleteId={"delete_product"} handleDelete={removeProduct} closeBtn={"close-btn-dp"} />
      <ChoosePriceBookModal id={id} modalId={"choose_price_book_modal"} action={handleChoosePriceBook} pbId={priceBook?.pricebookId}
        priceBook={priceBook} />
      <AddProductModal id={id} getList={getProducts} priceBookChange={openModal.priceBookchange} getProductDetail={getDetailOpportunity} />
      <EditProductsModal id={id} getList={getProducts} getProductDetail={getDetailOpportunity} />
      <EditProductModal id={id} product={product} priceBook={priceBook} opportunity={opportunity} getList={getProducts} getProductDetail={getDetailOpportunity} />
      <AddContactRole id={id} getList={getContactRoles} isOpen={openModal?.addContactRole} setIsOpen={setAddContactRole} />
      <EditContactRole id={id} getList={getContactRoles} isOpen={openModal?.editContactRole} setIsOpen={setEditContactRole} />
      <DeleteModal deleteId={"delete_contact_roles"} handleDelete={removeContactRole} closeBtn={"close-btn-dcr"} />
      <EditOneContactRole contact={contactRole} opportunity={opportunity} getList={getContactRoles}
        id={id} isOpen={openModal.editOneContactRole} setIsOpen={setEditOneContactRole} />
      <UpdateStatusModal listCloseStage={stageClose} closeModal={() => setUpdateStatus(false)} isOpen={openModal.updateStageClose} handleUpdate={closeOpportunity} />
      <ShareData closeModal={() => setOpenShareData(false)} isOpen={openModal.openShareData} id={id} type="opportunity" />
    </>
  )
}

export default OpportunityDetail;
