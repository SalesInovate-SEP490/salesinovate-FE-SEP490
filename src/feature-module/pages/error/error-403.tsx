import React from 'react'
import { all_routes } from '../../router/all_routes';
import { Link } from "react-router-dom";
import ImageWithBasePath from '../../../core/common/imageWithBasePath';

const Error403 = () => {
  const route = all_routes;
  return (
    <div className="container">
        <div className="error-box">
          <div className="error-img">
            <ImageWithBasePath src="assets/img/authentication/error-403.png" className="img-fluid custome-image-height-403" alt="" />
          </div>
          <div className="error-content">
            <h3>Oops, something went wrong</h3>
            <p>You don't have permission to access this page</p>
            <Link to={route.dealsDashboard} className="btn btn-primary">
              <i className="ti ti-arrow-narrow-left" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
  )
}

export default Error403