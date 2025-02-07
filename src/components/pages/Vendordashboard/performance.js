import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavTabs from "../../shared/NavTabs";
import * as api from '../../../backend/request';
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

const CurrentPerformanceTabs = [
    { value: 'Today', label: 'Today' },
    { value: 'ThisWeek', label: 'This Week' }
];
const PreviousPerformanceTabs = [
    { value: 'LastMonth', label: ['Last', 'Month'] },
    { value: 'Last3Months', label: ['Last', '3 Months'] },
    { value: 'Last6Months', label: ['Last', '6 Months'] },
    { value: 'Last12Months', label: ['Last', '12 Months'] }
];


const SubmitStatus = [
    { label: 'Activities Saved', key: 'activitiesSaved', color: 'grey' },
    { label: 'Pending', key: 'pending', color: 'yellow' },
    { label: 'Over Due', key: 'overDue', color: 'red' },
    { label: 'Submitted', key: 'submitted', color: 'green' },
]

const AuditStatus = [
    { label: 'Audited', key: 'approved', color: 'green' },
    { label: 'Rejected', key: 'rejected', color: 'red' }
]

class VendorPerformance extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState({ title: this.props.current ? 'Current Performance' : 'Previous Performance' });
        this.setState({ tabs: this.props.current ? CurrentPerformanceTabs : PreviousPerformanceTabs });
        this.setState({ frequency: this.props.current ? CurrentPerformanceTabs[0].value : PreviousPerformanceTabs[0].value });
    }

    componentWillReceiveProps({ selectedCompany, selectedAssociateCompany, selectedLocation }) {
        if (selectedCompany && selectedLocation) {
            this.updatePerformance({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency: this.state.frequency });
        }
    }

    updatePerformance({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency }) {
        this.setState({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency });
        api.get(`/api/Dashboard/GetVendorDashboard?companyid=${selectedCompany}&associateCompanyId=${selectedAssociateCompany}&locationId=${selectedLocation}&frequency=${frequency}`).then(response => {
            if (response && response.data) {
                this.setState(response.data);
            }
        });
    }

    getLabel() {
        if (this.state.frequency === 'Today') {
            return dayjs(new Date()).format('DD-MMM-YYYY');
        }
        return this.state.frequency;
    }

    onTabChange(frequency) {
        this.setState({ frequency, count: null });
        this.updatePerformance({ ...this.state, frequency });
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5 d-flex align-items-center">
                        <div>
                            {
                                this.props.current ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 22V8H7V22H3ZM10 22V2H14V22H10ZM17 22V14H21V22H17Z" fill="#2965AD" />
                                    </svg> :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 22V8H5V22H1ZM8 22V2H12V22H8ZM15 22V14H19V22H15Z" fill="#2965AD" />
                                        <path d="M24 6.5C24 7.95869 23.4205 9.35764 22.3891 10.3891C21.3576 11.4205 19.9587 12 18.5 12C17.0413 12 15.6424 11.4205 14.6109 10.3891C13.5795 9.35764 13 7.95869 13 6.5C13 5.04131 13.5795 3.64236 14.6109 2.61091C15.6424 1.57946 17.0413 1 18.5 1C19.9587 1 21.3576 1.57946 22.3891 2.61091C23.4205 3.64236 24 5.04131 24 6.5ZM16.707 5L17.354 4.354C17.4479 4.26011 17.5006 4.13278 17.5006 4C17.5006 3.86722 17.4479 3.73989 17.354 3.646C17.2601 3.55211 17.1328 3.49937 17 3.49937C16.8672 3.49937 16.7399 3.55211 16.646 3.646L15.146 5.146C15.0994 5.19245 15.0625 5.24762 15.0373 5.30837C15.0121 5.36911 14.9991 5.43423 14.9991 5.5C14.9991 5.56577 15.0121 5.63089 15.0373 5.69163C15.0625 5.75238 15.0994 5.80755 15.146 5.854L16.646 7.354C16.7399 7.44789 16.8672 7.50063 17 7.50063C17.1328 7.50063 17.2601 7.44789 17.354 7.354C17.4479 7.26011 17.5006 7.13278 17.5006 7C17.5006 6.86722 17.4479 6.73989 17.354 6.646L16.707 6H18.75C19.0455 6 19.3381 6.0582 19.611 6.17127C19.884 6.28434 20.1321 6.45008 20.341 6.65901C20.5499 6.86794 20.7157 7.11598 20.8287 7.38896C20.9418 7.66194 21 7.95453 21 8.25V8.5C21 8.63261 21.0527 8.75979 21.1464 8.85355C21.2402 8.94732 21.3674 9 21.5 9C21.6326 9 21.7598 8.94732 21.8536 8.85355C21.9473 8.75979 22 8.63261 22 8.5V8.25C22 7.38805 21.6576 6.5614 21.0481 5.9519C20.4386 5.34241 19.612 5 18.75 5H16.707Z" fill="#2965AD" />
                                    </svg>
                            }
                        </div>
                        <div className="mx-2">
                            {this.state.title}
                        </div>
                    </div>
                    <div className="card-body">
                        {
                            this.state.tabs &&
                            <NavTabs list={this.state.tabs} onTabChange={(tab) => { this.onTabChange(tab) }} />
                        }
                        <div className="tab-content" id="VendorContent">
                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="my-3">
                                    <div className="text-center mb-3">
                                        <strong className="text-primary">({this.getLabel()})</strong>
                                    </div>
                                    <div className="row m-0  vendorPerformance-cards">
                                        <div className="col-md-4">
                                            <Link className="text-link text-appprimary underline">Submit Status</Link>
                                            {
                                                SubmitStatus.map(status => {
                                                    return (
                                                        <div className="col-md-12 mb-3" key={status.key}>
                                                            <div className={`card cardCount ${status.color}`}>
                                                                <div className="card-body">
                                                                    <div className="row d-flex align-items-center">
                                                                        <div className="col-6 px-0 py-0 overflow-hidden">
                                                                            <label>{status.label}</label>
                                                                        </div>
                                                                        <div className="col-4 px-1 py-1">
                                                                            <h3 className="p-0 m-0">({this.state[status.key]})</h3>
                                                                        </div>
                                                                        <div className="col-1 px-0 py-0">
                                                                            <FontAwesomeIcon className={status.color} icon={faChevronCircleRight} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className="col-md-4">
                                            <Link className="text-link text-appprimary underline"> Audit Status </Link>
                                            {
                                                AuditStatus.map(status => {
                                                    return (
                                                        <div className="col-md-12 mb-3" key={status.key}>
                                                            <div className={`card cardCount ${status.color}`}>
                                                                <div className="card-body">
                                                                    <div className="row d-flex align-items-center">
                                                                        <div className="col-6 px-0 py-0">
                                                                            <label>{status.label}</label>
                                                                        </div>
                                                                        <div className="col-4  px-1 py-1">
                                                                            <h3 className="p-0 m-0">({this.state[status.key]})</h3>
                                                                        </div>
                                                                        <div className="col-1 px-0 py-0">
                                                                            <FontAwesomeIcon icon={faChevronCircleRight} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="col-md-4">
                                            Charts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default VendorPerformance;