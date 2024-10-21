import React from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from 'react-router-dom'
import { all_routes } from "../router/all_routes";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const {t} = useTranslation();
  const route = all_routes;
  return (
    <div className="account-content">
      <div className="login-wrapper account-bg forgot-bg">
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
                <h4>Forgot Password?</h4>
                <p>
                  If you forgot your password, well, then we’ll email you
                  new password so you can get back to your account.
                </p>
              </div>
              <div className="form-wrap">
                <label className="col-form-label">Email Address</label>
                <div className="form-wrap-icon">
                  <input type="text" className="form-control" />
                  <i className="ti ti-mail" />
                </div>
              </div>
              <div className="form-wrap">
                <Link to={route.login} className="btn btn-primary">
                  Submit
                </Link>
              </div>
              <div className="login-form text-center">
                <h6>
                  Return to
                  <Link to={route.login} className="hover-a">
                    {" "}
                    Log In
                  </Link>
                </h6>
              </div>
              <div className="form-set-login or-text">
              </div>
              <div className="login-social-link">
                <div className="copyright-text">
                  <p>Copyright ©2024 - CRMS</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
