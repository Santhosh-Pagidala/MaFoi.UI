import React, { Component } from "react";
import { Link } from 'react-router-dom';

import Vendor from "./vendorPerformance";

export class Dashboard extends Component {
  render() {
    
    return (
      <div>
            {/* Page Heading starts */}
            <div className="row ml-0 mr-0 mb-3 pageHeading p-3">
              <div className="col-8">
                <h4 className="mb-0"> <i className="fa fa-user"></i> Vendor Dashboard</h4>
              </div>
              <div className="col-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 d-flex justify-content-end">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/vendordashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active">Activity</li>
                  </ol>
                </nav>
              </div>
            </div>
            {/* Page Heading ends */}

            {/* Vendordashboard  starts */}
        
            <Vendor />

            {/* Vendordashboard end */}
      </div>
    );
    
         }
}

export default Dashboard;
