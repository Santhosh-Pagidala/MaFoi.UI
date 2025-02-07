import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from "react-select";
import * as api from "../../../backend/request";

const Months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
]

export class BulkUploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = { uploadFiles: [] };
    }

    componentDidMount() {
        api.get('/api/Company/GetUserCompanies').then(response => {
            const companies = (response.data || []).map(company => {
                return { value: company.id, label: company.name, company }
            });
            this.setState({ companies });
            this.onCompanyChange(companies[0]);
        });
        api.get('/api/Rule/GetAll').then(response => {
            const rules = (response.data || []).map(rule => {
                return { value: rule.id, label: rule.name, rule }
            });
            this.setState({ rules });
        })
        this.setYears();
    }

    setYears() {
        const year = new Date().getFullYear();
        let years = [];
        for (let i = 0; i < 5; i++) {
            years.push(year - i);
        }
        years = years.map(year => {
            return { value: year, label: year }
        })
        this.setState({ years });
        this.setState({ selectedMonth: Months[new Date().getMonth()], selectedYear: years[0] })
    }

    onCompanyChange(event) {
        this.setState({ associateCompanies: [], locations: [] });
        this.setState({ selectedAssociateCompany: null, selectedLocation: null });
        this.setState({ selectedCompany: event });
        if (event && event.value) {
            const associateCompanies = event.company.associateCompanies.map(associateCompany => {
                return { label: associateCompany.name, value: associateCompany.id };
            });
            const locations = event.company.locations.map(location => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location };
            });
            this.setState({ associateCompanies, locations });
            const selectedAssociateCompany = (associateCompanies || [])[0] || null;
            const selectedLocation = (locations || [])[0] || null;
            this.setState({ selectedAssociateCompany, selectedLocation });
        }
    }
    onAssociateCompanyChange(event) {
        this.setState({ selectedAssociateCompany: event });
    }

    onLocationChange(event) {
        this.setState({ selectedLocation: event });
    }

    onFileChange(event) {
        const _uploadedFiles = [...this.state.uploadFiles];
        if (event) {
            const length = event.target.files.length;
            const time = new Date().getTime();
            const allowedExtensions = /(\.xlsx|\.xls)$/i;
            for (let i = 0; i < length; i++) {
                const file = event.target.files[i];
                const invalidFile = !allowedExtensions.exec(file.name);
                _uploadedFiles.push({ id: time + i, file, invalidFile });
            }
            this.setState({ uploadFiles: _uploadedFiles });
            event.target.value = null;
        }
    }

    onTypeChange(event, index) {
        const _uploadedFiles = [...this.state.uploadFiles];
        delete _uploadedFiles[index].required;
        delete _uploadedFiles[index].duplicate;
        const valueExists = _uploadedFiles.find(file => {
            return file.type && file.type.value === event.value;
        });
        if (valueExists) {
            _uploadedFiles[index].duplicate = true;
        }
        _uploadedFiles[index].type = event;
        const selectedForms = _uploadedFiles.filter(file => !!file.type).map(file => file.type.value);
        _uploadedFiles.forEach(file => {
            if (file.type && file.type.value && file.duplicate) {
                const duplicates = selectedForms.filter(form => form === file.type.value);
                file.duplicate = duplicates.length > 1;
            }
        });
        this.setState({ uploadFiles: _uploadedFiles });
    }

    onDeleteFile(index) {
        const _uploadedFiles = [...this.state.uploadFiles];
        _uploadedFiles.splice(index, 1);
        this.setState({ uploadFiles: _uploadedFiles });
    }

    submit() {
        let hasError = false;
        const _uploadedFiles = [...this.state.uploadFiles];
        _uploadedFiles.forEach(file => {
            if (!file.type && !file.invalidFile) {
                file.required = true;
                hasError = true;
            }

            if (file.invalidFile || file.duplicate) {
                hasError = true;
            }
        });
        this.setState({ uploadFiles: _uploadedFiles });
        if (hasError) {
            return;
        }
        const formData = new FormData();
        _uploadedFiles.forEach(file => {
            formData.append('files', file.file, file.type.value);
        });
        formData.append('company', this.state.selectedCompany.value);
        formData.append('associatedCompany', this.state.selectedAssociateCompany.value);
        formData.append('location', this.state.selectedLocation.value);
        formData.append('month', this.state.selectedMonth.value);
        formData.append('year', this.state.selectedYear.value);
        api.post('/api/FileUpload/UploadBulkFiles', formData).then(response => {
            console.log(response);
            this.props.onClose();
        }, error => {
            console.log(error);
        })
    }

    handleClose() {
        this.props.onClose();
    }

    render() {
        return (
            <>
                <Modal show={true} backdrop="static" animation={false} size="lg">
                    <Modal.Header closeButton={true} onHide={this.handleClose.bind(this)}>
                        <Modal.Title className="bg">Bulk Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-4">
                            <div className="col-3">
                                <label>Company</label>
                                <Select options={this.state.companies} onChange={this.onCompanyChange.bind(this)}
                                    placeholder='Company' value={this.state.selectedCompany} />
                            </div>
                            <div className="col-4">
                                <label>Associate Company</label>
                                <Select options={this.state.associateCompanies} onChange={this.onAssociateCompanyChange.bind(this)}
                                    placeholder='Associate Company' value={this.state.selectedAssociateCompany} />
                            </div>
                            <div className="col-3">
                                <label>Location</label>
                                <Select options={this.state.locations} onChange={this.onLocationChange.bind(this)}
                                    placeholder='Location' value={this.state.selectedLocation} />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-3">
                                <label>Month</label>
                                <Select options={Months} onChange={(event) => this.setState({ selectedMonth: event })}
                                    placeholder='Month' value={this.state.selectedMonth} />
                            </div>
                            <div className="col-4">
                                <label>Year</label>
                                <Select options={this.state.years} onChange={(event) => this.setState({ selectedYear: event })}
                                    placeholder='Year' value={this.state.selectedYear} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7 mb-3">
                                <label>Select file to upload</label>
                                <input type="file" className="form-control" id="inputGroupFile01" onChange={this.onFileChange.bind(this)} multiple />
                            </div>
                            <div className="col-5"></div>
                        </div>
                        <div className="row m-0">
                            <table className="table modalTable fixed_header">
                                <thead>
                                    <tr>
                                        <th width="5%"></th>
                                        <th width="55%" >File Name</th>
                                        <th width="35%">Forms/Registers & Returns</th>
                                        <th width="5%"></th>
                                    </tr>
                                </thead>
                                <tbody height="300px">
                                    {
                                        this.state.uploadFiles.map((file, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td width="5%">{index + 1}</td>
                                                    <td width="55%" >
                                                        <div>{file.file.name}</div>
                                                        {
                                                            file.invalidFile &&
                                                            <div className="text-danger">
                                                                {file.invalidFile && <small>Invalid file format.</small>}
                                                            </div>
                                                        }
                                                    </td>
                                                    <td width="35%">
                                                        <Select options={this.state.rules} className={(file.required || file.duplicate) && 'error'}
                                                            value={file.type} menuPlacement="auto" menuPosition="fixed"
                                                            onChange={(event) => this.onTypeChange(event, index)}
                                                            isDisabled={file.invalidFile} />
                                                        {
                                                            (file.required || file.duplicate) &&
                                                            <div className="text-danger">
                                                                {file.required && <small>Required</small>}
                                                                {file.duplicate && <small>Form selection duplicate</small>}
                                                            </div>
                                                        }
                                                    </td>
                                                    <td width="5%">
                                                        <FontAwesomeIcon icon={faTrash} className="opacity-50" onClick={() => this.onDeleteFile(index)} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        this.state.uploadFiles.length === 0 &&
                                        <tr >
                                            <td colSpan={4} width="100%" className="text-center" >No files uploaded</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button variant="outline-secondary" onClick={() => this.handleClose()} className="btn btn-outline-secondary">
                            Back
                        </Button>
                        <Button variant="primary" onClick={() => this.submit()}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default BulkUploadModal;