import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { deleteContract, updateContract, getContractById, getListContractStatus } from '../../../services/contract'
import Swal from 'sweetalert2'
import FixContractDetail from './fixContractDetail';
import { CreateContract } from './createContract'
import ContractRelated from './contractRelated'
import './contract.scss';

const route = all_routes;

const ContractDetail = () => {
  const [contract, setContract] = useState<any>(null);
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [listStatus, setListStatus] = useState<any>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [status, setStatus] = useState<any>(null);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    getContractDetail();
    getListStatus();
  }, [id]);

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const getContractDetail = () => {
    Swal.showLoading();
    getContractById(id)
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setContract(response?.data);
          setStatus(response?.data.contractStatus);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting contract detail: ", error)
      })
  }

  const removeContract = () => {
    deleteContract(id)
      .then(response => {
        document.getElementById('close-btn')?.click();
        if (response.code === 1) {
          customToast("success", response?.message);
          nav(route.contracts);
        } else {
          customToast("error", "The contract can't be delete because there are records that refer to it. you can mark the contract as inactive instead.");
        }
      })
      .catch(error => {
        customToast("error", "System error, contract with admin to fix.");
        console.error("Error deleting contract: ", error)
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

  const changePipeStatus = () => {
    const currentStatus = listStatus.find((item: any) => item?.contractStatusId === status);
    const currentStatusIndex = listStatus.findIndex((item: any) => item?.contractStatusId === status);
    const nextStatus = listStatus[currentStatusIndex + 1];
    if (contract && currentStatus) {
      const stageUpdate = contract?.contractStatus === currentStatus?.contractStatusId ? nextStatus : currentStatus;
      setStatus(stageUpdate.contractStatusId);
      const body = {
        ...contract,
        contractStatus: stageUpdate?.contractStatusId
      }
      updateContract(body, id)
        .then(response => {
          if (response.code === 1) {
            customToast("success", response.message);
            getContractDetail();
          } else {
            customToast("error", response.message);
          }
        })
        .catch(error => {
          customToast("error", "System error, contract with admin to fix.");
          console.error("Error updating contract status: ", error)
        })
    }
  }

  const getListStatus = () => {
    getListContractStatus()
      .then(response => {
        if (response.code === 1) {
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
                    <h4 className="page-title">{t("CONTRACT.CONTRACT_OVERVIEW")}</h4>
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
                          {t("CONTRACT.CONTRACT")}
                        </Link>
                      </li>
                      <li>{ }</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                    </div>
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
                      {contract?.contractNumber}
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
                <h4>{t("CONTRACT.CONTRACT_STATUS")}</h4>
                <div className="pipeline-list">
                  <ul>
                    {listStatus.map((item: any, index: number) => {
                      const statusIndex = listStatus.findIndex((itemS: any) => itemS.contractStatusId === status);
                      const hoveredIndex = listStatus.findIndex((itemS: any) => itemS.contractStatusId === hoveredItem);
                      return (
                        <li
                          key={item.id}
                          onMouseEnter={() => handleMouseEnter(item.contractStatusId)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Link
                            to="#"
                            onClick={() => setStatus(item.contractStatusId)}
                            className={statusIndex > index ? 'bg-success' : statusIndex === index ? 'bg-info' : ''}
                          >
                            {hoveredIndex === index || statusIndex <= index ? item.contractStatusName : <i className='fas fa-check' />}
                          </Link>
                        </li>)
                    })
                    }
                  </ul>
                  <div className='row row-btn-mark-as'>
                    <button onClick={() => changePipeStatus()} className='btn btn-primary btn-mark-as'>
                      {listStatus[listStatus.length - 1]?.contractStatusId === status
                        ? "Selected Converted Status"
                        : (status === contract?.contractStatus ?
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
                      <FixContractDetail contract={contract} getContractDetail={getContractDetail} />
                    </div>
                  </div>
                  {/* /Details */}
                  {/* Related */}
                  <div className="tab-pane fade" id="related">
                    {/* <div className="view-header">
                      <div className='col-md-12 space-between'>
                        <h4>{t("CONTRACT.RELATED")}</h4>
                      </div>
                      <div className="table-responsive custom-table col-md-12 mt-4">
                      </div>
                    </div> */}
                    <ContractRelated contractNumber={contract?.contractNumber} />
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
      <CreateContract showPopup={showPopup} isEdit={true} setShowPopup={setShowPopup} id={id} getContractDetail={getContractDetail} />
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
                  <Link to="#" onClick={removeContract} className="btn btn-danger">
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

export default ContractDetail
