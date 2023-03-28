import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faPencilSquare } from "@fortawesome/free-solid-svg-icons";
import { faEye, faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import BulkUploadModal from "./bulkuploadModal";
import * as api from "../../../backend/request";

function StatusTmp({ status }) {
  function computeStatusColor(status) {
    if (status === 'Pending') {
      return 'text-warning';
    } else if (status === 'Reject' || status === 'Overdue') {
      return 'text-danger';
    } else if (status === 'Submitted') {
      return 'text-success';
    } else if (status === 'Audited') {
      return 'text-success-emphasis'
    }
    return 'text-secondary'
  }
  return (
    <span className={computeStatusColor(status)}>{status}</span>
  )
}

export class VendorActivityToDo extends Component {

  constructor(props) {
    super(props);
    this.state = { posts: [], res: [], uploadFiles: [], show: false };
  }

  componentDidMount() {
    api.get('/api/ToDo/GetAll').then(response => {
      this.setState({ res: response.data || [] });
    });
  }

  handleShow(event) {
    event.preventDefault();
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ uploadFiles: [] });
    this.setState({ show: false });
  }




  render() {
    return (
      <div>
        {/* Page Heading starts */}
        <div className="row ml-0 mr-0 mb-3 pageHeading p-3 d-flex justify-content-between">
          <div className="col-3">
            <h4 className="mb-0">
              <i className="fa fa-user"></i> Vendor - Activity
            </h4>
          </div>

          <div className="col-3">
            <small>Status: 25% completed</small>
            <div className="progress">
              <div
                className="progress-bar w-25"
                role="progressbar"
                aria-label="Basic example"
                aria-valuenow="25"
                aria-valuemin="25"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="col-3">
            <input
              type="text"
              className="form-control bg-transparent border-1"
              placeholder="Search for Law/Rule"
            ></input>
          </div>

          <div className="col-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 d-flex justify-content-end">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Activity</li>
              </ol>
            </nav>
          </div>
        </div>
        {/* Page Heading ends */}

        <form className="card border-0 p-0 mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-2 col-md-2">
                <select className="form-select">
                  <option>Select</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-3 col-md-3">
                <select className="form-select">
                  <option>Associate Company</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-2 col-md-2">
                <select className="form-select">
                  <option>Location</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>From</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" className="form-control"></input>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>To</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" className="form-control"></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-1">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer border-0">
            <div className="d-flex  justify-content-between">
              <label className="text-appprimary">Forms Status</label>
              <div>
                <input type="checkbox" className="btn-check" id="activitiesSaved" autoComplete="off" />
                <label className="btn btn-outline-secondary" htmlFor="activitiesSaved">Activities Saved</label>
              </div>

              <div>
                <input type="checkbox" className="btn-check" id="pending" autoComplete="off" />
                <label className="btn btn-outline-warning" htmlFor="pending">Pending</label>
              </div>

              <div>
                <input type="checkbox" className="btn-check" id="Overdue" autoComplete="off" />
                <label className="btn btn-outline-danger" htmlFor="Overdue">Overdue</label>
              </div>

              <div>
                <input type="checkbox" className="btn-check" id="Reject" autoComplete="off" />
                <label className="btn btn-outline-danger" htmlFor="Reject">Reject</label>
              </div>

              <div>
                <input type="checkbox" className="btn-check" id="Submitted" autoComplete="off" />
                <label className="btn btn-outline-danger" htmlFor="Submitted">Submitted</label>
              </div>

              <div>
                <input type="checkbox" className="btn-check" id="Audited" autoComplete="off" />
                <label className="btn btn-outline-danger" htmlFor="Audited">Audited</label>
              </div>

              <div>
                <button className="btn btn-primary" onClick={this.handleShow.bind(this)}>
                  Bulk Upload
                </button>
              </div>

              <div>
                <button type="submit" className="btn btn-danger">
                  Submit To Auditor
                </button>
              </div>

            </div>
          </div>
        </form>


        <table className="table table-bordered bg-white">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" /> </th>
              <th scope="col">Month(year)</th>
              <th scope="col">Act</th>
              <th scope="col">Rule</th>
              <th scope="col">Forms/Registers & Returns</th>
              <th scope="col">Associate Company</th>
              <th scope="col">Location Name</th>
              <th scope="col">Audit Due Date</th>
              <th scope="col">Audit Status</th>
              <th scope="col">Forms Status</th>
              <th scope="col">Audit Remarks</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.res.map(function (item, i) {
                // const statusColor = this.computeStatusColor(item.status);
                return (
                  <tr>
                    <td><input type="checkbox" /></td>
                    <td>{item.month}({item.year})</td>
                    <td>{item.act.name}</td>
                    <td>{item.rule.name}</td>
                    <td>{item.activity.name}</td>
                    <td>{item.associateCompany.name}</td>
                    <td>{item.location.name}</td>
                    <td className="text-warning">{dayjs(item.dueDate).format('DD-MM-YYYY')}</td>
                    <td className="text-danger">{item.auditStatus}</td>
                    <td><StatusTmp status={item.status} /></td>
                    <td className="text-danger">{item.auditRemarks}</td>
                    <td>
                      <div className="d-flex flex-row align-items-center">
                        <FontAwesomeIcon icon={faDownload} className="mx-1 opacity-50" />
                        <FontAwesomeIcon icon={faPencilSquare} className="mx-1 opacity-50" />
                        <FontAwesomeIcon icon={faFloppyDisk} className="mx-1 opacity-50" />
                        <FontAwesomeIcon icon={faEye} className="mx-1 opacity-50" />
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {
          this.state.show &&
          <BulkUploadModal onClose={this.handleClose.bind(this)} onSubmit={() => { }} />
        }
      </div>
    );
  }
}

export default VendorActivityToDo;
