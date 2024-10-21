/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";

import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { all_routes } from "../../router/all_routes";
import Loader from "../../../core/common/loader";
import { getRole } from "../../../utils/jwtUtils";
import { useTranslation } from "react-i18next";
const route = all_routes;
const DealsDashboard = () => {
  const [explore, setExplore] = useState<any>(route.profile);
  const {t} = useTranslation();

  useEffect(() => {
    const listRole: any = getRole();
    if (listRole.includes("administrator") || listRole.includes("marketing") || listRole.includes("sdr")) {
      setExplore(route.leads);
    } else if (listRole.includes("sales") || listRole.includes("salesmanager")) {
      setExplore(route.opportunities);
    }
  }, [])
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex flex-homepage">
            <div className="d-flex">
              <div className="d-flex align-items-center">
                <ImageWithBasePath
                  alt="Welcome"
                  className="welcome-image"
                  src="assets/img/waving.png"
                />
                <div className="row">
                  <h1 style={{marginBottom: '5px'}}>{t("COMMON.WELCOME")}</h1>
                  <h5>
                    {t("COMMON.CRM_DESCRIPTION")}
                  </h5>
                </div>
              </div>
            </div>
            <div className="footer">
            </div>
          </div>
          <div className="footer-homepage d-flex justify-content-center">
            <Link to={explore}
              className="btn submit-btn-custom">
              {t("ACTION.EXPLORE")}
            </Link>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <Loader />
    </>
  );
};

export default DealsDashboard;
