import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import {
    countryoptions1,
    languageOptions,
    optiondeals,
    optionindustry,
    options,
    options1,
    optionschoose,
    optionsource,
    optionsowner,
    optionsowner1,
    optionssymbol,
} from "../../../core/common/selectoption/selectoption";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { Lead } from "../../../core/data/interface";
import { getIndustryList, getLeadDetail, getListStatus, getSourceList, updateLead } from "../../../services/lead";
import { toast } from "react-toastify";


export const UpdateLead = (prop: any) => {
    const [addcompany, setAddCompany] = useState(false);
    const [lead, setLead] = useState<Lead>(prop.data);
    const [leadSource, setLeadSource] = useState<any>(null);
    const [leadIndustry, setLeadIndustry] = useState<any>(null);
    const [leadStatus, setLeadStatus] = useState<any>(null);

    const genderOptions = [
        { label: "Male", value: 1 },
        { label: "Female", value: 2 },
    ]

    useEffect(() => {
        getIndustryList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.industryId,
                        label: item.industryStatusName
                    }
                })
                setLeadIndustry(data);
            })
            .catch((err) => {
                console.log(err);
            });
        getListStatus()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.leadStatusId,
                        label: item.leadStatusName
                    }
                })
                setLeadStatus(data);
            })
            .catch((err) => {
                console.log(err);
            });
        getSourceList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.leadSourceId,
                        label: item.leadSourceName
                    }
                })
                setLeadSource(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    const customStyles: StylesConfig = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#E41F07" : "#fff",
            color: state.isFocused ? "#fff" : "#000",
            "&:hover": {
                backgroundColor: "#E41F07",
            },
        }),
    };

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value } = e.target;
            setLead({
                ...lead,
                [name]: value
            });
        } else {
            if (nameChild) {
                setLead({
                    ...lead,
                    [name]: {
                        [nameChild]: e.value
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setLead({
                    ...lead,
                    [name]: e.value
                });
            }
        }
        console.log(lead);
    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const handleUpdate = () => {
        lead.statusId = lead.status.leadStatusId;
        updateLead(lead)
            .then(response => {
                if (response.code === 1){
                    toast.success("Update lead successfully!");
                    prop.setLead(lead);
                    prop.setShowPopup(false);
                    prop.setStatus(lead.statusId);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            {/* Add User */}
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Update Lead</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => togglePopup()}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Lead title <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="title"
                                                onChange={(e) => handleChange(e)} value={lead?.title} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    Company <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="company"
                                                onChange={(e) => handleChange(e)} value={lead?.company} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                First Name <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="firstName"
                                                onChange={(e) => handleChange(e)} value={lead?.firstName} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Last Name <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="lastName"
                                                onChange={(e) => handleChange(e)} value={lead?.lastName} />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">
                                                        Phone <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" name="phone"
                                                        onChange={(e) => handleChange(e)} value={lead?.phone} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="col-form-label">
                                                    Status <span className="text-danger">*</span>
                                                </label>
                                                <div className="form-wrap w-100">
                                                    <Select
                                                        className="select"
                                                        options={leadStatus}
                                                        styles={customStyles}
                                                        value={leadStatus?.find((item: any) => item.value === lead?.status.leadStatusId)}
                                                        name="status"
                                                        onChange={e => handleChange(e, 'status', 'leadStatusId')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Source <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                className="select"
                                                options={leadSource}
                                                styles={customStyles}
                                                value={leadSource?.find((item: any) => item.value === lead?.source.leadSourceId)}
                                                name="source"
                                                onChange={e => handleChange(e, 'source', 'leadSourceId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Industry <span className="text-danger">*</span>
                                            </label>
                                            <Select className="select" options={leadIndustry} styles={customStyles}
                                                value={leadIndustry?.find((item: any) => item.value === lead?.industry.industryId)}
                                                name="source"
                                                onChange={e => handleChange(e, 'industry', 'industryId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Gender <span className="text-danger">*</span>
                                            </label>
                                            <Select className="select" options={genderOptions} styles={customStyles}
                                                value={genderOptions?.find((item: any) => item.value === lead?.gender)}
                                                name="source"
                                                onChange={e => handleChange(e, 'gender')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">Email </label>
                                            <input type="text" className="form-control" name="email"
                                                onChange={(e) => handleChange(e)} value={lead?.email} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">Website </label>
                                            <input type="text" className="form-control" name="website"
                                                onChange={(e) => handleChange(e)} value={lead?.website} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">Address </label>
                                            <input type="text" className="form-control" name="address"
                                                onChange={(e) => handleChange(e)} value={lead?.address} />
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => prop.setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={() => handleUpdate()}
                                    >
                                        Update
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add User */}
        </>
    )
}