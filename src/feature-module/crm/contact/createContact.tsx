import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createContact, getContactById, patchContact } from "../../../services/Contact";
import { getSalutationList } from "../../../services/lead";
import { getAccounts } from "../../../services/account";
import { initContact } from "./data";
import { Contact } from "./type";
import { useSelector } from "react-redux";

export const CreateContact: React.FC<{
    setShowPopup?: any, id?: any, getContactDetail?: any,
    showPopup?: any, getContact?: any, isEdit?: any,
    accountId?: any
}> = ({ getContact, setShowPopup, showPopup, isEdit, id, getContactDetail, accountId }) => {
    const [title, setTitle] = useState<any>("");
    const [contact, setContact] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();
    const [listOpen, setListOpen] = useState<any>({
        address: true,
        additional: true,
        system: true
    });
    const [salutation, setSalutation] = useState<any>(null);
    const [listSelect, setListSelect] = useState<{
        account?: { value: number; label: string }[];
    }>({
        account: []
    });
    const userName = useState(useSelector((state: any) => state.userName));

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

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    useEffect(() => {
        getAccounts(1, 100)
            .then(response => {
                if (response.code === 1) {
                    setListSelect(prevState => ({
                        ...prevState,
                        account: response.data.items.map((item: any) => ({
                            value: item.accountId,
                            label: item.accountName
                        }))
                    }));
                }
            })
            .catch(err => {
                // Handle error
            });
        getSalutationList()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.leadSalutionId,
                        label: item.leadSalutionName
                    }
                })
                setSalutation(data);
            })
            .catch((err) => {
                console.log(err);
            });
        if (isEdit) {
            setTitle(t("CONTACT.EDIT_CONTACT"));
            getContactById(id)
                .then((res: any) => {
                    const data = res.data;
                    setContact(data);
                    console.log("data check: ", data)
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } else {
            setTitle(t("CONTACT.CREATE_CONTACT"));
        }
    }, [])

    useEffect(() => {
        if (isEdit && showPopup) {
            getContactById(id)
                .then((res: any) => {
                    const data = res.data;
                    setContact(data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
    }, [id])

    useEffect(() => {
        if (accountId) {
            setContact((prev: any) => ({
                ...prev,
                accountId: parseInt(accountId)
            }));
        }
    }, [accountId])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            const formattedValue = (name === 'createDate' || name === 'editDate') ? formatDate(value) : value;
            setContact({
                ...contact,
                [name]: formattedValue
            });
        } else {
            if (nameChild) {
                setContact({
                    ...contact,
                    [name]: {
                        [nameChild]: e.value
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setContact({
                    ...contact,
                    [name]: e.value
                });
            }
        }
    };

    const handleChangeAddress = (e: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setContact({
                ...contact,
                addressInformation: {
                    ...contact.addressInformation,
                    [name]: value
                }
            });
        }
    }

    const handleChangeSalutation = (selectedOption: any) => {
        setContact({
            ...contact,
            contactSalution: {
                leadSalutionId: selectedOption.value,
                leadSalutionName: selectedOption.label
            },
            contactSalutionId: selectedOption.value
        });
    };

    const validate = () => {
        let tempErrors: { lastName?: string; phone?: string; email?: string } = {};
        if (!contact.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
        if (!contact.phone) tempErrors.phone = t("MESSAGE.ERROR.REQUIRED");
        if (!contact.email) tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        // Check phone pattern vietnamese : 10 digits, start with 0, not required, after 0 is 3,5,7,8,9
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (contact?.phone && !phoneRegex.test(contact?.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE_VIETNAMESE");
        }
        // Check email pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (contact?.email && !emailRegex.test(contact.email)) {
            tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(showPopup);
    };

    const handleUpdate = () => {
        if (validate()) {
            const contactData = {
                contactId: contact?.contactId,
                accountId: contact?.accountId,
                userId: contact?.userId,
                firstName: contact?.firstName,
                lastName: contact?.lastName,
                middleName: contact?.middleName,
                contactSalutionId: contact?.contactSalution?.leadSalutionId,
                addressInformation: {
                    addressInformationId: contact?.addressInformation?.addressInformationId,
                    street: contact?.addressInformation?.street,
                    city: contact?.addressInformation?.city,
                    province: contact?.addressInformation?.province,
                    postalCode: contact?.addressInformation?.postalCode,
                    country: contact?.addressInformation?.country
                },
                suffix: contact?.suffix,
                title: contact?.title,
                email: contact?.email,
                phone: contact?.phone,
                department: contact?.department,
                mobile: contact?.mobile,
                report_to: contact?.report_to,
                fax: contact?.fax,
            }
            if (isEdit) {
                patchContact(contactData, id)
                    .then(response => {
                        console.log("Response:", response);
                        if (response.code === 1) {
                            toast.success("Update Contact successfully!");
                            setShowPopup(false);
                            getContactDetail();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                createContact(contactData)
                    .then(response => {

                        if (response.code === 1) {
                            toast.success("Create Contact successfully!");
                            setContact({
                                firstName: "",
                                lastName: "",
                                middleName: "",
                                report_to: 0,
                                contactSalutionId: 0,
                                addressInformation: {
                                    addressInformationId: 0,
                                    street: "",
                                    city: "",
                                    province: "",
                                    postalCode: "",
                                    country: ""
                                },
                                suffix: "",
                                title: "",
                                email: "",
                                phone: "",
                                department: "",
                                mobile: "",
                                fax: "",
                                createdBy: "",
                                createDate: "2024-07-15T14:24:19.917Z",
                                editDate: "2024-07-15T14:24:19.917Z",
                                editBy: ""
                            })
                            setShowPopup(false);
                            getContact(1, 10);
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
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{title}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONTACT.ACCOUNT_NAME")}
                                            </label>
                                            <Select
                                                className="select"
                                                options={listSelect?.account}
                                                styles={customStyles}
                                                value={contact?.accountId ? listSelect?.account?.find((item: any) => item.value === contact?.accountId) : null}
                                                name="account"
                                                onChange={e => handleChange(e, 'account', 'accountId')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CONTACT.CONTACT_OWNER")}
                                            </label>
                                            <div className="form-wrap w-100 d-flex align-items-center">
                                                <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                                <div>
                                                    <span style={{ display: 'block', fontWeight: 'bold' }}>
                                                        {userName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <div className="row">
                                                    <div className="col-md-12 mt-4">
                                                        <label className="col-form-label">
                                                            {t("CONTACT.SALUTATION_NAME")}
                                                        </label>
                                                        <Select
                                                            className="select"
                                                            options={salutation}
                                                            styles={customStyles}
                                                            value={salutation?.find((item: any) => item.value === contact?.contactSalution?.leadSalutionId)}
                                                            name="leadSalutionName"
                                                            onChange={handleChangeSalutation}
                                                        />
                                                    </div>
                                                    <div className="col-md-12 mt-4">
                                                        <label className="col-form-label">
                                                            {t("CONTACT.FIRST_NAME")}
                                                        </label>
                                                        <input type="text" className="form-control" name="firstName"
                                                            onChange={(e) => handleChange(e)} value={contact?.firstName} />
                                                    </div>
                                                    <div className="col-md-12 mt-4">
                                                        <label className="col-form-label">
                                                            {t("CONTACT.LAST_NAME")} <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" name="lastName"
                                                            onChange={(e) => handleChange(e)} value={contact?.lastName} />

                                                        {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                                                    </div>
                                                    <div className="col-md-12 mt-4">
                                                        <label className="col-form-label">
                                                            {t("CONTACT.MIDDLE_NAME")}
                                                        </label>
                                                        <input type="text" className="form-control" name="middleName"
                                                            onChange={(e) => handleChange(e)} value={contact?.middleName} />
                                                    </div>
                                                    <div className="col-md-12 mt-4">
                                                        <label className="col-form-label">
                                                            {t("CONTACT.SUFFIX")}
                                                        </label>
                                                        <input type="text" className="form-control" name="suffix"
                                                            onChange={(e) => handleChange(e)} value={contact?.suffix} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTACT.EMAIL")}  <span className="text-danger">*</span>
                                                </label>
                                                <input type="email" className="form-control" name="email"
                                                    onChange={(e) => handleChange(e)} value={contact?.email} />
                                                {errors.email && <p className="text-danger">{errors.email}</p>}
                                            </div>
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    {t("CONTACT.TITLE")}
                                                </label>
                                                <input type="text" className="form-control" name="title"
                                                    onChange={(e) => handleChange(e)} value={contact?.title} />
                                            </div>
                                            <div className="form-wrap">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label className="col-form-label">
                                                        {t("CONTACT.PHONE")}  <span className="text-danger">*</span>
                                                    </label>
                                                </div>
                                                <input type="number" className="form-control" name="phone"
                                                    onChange={(e) => handleChange(e)} value={contact?.phone} />
                                                {errors.phone && <p className="text-danger">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-ms-12 label-detail'>
                                        <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                                            <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                            {t("CONTACT.ADDRESS_INFORMATION")}
                                        </span>
                                    </div>
                                    {
                                        listOpen.address &&
                                        <>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.STREET")}</label>
                                                            <textarea className="form-control" name="street"
                                                                onChange={(e) => handleChangeAddress(e)} value={contact?.addressInformation?.street} >
                                                            </textarea>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.CITY")}</label>
                                                            <input type="text" className="form-control" name="city"
                                                                onChange={(e) => handleChangeAddress(e)} value={contact?.addressInformation?.city} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.PROVINCE")}</label>
                                                            <input type="text" className="form-control" name="province"
                                                                onChange={(e) => handleChangeAddress(e)} value={contact?.addressInformation?.province} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.POSTAL_CODE")}</label>
                                                            <input type="text" className="form-control" name="postalCode"
                                                                onChange={(e) => handleChangeAddress(e)} value={contact?.addressInformation?.postalCode} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.COUNTRY")}</label>
                                                            <input type="text" className="form-control" name="country"
                                                                onChange={(e) => handleChangeAddress(e)} value={contact?.addressInformation?.country} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className='col-ms-12 label-detail'>
                                        <span onClick={() => setListOpen({ ...listOpen, additional: !listOpen.additional })}>
                                            <i className={!listOpen.additional ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                            {t("CONTACT.ADDITIONAL_INFORMATION")}
                                        </span>
                                    </div>
                                    {
                                        listOpen.additional &&
                                        <>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.MOBILE")}</label>
                                                            <input type="number" className="form-control" name="mobile"
                                                                onChange={(e) => handleChange(e)} value={contact?.mobile} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.REPORT_TO")}</label>
                                                            <input type="text" className="form-control" name="report_to"
                                                                onChange={(e) => handleChange(e)} value={contact?.report_to} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.FAX")}</label>
                                                            <input type="text" className="form-control" name="fax"
                                                                onChange={(e) => handleChange(e)} value={contact?.fax} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">{t("CONTACT.DEPARTMENT")}</label>
                                                            <input type="text" className="form-control" name="department"
                                                                onChange={(e) => handleChange(e)} value={contact?.department} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    <div className="submit-button text-end">
                                        <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                            {t("CONTACT.CANCEL")}
                                        </Link>
                                        <Link
                                            to="#"
                                            className="btn btn-primary"
                                            onClick={() => handleUpdate()}
                                        >
                                            {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
