import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { StylesConfig } from "react-select";
import Modal from 'react-modal';
import { getContactById, getContacts } from "../../../services/Contact";
import { getAccounts } from "../../../services/account";
import { getLeadDetail, getListLeads } from "../../../services/lead";
import { createEvent, getDetailEvent, patchEvent } from "../../../services/event";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { formats, modules } from "../../../core/data/quill/format";
import { getOpportunity } from "../../../services/opportunities";
import { getUserById } from "../../../services/user";
import { createLogEmail } from "../../../services/logEmail";
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

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxWidth: '1200px', // Set a maximum width
        height: 'auto', // Adjust the height as needed
    },
};

const typeOptionsRelated = [
    { value: 'accounts', label: 'Account' },
    { value: 'opportunities', label: 'Opportunity' },
]

const MailModal: React.FC<{
    isOpen: boolean;
    closeModal: () => void;
    isEdit?: any;
    id?: any;
    getList?: any;
    getDetail?: any;
    initType?: any;
}> = ({ isOpen, closeModal, isEdit, id, getList, getDetail, initType }) => {
    const [mail, setMail] = useState<any>({});
    const [type, setType] = useState<any>(initType === "accounts" ? initType : "opportunities");
    const [listOpen, setListOpen] = useState<any>({
        contacts: [],
        accounts: [],
        leads: [],
        opportunities: [],
        emailFrom: []
    })
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setMail((prev: any) => {
                return {
                    ...prev,
                    relatedTo: [userId]
                }
            });
        }
    }, [])

    const clearData = () => {
        setMail({});
        setErrors({});
    }

    useEffect(() => {
        if (isOpen) {
            getListContact();
            getListAccount();
            getListLead();
            getListOpportunity();
            getUser();
            setType(initType);
        }else{
            clearData();
        }
    }, [isOpen]);

    const getUser = () => {
        const userId = localStorage.getItem('userId');
        getUserById(userId)
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            emailFrom: [{
                                value: response?.data?.firstName + " " + response?.data?.lastName,
                                label: response?.data?.email
                            }]
                        }
                    });
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            });
    }

    const getListContact = () => {
        if (initType === "contacts" && id)
            getContactById(id)
                .then(response => {
                    if (response.code === 1) {
                        setMail((prev: any) => {
                            return {
                                ...prev,
                                leadsContact: {
                                    contactId: parseInt(id),
                                    email: response?.data?.email,
                                    name: response?.data?.firstName + " " + response?.data?.lastName,
                                    type: "Contact"
                                },
                                to: [response?.data?.email]
                            }
                        });
                    }
                })
                .catch(error => {

                })
    }

    const getListAccount = () => {
        if (initType === "accounts" && id) {
            setMail((prev: any) => {
                return {
                    ...prev,
                    account: {
                        accountId: parseInt(id)
                    },
                    accountId: parseInt(id)
                }
            });
        }
        getAccounts(0, 100)
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            accounts: response?.data?.items?.map((item: any) => {
                                return {
                                    value: item?.accountId,
                                    label: item?.accountName
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {

            })
    }

    const getListLead = () => {
        if (initType === "leads" && id) {
            getLeadDetail(id)
                .then(response => {
                    if (response.code === 1) {
                        setMail((prev: any) => {
                            return {
                                ...prev,
                                leadsContact: {
                                    leadId: parseInt(id),
                                    email: response?.data?.email,
                                    name: response?.data?.firstName + " " + response?.data?.lastName,
                                    type: "Lead"
                                },
                                to: [response?.data?.email]
                            }
                        });
                    }
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        }
    }

    const getListOpportunity = () => {
        if (initType === "opportunities" && id) {
            setMail((prev: any) => {
                return {
                    ...prev,
                    opportunity: {
                        opportunityId: parseInt(id)
                    },
                    opportunityId: parseInt(id)
                }
            });
        }
        const param = {
            currentPage: 0,
            perPage: 100,
        }
        getOpportunity(param)
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            opportunities: response?.data?.items?.map((item: any) => {
                                return {
                                    value: item?.opportunityId,
                                    label: item?.opportunityName
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {

            })
    }

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setMail({
                ...mail,
                [name]: value
            });
        } else {
            if (nameChild) {
                setMail({
                    ...mail,
                    [name]: {
                        [nameChild]: e?.value,
                        name: e?.label
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setMail({
                    ...mail,
                    [name]: e?.value
                });
            }
        }
    };

    const validate = () => {
        const errors: any = {};
        // email required
        if (!mail?.to?.length) {
            errors.to = "To is required";
        }
        // check email regex
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        console.log("mail?.to", mail?.to);
        if (mail?.to?.length) {
            mail?.to?.map((item: any, index: any) => {
                // if (!regex.test(item) && (index !== 0 && !mail?.leadsContact)) {
                if (mail?.leadsContact && index === 0) {

                } else if (!regex.test(item)) {
                    errors.to = "Existed invalid email. Please check again!";
                }
            });
        }
        // if mail.To have only 1 email and it is lead or contact, check email
        if (mail?.to?.length === 1 && mail?.leadsContact) {
            if (!mail?.leadsContact?.email) {
                errors.to = mail?.leadsContact?.type === "Lead" ? "Lead email is not existed" : "Contact email is not existed";
            } else if (!regex.test(mail?.leadsContact?.email)) {
                errors.to = "Existed invalid email. Please check again!";
            }
        }

        // bcc
        if (mail?.bcc?.length) {
            mail?.bcc?.map((item: any) => {
                if (!regex.test(item)) {
                    errors.bcc = "Existed invalid email. Please check again!";
                }
            });
        }
        if (mail?.leadsContact?.type === "Lead" && (mail?.account?.accountId || mail?.opportunity?.opportunityId)) {
            errors.relatedTo = t("EVENT.LEAD_ACCOUNT_ERROR");
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validate()) {
            const mailLog: any = {
                emailFrom: listOpen?.emailFrom[0]?.label,
                emailTo: mail?.to?.join(",,"),
                emailSubject: mail?.subject,
                emailContent: mail?.htmlContent,
            }
            if (mail?.account?.accountId) {
                mailLog.logEmailAccountDTO = {
                    accountId: mail?.account?.accountId
                }
            }
            if (mail?.opportunity?.opportunityId) {
                mailLog.logEmailOpportunityDTO = {
                    opportunityId: mail?.opportunity?.opportunityId
                }
            }
            if (mail?.leadsContact?.contactId) {
                const emailList = mail?.to;
                emailList[0] = mail?.leadsContact?.email;
                mailLog.emailTo = emailList.join(",,");
                mailLog.logEmailContactDTOs = [{
                    contactId: mail?.leadsContact?.contactId
                }]
            }

            if (mail?.leadsContact?.leadId) {
                const emailList = mail?.to;
                emailList[0] = mail?.leadsContact?.email;
                mailLog.emailTo = emailList.join(",,");
                mailLog.logEmailLeadsDTO = {
                    leadId: mail?.leadsContact?.leadId
                }
            }
            createLogEmail(mailLog)
                .then(response => {
                    if (response.code === 1) {
                        if (getList) getList();
                        toast.success("Send mail successfully!");
                        closeModal();
                    } else {
                        toast.error(response.message);
                    }
                })
                .catch(error => {
                    console.log("Error: ", error);
                });
        }
    }

    const handleChangeListEmail = (e: any, label: any, isRemoveLeadsContact?: any) => {
        setMail((prev: any) => {
            return {
                ...prev,
                [label]: e,
                leadsContact: isRemoveLeadsContact ? undefined : prev?.leadsContact
            }
        });
    }

    const changeType = (e: any) => {
        setType(e.value);
        setMail((prev: any) => {
            return {
                ...prev,
                relatedTo: []
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Update Status Modal"
        >
            <div className="modal-header border-0 m-0 justify-content-center text-center mb-1">
                <h4>
                    {isEdit ? t("EMAIL.SEND_MAIL") : t("EMAIL.SEND_MAIL")}
                </h4>
            </div>
            <div className="modal-body">
                <div className="row mb-1">
                    <div className="col-md-12">
                        {/* //  Related To Errors */}
                        {errors.relatedTo && <p className="text-danger">{errors.relatedTo}</p>}
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">
                                    {t("EMAIL.FROM")} <span className="text-danger">*</span>
                                </label>
                            </div>
                            <Select
                                className="select"
                                options={listOpen?.emailFrom}
                                styles={customStyles}
                                name="from"
                                value={listOpen?.emailFrom ? listOpen?.emailFrom[0] : undefined}
                            />
                        </div>
                        {/* To */}
                        <div className="col-md-12">
                            <EmailInput handleUpdate={handleChangeListEmail} label="to" leadContact={mail?.leadsContact} />
                            {errors.to && <p className="text-danger">{errors.to}</p>}
                        </div>
                        {/* Bcc */}
                        <div className="col-md-12">
                            {/* <div style={{ textAlign: 'left' }}>
                                <label className="label-text">
                                    {t("EMAIL.BCC")}
                                </label>
                            </div>
                            <input
                                className="form-control"
                                name="bcc"
                                value={event?.bcc}
                                onChange={(e) => handleChange(e)}
                            /> */}
                            <EmailInput handleUpdate={handleChangeListEmail} label="bcc" />
                            {errors.bcc && <p className="text-danger">{errors.bcc}</p>}
                        </div>
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">
                                    {t("EVENT.SUBJECT")} <span className="text-danger">*</span>
                                </label>
                            </div>
                            <input
                                className="form-control"
                                name="subject"
                                value={mail?.subject}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-md-12">
                            <div className="form-wrap">
                                <label className="col-form-label">
                                    {t("EVENT.CONTENT")}
                                </label>
                                <ReactQuill
                                    modules={modules}
                                    formats={formats}
                                    value={mail?.htmlContent}
                                    onChange={(e) => handleChange({ target: { name: "htmlContent", value: e } })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">{t("EVENT.RELATED_TO")}</label>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <Select
                                        className="select"
                                        options={typeOptionsRelated}
                                        styles={customStyles}
                                        name="type"
                                        value={typeOptionsRelated?.find((item: any) => item.value === type)}
                                        onChange={(e: any) => changeType(e)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    {
                                        type === 'accounts' ?
                                            <Select
                                                className="select"
                                                options={listOpen?.accounts}
                                                styles={customStyles}
                                                name="account"
                                                value={mail?.account ? listOpen?.accounts?.find((item: any) => item.value === mail?.account?.accountId) : undefined}
                                                onChange={(e) => handleChange(e, "account", "accountId")}
                                                isClearable={true}
                                            />
                                            :
                                            <Select
                                                className="select"
                                                options={listOpen?.opportunities}
                                                styles={customStyles}
                                                name="opportunity"
                                                value={mail?.opportunity ? listOpen?.opportunities?.find((item: any) => item.value === mail?.opportunity?.opportunityId) : undefined}
                                                onChange={(e) => handleChange(e, "opportunity", "opportunityId")}
                                                isClearable={true}
                                            />
                                    }
                                </div>
                            </div>
                            {errors.account && <p className="text-danger">{errors.account}</p>}
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 text-center modal-btn">
                    <button className="btn btn-light" onClick={closeModal}>
                        {t("ACTION.CANCEL")}
                    </button>
                    <button className="btn btn-danger" onClick={handleSubmit}>
                        {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MailModal;

const EmailInput: React.FC<{
    handleUpdate: (emailList: any, label: any, isFirst?: any) => void;
    label: any,
    leadContact?: any;
}> = ({ handleUpdate, label, leadContact }) => {
    const [email, setEmail] = useState<any>("");
    const [emailList, setEmailList] = useState<any>([]);

    const handleChange = (e: any) => {
        setEmail(e.target.value);
    };

    useEffect(() => {
        if (leadContact) {
            setEmailList([`(${leadContact?.type}) ${leadContact?.name}`]);
        }
    }, [leadContact])

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            const trimmedEmail = email.trim();
            // check duplicated email
            const isDuplicated = emailList.find((item: any) => item === email.trim());
            if (isDuplicated) {
                setEmail("");
                return;
            }
            if (email.trim()) {
                const updatedEmailList = [...emailList, trimmedEmail];
                setEmailList(updatedEmailList);
                setEmail("");
                handleUpdate(updatedEmailList, label);
            }
        }
    };

    const handleRemoveEmail = (indexToRemove: any) => {
        const updatedEmailList = emailList.filter((_: any, index: any) => index !== indexToRemove);
        setEmailList(updatedEmailList);
        handleUpdate(updatedEmailList, label, indexToRemove == 0);
    };

    return (
        <div className="col-md-12">
            <div style={{ textAlign: 'left', marginBottom: '5px' }}>
                <label className="label-text">
                    {label === "to" ?
                        <>
                            To <span className="text-danger">*</span>
                        </> : "BCC"}
                </label>
            </div>
            <div
                className="form-control"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    minHeight: '38px',
                    padding: '4px 8px',
                }}
            >
                {emailList.map((email: any, index: any) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#e1e1e1',
                            borderRadius: '15px',
                            padding: '5px 10px',
                            margin: '2px',
                        }}
                    >
                        <span>{email}</span>
                        <button
                            style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                marginLeft: '5px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                            onClick={() => handleRemoveEmail(index)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    style={{
                        flexGrow: 1,
                        border: 'none',
                        outline: 'none'
                    }}
                    name="to"
                    value={email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Handle the Enter key press
                    placeholder="Enter email and press Enter"
                />
            </div>
        </div>
    );
};

