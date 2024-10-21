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
import { UpdateProfile } from './updateProfile'
import { useDispatch, useSelector } from 'react-redux'
import { getAvatar, updateAvatarAPI, uploadAvatar } from '../../services/files.service'
import { updateAvatar } from '../../core/data/redux/commonSlice'

const route = all_routes;

const MyProfile = () => {
  const [user, setUser] = useState<any>(null);
  const { t } = useTranslation();
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const avatar = useSelector((state: any) => state.avatar);
  const dispatch = useDispatch();

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
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // file 10MB and have type image is png, jpg
      if (file.size > 10000000) {
        toast.error(t("VALIDATION.FILE_SIZE"));
        return;
      }
      if (!file.type.includes("image")) {
        toast.error(t("VALIDATION.FILE_TYPE"));
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const userId = localStorage.getItem("userId");
      formData.append("userId", userId || "");
      Swal.showLoading();
      if (avatar) {
        updateAvatarAPI(formData)
          .then(response => {
            Swal.close();
            if (response.code === 1) {
              reloadAvatar();
              toast.success(t("MESSAGE.UPLOAD_SUCCESS"));
              getMyProfile();
            }
          })
          .catch(error => {
            Swal.close();
            console.error("Error uploading file: ", error);
          })
      } else {
        uploadAvatar(formData)
          .then(response => {
            Swal.close();
            if (response.code === 1) {
              reloadAvatar();
              toast.success(t("MESSAGE.UPLOAD_SUCCESS"));
              getMyProfile();
            }
          })
          .catch(error => {
            Swal.close();
            console.error("Error uploading file: ", error);
          })
      }
      // clear file input
      event.target.value = "";

    };
  }

  const reloadAvatar = () => {
    const userId = localStorage.getItem("userId");
    getAvatar(userId)
      .then(response => {
        if (response.code === 1) {
          const link = response?.data;
          const id = link?.split('id=')[1]?.split('&')[0];
          const newLink = `https://lh3.googleusercontent.com/d/${id}`;
          dispatch(updateAvatar(newLink));
        }
      })
      .catch(error => {
        console.error("Error getting avatar: ", error)
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
                  <div className='d-flex upload-image-flex'>
                    <div className="avatar company-avatar">
                      <img src={avatar || "https://media.lordicon.com/icons/wired/flat/21-avatar.gif"} alt="avatar" className='avatar-logo-detail' />
                    </div>
                    <label className="btn custom-btn-update-image">
                      <i className="ti ti-camera" />
                      Upload
                      <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </label>
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

export default MyProfile
