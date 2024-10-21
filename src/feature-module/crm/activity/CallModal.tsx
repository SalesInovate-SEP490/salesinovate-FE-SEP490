import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { StylesConfig } from "react-select";
import Modal from 'react-modal';
import { getContacts } from "../../../services/Contact";
import { getAccounts } from "../../../services/account";
import { getListLeads } from "../../../services/lead";
import { getListEventPriority, getListSubject } from "../../../services/event";
import { toast } from "react-toastify";
import { createLogCall, getDetailLogCall, getListStatusLogCall, patchLogCall } from "../../../services/logCall";
import Swal from "sweetalert2";
import { getOpportunity } from "../../../services/opportunities";
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

const typeOptions = [
    { value: 'contacts', label: 'Contact' },
    { value: 'leads', label: 'Lead' },
]

const typeOptions2 = [
    { value: 'accounts', label: 'Account' },
    { value: 'oppotunities', label: 'Opportunity' },
]

const CallModal: React.FC<{
    isOpen: boolean;
    closeModal: () => void;
    isEdit?: any;
    id?: any;
    getList?: any;
    initType?: any;
    currentId?: any;
}> = ({ isOpen, closeModal, isEdit, id, getList, initType, currentId }) => {
    const [logCall, setLogCall] = useState<any>({});
    const [type, setType] = useState<any>(initType ? (initType === 'contacts' ? 'contacts' : 'leads') : 'contacts');
    const [typeSub, setTypeSub] = useState<any>(initType ? (initType === 'accounts' ? 'accounts' : 'oppotunities') : 'accounts');
    const [listOpen, setListOpen] = useState<any>({
        users: [],
        types: [],
        reminders: [],
        contacts: [],
        accounts: [],
        leads: [],
        priority: [{ value: 2, label: 'Medium' }, { value: 1, label: 'High' }, { value: 3, label: 'Low' }],
        opportunities: [],
        status: []
    })
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    const clearData = () => {
        setLogCall({});
        setErrors({});
    }

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setLogCall((prev: any) => {
                return {
                    ...prev,
                    relatedTo: [userId]
                }
            });
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            getListType();
            getListContact();
            getListAccount();
            getListLead();
            getListOpportunities();
            getListPriority();
            getListStatus();
        } else {
            clearData();
        }
        if (isOpen && isEdit) {
            getDetailLogCall(id)
                .then(response => {
                    if (response.code === 1) {
                        setLogCall({
                            ...response?.data,
                            type: response?.data?.eventSubject?.eventSubjectId,
                        });
                        setType(response?.data?.leadsResponse ? 'leads' : 'contacts');
                        setTypeSub(response?.data?.accountResponse ? 'accounts' : 'oppotunities');
                        if (response?.data?.leadsResponse) {
                            setLogCall((prev: any) => {
                                return {
                                    ...prev,
                                    lead: {
                                        leadId: response?.data?.leadsResponse?.leadId
                                    }
                                }
                            });
                        }
                        if (response?.data?.contactResponse) {
                            setLogCall((prev: any) => {
                                return {
                                    ...prev,
                                    contact: response?.data?.contactResponses.map((item: any) => item?.contactId)
                                }
                            });
                        }
                        if (response?.data?.accountResponse) {
                            setLogCall((prev: any) => {
                                return {
                                    ...prev,
                                    account: {
                                        accountId: response?.data?.accountResponse?.accountId
                                    }
                                }
                            });
                        }
                        if (response?.data?.opportunityResponse) {
                            setLogCall((prev: any) => {
                                return {
                                    ...prev,
                                    opportunity: {
                                        opportunityId: response?.data?.opportunityResponse?.opportunityId
                                    }
                                }
                            });
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        if (currentId) {
            switch (initType) {
                case 'contacts':
                    setLogCall((prev: any) => {
                        return {
                            ...prev,
                            contact: [parseInt(currentId)]
                        }
                    });
                    break;
                case 'leads':
                    setLogCall((prev: any) => {
                        return {
                            ...prev,
                            lead: {
                                leadId: parseInt(currentId)
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
            switch (initType) {
                case 'accounts':
                    setLogCall((prev: any) => {
                        return {
                            ...prev,
                            account: {
                                accountId: parseInt(currentId)
                            }
                        }
                    });
                    break;
                case 'oppotunities':
                    setLogCall((prev: any) => {
                        return {
                            ...prev,
                            opportunity: {
                                opportunityId: parseInt(currentId)
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }, [isOpen]);

    const getListType = () => {

        getListSubject()
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            types: response?.data?.map((item: any) => {
                                return {
                                    value: item?.eventSubjectId,
                                    label: item?.eventSubjectContent
                                }
                            })
                        }
                    });
                    // if is edit = false, default value = 2
                    if (!isEdit) {
                        setLogCall((prev: any) => {
                            return {
                                ...prev,
                                type: 2
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.log(error);
                // Not have api now, hard code 
                const types = [
                    { eventSubJectId: 1, eventSubjectContent: 'Email' },
                    { eventSubJectId: 2, eventSubjectContent: 'Call' },
                    { eventSubJectId: 3, eventSubjectContent: 'Meeting' },
                    { eventSubJectId: 4, eventSubjectContent: 'Send Letter/Quote' },
                    { eventSubJectId: 5, eventSubjectContent: 'Other' },
                ];
                setListOpen((prev: any) => {
                    return {
                        ...prev,
                        types: types.map((item: any) => {
                            return {
                                value: item?.eventSubJectId,
                                label: item?.eventSubjectContent
                            }
                        })
                    }
                });
            });
    }

    const getListContact = () => {
        const param = {
            currentPage: 0,
            perPage: 100,
        }
        getContacts(param)
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            contacts: response?.data?.items?.map((item: any) => {
                                return {
                                    value: item?.contactId,
                                    label: item?.firstName + " " + item?.lastName
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {

            })
    }

    const getListAccount = () => {
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
        const param = {
            currentPage: 0,
            perPage: 1000,
        }
        getListLeads(param)
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            leads: response?.data?.items?.map((item: any) => {
                                return {
                                    value: item?.leadId,
                                    label: item?.firstName + " " + item?.lastName
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {

            })
    }

    const getListOpportunities = () => {
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
            .catch((error: any) => {
                console.log(error);
            });
    }

    const getListPriority = () => {
        getListEventPriority()
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            priority: response?.data?.map((item: any) => {
                                return {
                                    value: item?.eventPriorityId,
                                    label: item?.eventPriorityContent
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            })
    }

    const getListStatus = () => {
        getListStatusLogCall()
            .then(response => {
                if (response.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            status: response?.data?.map((item: any) => {
                                return {
                                    value: item?.eventStatusId,
                                    label: item?.eventStatusContent
                                }
                            })
                        }
                    });
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            })
    }

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value } = e.target;
            setLogCall({
                ...logCall,
                [name]: value
            });
        } else {
            if (nameChild) {
                setLogCall({
                    ...logCall,
                    [name]: {
                        [nameChild]: e?.value,
                        name: e?.label
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setLogCall({
                    ...logCall,
                    [name]: e?.value
                });
            }
        }
    };

    const handleChangeArray = (e: any, name?: any) => {
        setLogCall({
            ...logCall,
            [name]: e?.map((item: any) => item?.value)
        });
        console.log("Event: ", logCall);
    }

    const validate = () => {
        const errors: any = {};

        if ((logCall?.account?.accountId || logCall?.opportunity?.opportunityId) && logCall?.lead?.leadId) {
            errors.account = t("EVENT.LEAD_ACCOUNT_ERROR");
        }
        if (!logCall?.type) {
            errors.type = t("MESSAGE.ERROR.REQUIRED");
        }
        console.log("Event: ", logCall);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        if (validate()) {
            const data: any = {
                eventSubject: logCall?.type,
                logCallName: logCall?.logCallName,
                logCallComment: logCall?.logCallComment,
            }
            if (logCall?.lead?.leadId) {
                data.logCallLeadsDTO = {
                    leadId: logCall?.lead?.leadId
                }
            }
            if (logCall?.contact?.length > 0) {
                if (logCall?.contact?.length > 0)
                    data.logCallContactDTOS = [
                        ...logCall?.contact?.map((item: any) => {
                            return {
                                contactId: item
                            }
                        })
                    ]
            }
            if (logCall?.account?.accountId) {
                data.logCallAccountDTO = {
                    accountId: logCall?.account?.accountId
                }
            }
            if (logCall?.opportunity?.opportunityId) {
                data.logCallOpportunityDTO = {
                    opportunityId: logCall?.opportunity?.opportunityId
                }
            }
            Swal.showLoading();
            if (isEdit) {
                data.eventPriority = logCall?.priority;
                data.eventStatus = logCall?.status;
                patchLogCall(id, data)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success(t("MESSAGE.UPDATE_SUCCESS"));
                            closeModal();
                            if (getList) getList();
                        }
                    })
                    .catch(error => {
                        Swal.close();
                        console.log(error);
                    })
            } else
                createLogCall(data)
                    .then(response => {
                        Swal.close();
                        if (response.code === 1) {
                            toast.success(t("MESSAGE.CREATE_SUCCESS"));
                            closeModal();
                            if (getList) getList();
                        }
                    })
                    .catch(error => {
                        Swal.close();
                        console.log(error);
                    })
        }
    }

    const changeType = (e: any) => {
        setType(e?.value);
        const label = type === 'leads' ? 'lead' : 'contact';
        setLogCall((prev: any) => {
            return {
                ...prev,
                [label]: []
            }
        });
    }

    const changeSubType = (e: any) => {
        setTypeSub(e?.value);
        const label = typeSub === 'accounts' ? 'account' : 'opportunity';
        setLogCall((prev: any) => {
            return {
                ...prev,
                [label]: []
            }
        });
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
                    {isEdit ? t("LABEL.ACTIVITY.UPDATE_LOG_CALL") : t("LABEL.ACTIVITY.CREATE_LOG_CALL")}
                </h4>
            </div>
            <div className="modal-body">
                <div className="row mb-1">
                    <div className="col-md-12">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">
                                    {t("EVENT.SUBJECT")} <span className="text-danger">*</span>
                                </label>
                            </div>
                            <Select
                                className="select"
                                options={listOpen?.types}
                                styles={customStyles}
                                name="type"
                                value={listOpen?.types?.find((item: any) => item.value === logCall?.type)}
                                onChange={(e) => handleChange(e, "type")}
                                isDisabled={!isEdit}
                            />
                            {errors.type && <p className="text-danger">{errors.type}</p>}
                        </div>
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">{t("EVENT.LOG_CALL_NAME")}</label>
                            </div>
                            <input
                                className="form-control"
                                name="logCallName"
                                value={logCall?.logCallName}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">{t("EVENT.CONTENT")}</label>
                            </div>
                            <input
                                className="form-control"
                                name="logCallComment"
                                value={logCall?.logCallComment}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">{t("EVENT.NAME")}</label>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <Select
                                        className="select"
                                        options={typeOptions}
                                        styles={customStyles}
                                        name="type"
                                        value={typeOptions?.find((item: any) => item.value === type)}
                                        onChange={(e) => changeType(e)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    {
                                        type === 'leads' ?
                                            <Select
                                                className="select"
                                                options={listOpen?.leads}
                                                styles={customStyles}
                                                name="lead"
                                                value={listOpen?.leads?.find((item: any) => item.value === logCall?.lead?.leadId)}
                                                onChange={(e) => handleChange(e, "lead", "leadId")}
                                            />
                                            :
                                            <Select
                                                className="select"
                                                options={listOpen?.contacts}
                                                styles={customStyles}
                                                name="contact"
                                                isMulti={true}
                                                value={listOpen?.contacts.filter((item: any) => logCall?.contact?.includes(item.value))}
                                                onChange={(e) => handleChangeArray(e, "contact")}
                                            />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">{t("EVENT.RELATED_TO")}</label>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <Select
                                        className="select"
                                        options={typeOptions2}
                                        styles={customStyles}
                                        name="type"
                                        value={typeOptions2?.find((item: any) => item.value === typeSub)}
                                        onChange={(e: any) => changeSubType(e)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    {
                                        typeSub === 'accounts' ?
                                            <Select
                                                className="select"
                                                options={listOpen?.accounts}
                                                styles={customStyles}
                                                name="account"
                                                value={logCall?.account ? listOpen?.accounts?.find((item: any) => item.value === logCall?.account?.accountId) : undefined}
                                                onChange={(e) => handleChange(e, "account", "accountId")}
                                                isClearable={true}
                                            />
                                            :
                                            <Select
                                                className="select"
                                                options={listOpen?.opportunities}
                                                styles={customStyles}
                                                name="opportunity"
                                                value={logCall?.opportunity ? listOpen?.opportunities?.find((item: any) => item.value === logCall?.opportunity?.opportunityId) : undefined}
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
                {
                    isEdit &&
                    <div className="row mb-1">
                        <div className='col-ms-12 label-detail'>
                            <span>
                                {t("LABEL.ACTIVITY.ADDITIONAL_INFORMATION")}
                            </span>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.PRIORITY")}</label>
                                </div>
                                <Select
                                    className="select"
                                    options={listOpen?.priority}
                                    styles={customStyles}
                                    name="priority"
                                    value={listOpen?.priority.find((item: any) => item.value === logCall?.priority)}
                                    onChange={(e) => handleChange(e, "priority")}
                                />
                            </div>
                        </div>
                        {/* Status */}
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("LABEL.LEADS.STATUS")}</label>
                                </div>
                                <Select
                                    className="select"
                                    options={listOpen?.status}
                                    styles={customStyles}
                                    name="status"
                                    value={listOpen?.status.find((item: any) => item.value === logCall?.status)}
                                    onChange={(e) => handleChange(e, "status")}
                                />
                            </div>
                        </div>
                    </div>
                }

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

export default CallModal;
