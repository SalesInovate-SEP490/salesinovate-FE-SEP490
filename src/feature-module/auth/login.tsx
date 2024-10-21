import React, { useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { useTranslation } from "react-i18next";
import { getUserById, getUserRole, loginSystem } from '../../services/user'
import { useDispatch } from "react-redux";
import { login } from "../../core/data/redux/commonSlice";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { setRole } from "../../utils/jwtUtils";
import { jwtDecode, JwtPayload } from "jwt-decode";
const Login = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState<{
    userName?: string; password?: string;
  }>({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const message = location.state?.message || '';
  const route = all_routes;

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleLogin = () => {
    Swal.showLoading();
    const param = {
      username: user.userName,
      password: user.password,
      client_id: 'sales-innovate',
      client_secret: 'kZnyxMsIEYLxqKjM9RkJ4xNSlK5c2SCU',
      // client_secret: 'rHQVBtxjmaKaK5VywZKDUayjxPmpAusc',
      grant_type: 'password'
    }
    loginSystem(param)
      .then(response => {
        Swal.close();
        dispatch(login({ user, token: response.access_token, refreshToken: response.refresh_token }));
        const decoded = jwtDecode<JwtPayload>(response.access_token);
        if (decoded?.sub) {
          const userId = decoded.sub;
          localStorage.setItem('userId', userId);
          const anyDecoded = decoded as any;
          const roles = anyDecoded?.realm_access?.roles || [];
          setRole(roles);
          navigate('/');
        }
      })
      .catch(error => {
        Swal.close();
        toast.error("Login failed, please check your username and password again!");
        console.log("Error: ", error);
      });
  }

  // enter => submit
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }
  return (
    <div className="account-content">
      <div className="login-wrapper account-bg">
        <div className="login-content">
          <form>
            <div className="login-user-info">
              <div className="login-logo d-flex align-items-center">
                <ImageWithBasePath
                  src="assets/img/logo.svg"
                  className="img-fluid logo-header"
                  alt="Logo"
                />
                <h4>{t("COMMON.APP_NAME")}</h4>
              </div>
              <div className="login-heading">
                <h4>Sign In</h4>
                <p style={{ color: 'red' }}>{message}</p>
              </div>
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.LOGIN.USER_NAME")}</label>
                <div className="form-wrap-icon">
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => { setUser({ ...user, userName: e.target.value }) }}
                    value={user.userName}
                    onKeyPress={handleKeyPress}
                  />
                  <i className="ti ti-mail" />
                </div>
              </div>
              <div className="form-wrap">
                <label className="col-form-label">{t("LABEL.LOGIN.PASSWORD")}</label>
                <div className="pass-group">
                  {/* // enter => submit */}
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="pass-input form-control"
                    onChange={(e) => { setUser({ ...user, password: e.target.value }) }}
                    value={user.password}
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                    onClick={togglePasswordVisibility}
                  ></span>
                </div>
              </div>
              <div className="form-wrap form-wrap-checkbox">
                {/* <div className="text-end">
                  <Link to={route.forgotPassword} className="forgot-link">
                    Forgot Password?
                  </Link>
                </div> */}
              </div>
              <div className="form-wrap">
                <Link to="#" onClick={handleLogin} className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
