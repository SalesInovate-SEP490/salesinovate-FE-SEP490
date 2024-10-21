import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../feature-module/router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import { setMiniSidebar, setMobileSidebar, updateAvatar } from "../../data/redux/commonSlice";
import { getMyProfileForUser, logOut } from "../../../services/user";
import { getRefreshToken } from '../../../utils/jwtUtils';
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { getListNotification, markAllAsRead, markAsRead } from "../../../services/notification";
import { convertTextToDateTime } from "../../../utils/commonUtil";
import GuideLine from "./guideline";
import "./guideline.css";

const Header = () => {
  const route = all_routes;
  const [notifications, setNotifications] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(0); // Pagination state
  const [loading, setLoading] = useState(false); // Loading state
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown container
  const [avatar, setAvatar] = useState<any>("");
  const avatarCache = useSelector((state: any) => state.avatar);
  const dispatch = useDispatch();

  const mobileSidebar = useSelector((state: any) => state.mobileSidebar);
  const miniSidebar = useSelector((state: any) => state.miniSidebar);
  const { t } = useTranslation();

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };

  const [themeSetting, setThemeSetting] = useState(false);

  const LayoutDark = useCallback(() => {
    localStorage.setItem("layoutThemeColors", "dark");
    setThemeSetting(true);
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const LayoutLight = useCallback(() => {
    localStorage.setItem("layoutThemeColors", "light");
    setThemeSetting(false);
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const logOutSession = () => {
    const refreshToken = getRefreshToken();
    const param = {
      client_id: 'sales-innovate',
      client_secret: 'kZnyxMsIEYLxqKjM9RkJ4xNSlK5c2SCU',
      // client_secret: 'rHQVBtxjmaKaK5VywZKDUayjxPmpAusc',
      refresh_token: refreshToken
    }

    logOut(param)
      .then(response => {
        window.location.href = "/login";
        localStorage.clear();
      })
      .catch(error => {
        window.location.href = "/login";
        localStorage.clear();

      })
  }

  const changeLanguage = (lang: string) => {
    localStorage.setItem("i18nextLng", lang);
    i18next.changeLanguage(lang);
    window.location.reload();
  }
  useEffect(() => {
    getNotifications(pageNo);
  }, [pageNo]);

  useEffect(() => {
    if (avatarCache) {
      setAvatar(avatarCache);
    } else {
      getMyProfileForUser()
        .then(response => {
          if (response.code === 1) {
            if (response?.data?.avatarId === null) {
              return;
            }
            const link = response?.data?.avatarId?.toString();
            const id = link?.split('id=')[1]?.split('&')[0];
            const newLink = `https://lh3.googleusercontent.com/d/${id}`;
            dispatch(updateAvatar(newLink));
            setAvatar(newLink);
          }
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [])

  const getNotifications = (pageNo: number) => {
    setLoading(true);
    const param = {
      pageNo,
      pageSize: 5
    };
    getListNotification(param)
      .then(response => {
        if (response.code === 1) {
          const newNotifications = response?.data.map((item: any) => {
            const link = getLinkDetail(item);
            const image = getImage(item);
            return {
              ...item,
              link,
              image
            };
          });
          // Check not duplicated notificationId
          setNotifications((prevNotifications: any) => {
            const newNotificationIds = newNotifications.map((item: any) => item.notificationId);
            const prevNotificationIds = prevNotifications.map((item: any) => item.notificationId);
            const duplicatedIds = newNotificationIds.filter((id: any) => prevNotificationIds.includes(id));
            const filteredNotifications = newNotifications.filter((item: any) => !duplicatedIds.includes(item.notificationId));
            return [...prevNotifications, ...filteredNotifications];
          });
          // set total is isSeen = false only
          setTotal(response?.data.filter((item: any) => !item.isSeen).length);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleScroll = () => {
    if (dropdownRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = dropdownRef.current;
      if (scrollHeight - scrollTop === clientHeight && !loading) {
        setPageNo((prevPageNo) => prevPageNo + 1); // Load next page
      }
    }
  };

  useEffect(() => {
    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading]);

  const getLinkDetail = (notification: any) => {
    // lead,account,contact,opp,campaign,event
    switch (notification.notificationType.notificationContent) {
      case "Lead":
        return route.leadsDetails.replace(":id", notification.linkId);
      case "Account":
        return route.accountsDetails.replace(":id", notification.linkId);
      case "Contact":
        return route.contactsDetails.replace(":id", notification.linkId);
      case "Opportunity":
        return route.opportunitiesDetails.replace(":id", notification.linkId);
      case "Campaign":
        return route.campaignDetails.replace(":id", notification.linkId);
      case "Event":
        return route.calendarDetail.replace(":id", notification.linkId);
      default:
        return route.activities;
    }
  }

  const getImage = (notification: any) => {
    switch (notification.notificationType.notificationContent) {
      case "Lead":
        return "https://cdn.iconscout.com/icon/free/png-256/free-generate-lead-902107.png?f=webp&w=256";
      case "Account":
        return "https://e7.pngegg.com/pngimages/128/641/png-clipart-computer-icons-accounting-money-finance-business-accounting-text-service.png";
      case "Contact":
        return "https://png.pngtree.com/png-vector/20230213/ourmid/pngtree-circle-phone-call-icon-in-black-color-png-image_6596895.png";
      case "Opportunity":
        return "https://static-00.iconduck.com/assets.00/crown-icon-512x486-wsf54aqj.png";
      case "Campaign":
        return "https://static.thenounproject.com/png/1222545-200.png";
      case "Event":
        return "https://png.pngtree.com/png-vector/20230302/ourmid/pngtree-events-line-icon-vector-png-image_6626611.png";
      default:
        return "https://cdn.iconscout.com/icon/free/png-256/free-generate-lead-902107.png?f=webp&w=256";
    }
  }

  const readOneNotification = (notificationId: number) => {
    markAsRead(notificationId)
      .then(response => {
        if (response.code === 1) {
          setNotifications((prevNotifications: any) => {
            return prevNotifications.map((item: any) => {
              if (item.notificationId === notificationId) {
                return {
                  ...item,
                  isSeen: true
                };
              }
              return item;
            });
          });
          setTotal((prevTotal: number) => prevTotal - 1);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const readAllNotifications = () => {
    markAllAsRead()
      .then(response => {
        if (response.code === 1) {
          setNotifications((prevNotifications: any) => {
            return prevNotifications.map((item: any) => {
              return {
                ...item,
                isSeen: true
              };
            });
          });
          setTotal(0);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="header">
        {/* Logo and Sidebar Toggle */}
        <div className="header-left active">
          {/* Logo Links */}
          <Link to={route.dealsDashboard} className="logo logo-normal">
            {themeSetting ? (
              // <img src="assets/img/logo.svg" className="white-logo logo-header" alt="Logo" />
              <ImageWithBasePath src="assets/img/logo.svg" className="logo-header" alt="Logo" />
            ) : (
              <ImageWithBasePath src="assets/img/logo.svg" className="logo-header" alt="Logo" />
              // <img src="assets/img/logo.svg" alt="Logo" className="logo-header" />
            )}
          </Link>
          {/* Hide if mini sidebar , show it full h3*/}
          <h3 className="logo logo-mini"
            style={{
              fontSize: '23px',
              fontWeight: 'bold',
              color: '#0044cc',
              textShadow: `
                1px 1px 0px rgba(255, 255, 255, 0.8), 
                2px 2px 0px rgba(0, 0, 0, 0.2), 
                3px 3px 4px rgba(0, 0, 0, 0.15), 
                4px 4px 4px rgba(0, 0, 0, 0.1), 
                5px 5px 4px rgba(0, 0, 0, 0.05)`,
              marginTop: '0px',
              marginBottom: '0px',
              marginLeft: '0px'
            }}
          >
            {t("COMMON.APP_NAME")}
          </h3>
          <Link to={route.dealsDashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
          </Link>
          {/* Mini Sidebar Toggle */}
          <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
            <i className="ti ti-arrow-bar-to-left" />
          </Link>
        </div>
        {/* Mobile Sidebar Toggle */}
        <Link id="mobile_btn" className="mobile_btn" to="#sidebar" onClick={toggleMobileSidebar}>
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header User Section */}
        <div className="header-user">
          <ul className="nav user-menu">
            {/* Search */}
            <li className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <Link to="#" className="responsive-search">
                  <i className="fa fa-search" />
                </Link>
                <form className="dropdown">
                  <div className="searchinputs" id="dropdownMenuClickable">
                    <input type="text" placeholder="Search" />
                    <div className="search-addon">
                      <button type="submit">
                        <i className="ti ti-command" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            {/* /Search */}
            {/* Nav List */}
            <li className="nav-item nav-list">
              <ul className="nav">
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="btn btn-header-list"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-world" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end menus-info">
                    <div className="row">
                      <div className="col-md-12">
                        <ul className="menu-list">
                          <li>
                            <Link to="#" onClick={() => changeLanguage("en")}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-violet">
                                  <i className="ti ti-world" />
                                </span>
                                <div className="menu-details-content">
                                  <p>English</p>
                                  <span>United States</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#" onClick={() => changeLanguage("vi")}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-world" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Vietnamese</p>
                                  <span>Vietnam</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            {/* /Nav List */}
            {/* DropDown GuideLine (? icon) */}
            {/* <li className="nav-item dropdown nav-item-box">
              <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                <i className="ti ti-help" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
                <div className="dropdown-header">
                  <h4 className="notification-title">Help</h4>
                </div>
                <div className="dropdown-content">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <Link to="#" className="text-dark">
                        <GuideLine />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </li> */}
            <li className="nav-item dropdown nav-item-box">
              <Link to="#" className="nav-link no-focus" data-bs-toggle="dropdown">
                <i className="ti ti-help" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end notification-dropdown help-container">
                <div className="dropdown-header">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-book me-2"></i>
                    <h4 className="notification-title ml-2">{t("GUIDELINE.HELP")}</h4>
                  </div>
                  <hr className="border-help" />
                </div>
                <div className="dropdown-content">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <div className="guide-container">
                        <GuideLine />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            {/* / DropDown GuideLine (? icon)*/}
            {/* Notifications */}
            <li className="nav-item dropdown nav-item-box">
              <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                <i className="ti ti-bell" />
                <span className="badge rounded-pill">{total}</span>
              </Link>
              <div className="dropdown-menu dropdown-menu-end notification-dropdown">
                <div className="topnav-dropdown-header">
                  <h4 className="notification-title">Notifications</h4>
                </div>
                <div className="noti-content" ref={dropdownRef}>
                  <ul className="notification-list">
                    {notifications.map((notification: any, index: number) => (
                      <li key={index} className={`notification-message ${notification?.isSeen ? "" : "unread"}`}>
                        <Link
                          to={notification?.link}
                          onClick={() => readOneNotification(notification?.notificationId)}
                        >
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0">
                              <img
                                src={notification?.image}
                                alt="Profile"
                              />
                              <span className="badge badge-info rounded-pill" />
                            </span>
                            <div className="media-body flex-grow-1">
                              <p className="noti-details">
                                {notification?.content}
                              </p>
                              <p className="noti-time">
                                {notification?.dateTime ? convertTextToDateTime(notification?.dateTime) : ""}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <Link to="#" className="mark-as-read-all" onClick={() => readAllNotifications()}>
                    {t("COMMON.MARK_AS_READ_ALL")}
                  </Link>
                </div>
              </div>
            </li>
            {/* /Notifications */}
            {/* Profile Dropdown */}
            <li className="">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    <img
                      src={avatar || "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"}
                      alt="Profile"
                    />
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilename">
                  <Link className="dropdown-item" to={route.myProfile}>
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  <Link className="dropdown-item" to="#" onClick={() => logOutSession()}>
                    <i className="ti ti-lock" /> Logout
                  </Link>
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile User Menu Dropdown */}
        <div className="dropdown mobile-user-menu">
          <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to={route.dealsDashboard}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            <Link className="dropdown-item" to={route.profile}>
              <i className="ti ti-user-pin" /> My Profile
            </Link>
            <Link className="dropdown-item" to={route.login}>
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* End of Mobile User Menu */}
      </div>
    </>
  );
};

export default Header;
