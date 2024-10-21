import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { createLead, getIndustryList, getLeadDetail, getListStatus, getSalutationList, getSourceList, patchLead, updateLead } from "../../../services/lead";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { leadMaxLength } from "../../../core/data/validate";
import { formatString } from "../../../utils/commonUtil";
import { useSelector } from "react-redux";

export const CreateLeads: React.FC<{
    setShowPopup?: any, id?: any, getDetailLead?: any,
    showPopup?: any, getLeads?: any, isEdit?: any
}> = ({ getLeads, setShowPopup, showPopup, isEdit, id, getDetailLead }) => {
    const [lead, setLead] = useState<any>({});
    const [title, setTitle] = useState<any>("");
    const [leadSource, setLeadSource] = useState<any>(null);
    const [leadIndustry, setLeadIndustry] = useState<any>(null);
    const [leadStatus, setLeadStatus] = useState<any>(null);
    const [listOpen, setListOpen] = useState<any>({
        address: true
    });
    const [salutation, setSalutation] = useState<any>(null);
    const [rating, setRating] = useState<any>([
        { label: "Hot", value: 2 },
        { label: "Warm", value: 3 },
        { label: "Cold", value: 4 },
    ]);
    const [errors, setErrors] = useState<any>({})
    const userName = useState(useSelector((state: any) => state.userName));
    const { t } = useTranslation();

    useEffect(() => {
        getIndustryList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item?.industryId,
                        label: item?.industryStatusName
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
                        value: item?.leadStatusId,
                        label: item?.leadStatusName
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
                        value: item?.leadSourceId,
                        label: item?.leadSourceName
                    }
                })
                setLeadSource(data);
            })
            .catch((err) => {
                console.log(err);
            });
        getSalutationList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item?.leadSalutionId,
                        label: item?.leadSalutionName
                    }
                })
                setSalutation(data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, [])

    useEffect(() => {
        if (isEdit) {
            setTitle(t("TITLE.LEADS.EDIT_LEAD"));
            getLeadDetail(id)
                .then((res: any) => {
                    const data = res.data;
                    console.log("Data: ", data);
                    setLead(data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } else {
            setTitle(t("TITLE.LEADS.CREATE_LEAD"));
        }
    }, [id])

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

    const validate = () => {
        let tempErrors: {
            lastName?: string; phone?: string; company?: string; status?: any; firstName?: string; middleName?: string;
            title?: string; email?: string; website?: string; noEmployee?: string; street?: string; city?: string;
            province?: string; postalCode?: string; country?: string;
        } = {};
        if (!lead.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
        if (!lead.company) tempErrors.company = t("MESSAGE.ERROR.REQUIRED");
        if (!lead.status) tempErrors.status = t("MESSAGE.ERROR.REQUIRED");
        // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (lead?.phone && !phoneRegex.test(lead?.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
        }
        if (lead?.email && !emailRegex.test(lead?.email)) {
            tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
        }
        if (lead?.website && lead?.website.length > leadMaxLength.website) {
            tempErrors.website = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.website);
        }
        if (lead?.noEmployee && lead?.noEmployee.length > leadMaxLength.noEmployee) {
            tempErrors.noEmployee = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.noEmployee);
        }
        if (lead?.firstName && lead?.firstName.length > leadMaxLength.firstName) {
            tempErrors.firstName = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.firstName);
        }
        if (lead?.lastName && lead?.lastName.length > leadMaxLength.lastName) {
            tempErrors.lastName = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.lastName);
        }
        if (lead?.middleName && lead?.middleName.length > leadMaxLength.middleName) {
            tempErrors.middleName = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.middleName);
        }
        if (lead?.title && lead?.title.length > leadMaxLength.title) {
            tempErrors.title = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.title);
        }
        if (lead?.company && lead?.company.length > leadMaxLength.company) {
            tempErrors.company = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.company);
        }
        if (lead?.addressInfor?.street && lead?.addressInfor?.street.length > leadMaxLength.street) {
            tempErrors.street = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.street);
        }
        if (lead?.addressInfor?.city && lead?.addressInfor?.city.length > leadMaxLength.city) {
            tempErrors.city = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.city);
        }
        if (lead?.addressInfor?.province && lead?.addressInfor?.province.length > leadMaxLength.province) {
            tempErrors.province = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.province);
        }
        if (lead?.addressInfor?.postalCode && lead?.addressInfor?.postalCode.length > leadMaxLength.postalCode) {
            tempErrors.postalCode = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.postalCode);
        }
        if (lead?.addressInfor?.country && lead?.addressInfor?.country.length > leadMaxLength.country) {
            tempErrors.country = formatString(t("MESSAGE.ERROR.MAX_LENGTH"), leadMaxLength.country);
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;

    }


    const handleChange = (e: any, name?: any, nameChild?: any) => {
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
                        [nameChild]: e?.value
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setLead({
                    ...lead,
                    [name]: e.value
                });
            }
        }
    };


    const handleChangeAddress = (e: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setLead({
                ...lead,
                addressInfor: {
                    ...lead.addressInfor,
                    [name]: value
                }
            });
        }
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleUpdate = () => {
        if (validate()) {
            const leadData = {
                leadSourceId: lead?.source?.leadSourceId,
                leadIndustryId: lead?.industry?.industryId,
                leadStatusID: lead?.status?.leadStatusId,
                addressInformation: lead?.addressInfor ? lead?.addressInfor : {},
                leadSalutionId: lead?.salution?.leadSalutionId,
                firstName: lead?.firstName,
                lastName: lead?.lastName,
                middleName: lead?.middleName,
                title: lead?.title,
                company: lead?.company,
                email: lead?.email,
                website: lead?.website,
                noEmployee: lead?.noEmployee,
            }
            if (isEdit) {
                patchLead(leadData, id)
                    .then(response => {
                        console.log("Response:", response);
                        if (response.code === 1) {
                            toast.success("Update Lead successfully!");
                            setShowPopup(false);
                            getDetailLead();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                createLead(leadData)
                    .then(response => {

                        if (response.code === 1) {
                            toast.success("Create Lead successfully!");
                            setLead({
                                firstName: "",
                                lastName: "",
                                middleName: "",
                                title: "",
                                company: "",
                                email: "",
                                website: "",
                                noEmployee: "",
                                phone: "",
                                addressInfor: {
                                    street: "",
                                    city: "",
                                    province: "",
                                    postalCode: "",
                                    country: ""
                                }
                            })
                            setShowPopup(false);
                            getLeads(1, 10);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }

    return (
        <>
            {/* Add User */}
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{title}</h4>
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
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("TITLE.LEADS.LEAD_STATUS")} <span className="text-danger">*</span>
                                            </label>
                                            <div className="form-wrap w-100">
                                                <Select
                                                    className="select"
                                                    options={leadStatus}
                                                    styles={customStyles}
                                                    value={leadStatus?.find((item: any) => item.value === lead?.status?.leadStatusId)}
                                                    name="status"
                                                    onChange={e => handleChange(e, 'status', 'leadStatusId')}
                                                />
                                            </div>
                                            {errors.status && <p className="text-danger">{errors.status}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("TITLE.LEADS.LEAD_OWNER")}
                                            </label>
                                            <div className="form-wrap w-100">
                                                <span>{userName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label className="col-form-label">
                                                        {t("TITLE.LEADS.SALUTATION")}
                                                    </label>
                                                    <Select
                                                        className="select"
                                                        options={salutation}
                                                        styles={customStyles}
                                                        value={salutation?.find((item: any) => item.value === lead?.salution?.leadSalutionId)}
                                                        name="salution"
                                                        onChange={e => handleChange(e, 'salution', 'leadSalutionId')} />
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="col-form-label">
                                                        {t("TITLE.LEADS.LAST_NAME")}  <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control" name="lastName"
                                                        onChange={(e) => handleChange(e)} value={lead?.lastName} />

                                                    {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="col-form-label">
                                                        {t("TITLE.LEADS.FIRST_NAME")}
                                                    </label>
                                                    <input type="text" className="form-control" name="firstName"
                                                        onChange={(e) => handleChange(e)} value={lead?.firstName} />
                                                    {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                                                </div>
                                                <div className="col-md-12">
                                                    <label className="col-form-label">
                                                        {t("TITLE.LEADS.MIDDLE_NAME")}
                                                    </label>
                                                    <input type="text" className="form-control" name="middleName"
                                                        onChange={(e) => handleChange(e)} value={lead?.middleName} />
                                                    {errors.middleName && <p className="text-danger">{errors.middleName}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">Website </label>
                                            <input type="text" className="form-control" name="website"
                                                onChange={(e) => handleChange(e)} value={lead?.website} />
                                            {errors.website && <p className="text-danger">{errors.website}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Lead title
                                            </label>
                                            <input type="text" className="form-control" name="title"
                                                onChange={(e) => handleChange(e)} value={lead?.title} />
                                            {errors.title && <p className="text-danger">{errors.title}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    Company <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input type="text" className="form-control" name="company"
                                                onChange={(e) => handleChange(e)} value={lead?.company} />
                                            {errors.company && <p className="text-danger">{errors.company}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">Email </label>
                                            <input type="text" className="form-control" name="email"
                                                onChange={(e) => handleChange(e)} value={lead?.email} />
                                            {errors.email && <p className="text-danger">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Source
                                            </label>
                                            <Select
                                                className="select"
                                                options={leadSource}
                                                styles={customStyles}
                                                value={leadSource?.find((item: any) => item.value === lead?.source?.leadSourceId)}
                                                name="source"
                                                onChange={e => handleChange(e, 'source', 'leadSourceId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Industry
                                            </label>
                                            <Select className="select" options={leadIndustry} styles={customStyles}
                                                value={leadIndustry?.find((item: any) => item.value === lead?.industry?.industryId)}
                                                name="industry"
                                                onChange={e => handleChange(e, 'industry', 'industryId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">{t("TITLE.LEADS.NO_OF_EMPLOYEE")} </label>
                                            <input type="text" className="form-control" name="noEmployee"
                                                onChange={(e) => handleChange(e)} value={lead?.noEmployee} />
                                            {errors.noEmployee && <p className="text-danger">{errors.noEmployee}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Phone
                                            </label>
                                            <input type="text" className="form-control" name="phone"
                                                onChange={(e) => handleChange(e)} value={lead?.phone} />
                                            {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("TITLE.LEADS.RATING")}
                                            </label>
                                            <Select className="select" options={rating} styles={customStyles}
                                                value={rating?.find((item: any) => item.value === lead?.rating?.leadRatingId)}
                                                name="source"
                                                onChange={e => handleChange(e, 'gender')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                                        <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("TITLE.LEADS.ADDRESS_INFORMATION")}
                                    </span>
                                </div>
                                {
                                    listOpen.address &&
                                    <>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <span className="col-md-12">Address</span>
                                                <div className="col-md-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">Street</label>
                                                        <textarea className="form-control" name="street"
                                                            onChange={(e) => handleChangeAddress(e)} value={lead?.addressInfor?.street} >
                                                        </textarea>
                                                        {errors.street && <p className="text-danger">{errors.street}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">City</label>
                                                        <input type="text" className="form-control" name="city"
                                                            onChange={(e) => handleChangeAddress(e)} value={lead?.addressInfor?.city} />
                                                        {errors.city && <p className="text-danger">{errors.city}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">State</label>
                                                        <input type="text" className="form-control" name="province"
                                                            onChange={(e) => handleChangeAddress(e)} value={lead?.addressInfor?.province} />
                                                        {errors.province && <p className="text-danger">{errors.province}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-8">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">Zip/Postal Code</label>
                                                        <input type="text" className="form-control" name="postalCode"
                                                            onChange={(e) => handleChangeAddress(e)} value={lead?.addressInfor?.postalCode} />
                                                        {errors.postalCode && <p className="text-danger">{errors.postalCode}</p>}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">Country</label>
                                                        <input type="text" className="form-control" name="country"
                                                            onChange={(e) => handleChangeAddress(e)} value={lead?.addressInfor?.country} />
                                                        {errors.country && <p className="text-danger">{errors.country}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={() => handleUpdate()}
                                    >
                                        {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
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