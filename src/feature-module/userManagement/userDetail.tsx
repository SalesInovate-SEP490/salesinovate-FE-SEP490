import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImageWithBasePath from '../../core/common/imageWithBasePath'
import Select from 'react-select'
import { all_routes } from '../router/all_routes'
import CollapseHeader from '../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { User } from './type'
import Swal from 'sweetalert2'
import { checkPermissionRole } from '../../utils/authen'
import { getMyProfileForUser } from '../../services/user'
import MyProfileDetail from './myProfileDetail'
import {UpdateProfile} from './updateProfile'

const route = all_routes;

const UserDetail = () => {
  const [user, setUser] = useState<any>(null);
  const { t } = useTranslation();
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getMyProfile();
    checkPermissionRole(route.myProfile);
  }, []);

  const getMyProfile = () => {
    Swal.showLoading();
    getMyProfileForUser()
      .then(response => {
        Swal.close();
        if (response.code === 1) {
          setUser(response.data);
          console.log("data:", response);
        }
      })
      .catch(error => {
        Swal.close();
        console.error("Error getting profile detail: ", error)
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
                    <h4 className="page-title">{t("USER_MANAGE.MY_PROFILE")}</h4>
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
                        <Link to={route.manageusers}>
                          <i className="ti ti-arrow-narrow-left" />
                          {t("USER_MANAGE.USER_MANAGE")}
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
                      <img src="https://media.lordicon.com/icons/wired/flat/21-avatar.gif" alt="avatar" />
                    </span>
                  </div>
                  <div className="name-user">
                    <h5>
                      {user?.firstName + " " + user?.lastName}
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
                      data-bs-target="#details"
                      className="active"
                    >
                      <i className="ti ti-alarm-minus" />
                      {t("USER_MANAGE.MY_PROFILE")}
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
                      <MyProfileDetail profile={user} getProfileDetail={getMyProfile} />
                    </div>
                  </div>
                  {/* /Details */}
                </div>
              </div>
            </div>

            {/* /Leads Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <ToastContainer />
      <UpdateProfile showPopup={showPopup} isEdit={true} setShowPopup={setShowPopup} getProfileDetail={getMyProfile} />
    </>

  )
}

export default UserDetail
