import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../../services/user";
import { getContacts } from "../../../services/Contact";
import { getAccounts } from "../../../services/account";
import { getListLeads } from "../../../services/lead";
import { getListEventPriority, patchEvent } from "../../../services/event";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import DatePicker from 'react-datepicker';
import Swal from "sweetalert2";
import { getListStatusLogCall, patchLogCall } from "../../../services/logCall";

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

const typeOptions = [
    { value: 'contacts', label: 'Contact' },
    { value: 'leads', label: 'Lead' },
];


const typeOptions2 = [
    { value: 'accounts', label: 'Account' },
    { value: 'oppotunities', label: 'Opportunity' },
]

export const FixDetailLogCall: React.FC<{ data?: any; getDetail?: any, initType?: any }> = ({ data, getDetail, initType }) => {
    const [logCall, setLogCall] = useState<any>(data);
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
    const [listOpenSub, setListOpenSub] = useState<any>({
        edit: false,
        taskInformation: true,
        additionalInformation: true,
    });
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

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
        getListUser();
        getListType();
        getListReminder();
        getListContact();
        getListAccount();
        getListLead();
        getListPriority();
        getListStatus();

    }, [])

    useEffect(() => {
        if (data) {
            setType(data?.leadsResponse ? 'leads' : 'contacts');
            setTypeSub(data?.accountResponse?.length > 0 ? 'accounts' : 'oppotunities');
            setLogCall(data);
        }
    }, [data])

    const convertDateToString = (date: any) => {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const formattedDate = `${hours}:${minutes}, ${day}/${month}/${year}`;
        return formattedDate;
    }


    const getListUser = () => {
        getUsers()
            .then((res) => {
                if (res.code === 1) {
                    setListOpen((prev: any) => {
                        return {
                            ...prev,
                            users: res?.data?.map((item: any) => {
                                return {
                                    value: item?.userId,
                                    label: item?.userName
                                }
                            })
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getListType = () => {
        // Not have api now, hard code 
        const types = [
            { logCallSubJectId: 1, logCallSubjectContent: 'Email' },
            { logCallSubJectId: 2, logCallSubjectContent: 'Call' },
            { logCallSubJectId: 3, logCallSubjectContent: 'Meeting' },
            { logCallSubJectId: 4, logCallSubjectContent: 'Send Letter/Quote' },
            { logCallSubJectId: 5, logCallSubjectContent: 'Other' },
        ];
        setListOpen((prev: any) => {
            return {
                ...prev,
                types: types.map((item: any) => {
                    return {
                        value: item?.logCallSubJectId,
                        label: item?.logCallSubjectContent
                    }
                })
            }
        });
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

    const getListReminder = () => {
        const reminders = [
            { logCallReminderTimeId: 1, logCallReminderTimeContent: '0 minutes' },
            { logCallReminderTimeId: 2, logCallReminderTimeContent: '5 minutes' },
            { logCallReminderTimeId: 3, logCallReminderTimeContent: '10 minutes' },
            { logCallReminderTimeId: 4, logCallReminderTimeContent: '15 minutes' },
            { logCallReminderTimeId: 5, logCallReminderTimeContent: '30 minutes' },
            { logCallReminderTimeId: 6, logCallReminderTimeContent: '1 hour' },
            { logCallReminderTimeId: 7, logCallReminderTimeContent: '2 hours' },
            { logCallReminderTimeId: 8, logCallReminderTimeContent: '3 hours' },
            { logCallReminderTimeId: 9, logCallReminderTimeContent: '4 hours' },
            { logCallReminderTimeId: 10, logCallReminderTimeContent: '5 hours' },
            { logCallReminderTimeId: 11, logCallReminderTimeContent: '6 hours' },
            { logCallReminderTimeId: 12, logCallReminderTimeContent: '7 hours' },
            { logCallReminderTimeId: 13, logCallReminderTimeContent: '8 hours' },
            { logCallReminderTimeId: 14, logCallReminderTimeContent: '9 hours' },
            { logCallReminderTimeId: 15, logCallReminderTimeContent: '10 hours' },
            { logCallReminderTimeId: 16, logCallReminderTimeContent: '11 hours' },
            { logCallReminderTimeId: 17, logCallReminderTimeContent: '12 hours' },
            { logCallReminderTimeId: 18, logCallReminderTimeContent: '1 day' },
            { logCallReminderTimeId: 19, logCallReminderTimeContent: '2 days' },
            { logCallReminderTimeId: 20, logCallReminderTimeContent: '3 days' },
        ]

        setListOpen((prev: any) => {
            return {
                ...prev,
                reminders: reminders.map((item: any) => {
                    return {
                        value: item?.logCallReminderTimeId,
                        label: item?.logCallReminderTimeContent
                    }
                })
            }
        })
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
            perPage: 100,
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
            data.eventPriority = logCall?.priority;
            data.eventStatus = logCall?.status;
            console.log("Data: ", data, logCall);
            patchLogCall(logCall?.logCallId, data)
                .then(response => {
                    Swal.close();
                    if (response.code === 1) {
                        toast.success(t("MESSAGE.UPDATE_SUCCESS"));
                        setListOpen({ ...listOpen, edit: false });
                        if (getDetail) getDetail();
                    }
                })
                .catch(error => {
                    Swal.close();
                    console.log(error);
                })
        }
    }
    const handleEditClick = () => {
        setListOpen({ ...listOpen, edit: !listOpen.edit });
        setType(data?.leadEventResponse ? 'leads' : 'contacts');
        if (listOpen.edit)
            setLogCall({
                ...data?.data,
                start: new Date(data?.startTime),
                end: new Date(data?.endTime),
                relatedTo: data?.logCallAssigneeDTOS?.map((item: any) => item?.userId),
                type: data?.logCallSubject?.logCallSubjectId,
                account: data?.accountEventResponse?.length > 0 ? data?.accountEventResponse : undefined,
                contact: data?.contactEventResponses?.map((item: any) => item?.contactId),
                lead: data?.leadEventResponse,
                reminder: data?.logCallRemindTime?.logCallRemindTimeId,
                priority: data?.logCallPriority?.logCallPriorityId

            });
    };

    const getUserName = (userId: any) => {
        const user = listOpen?.users?.find((item: any) => item.value === userId);
        return user?.label;
    }

    const getName = () => {
        const contact = logCall?.contactResponses
            ? `<span class="link">${logCall?.contactResponses[0]?.contactName} </span> ${logCall?.contactResponses?.length > 1 ? '+' + (logCall?.contactResponses.length - 1) : ''}`
            : '';
        const lead = logCall?.leadsResponse ? logCall?.leadsResponse.leadName : '';
        return type === 'leads' ? `<span class="link">${lead}</div>` : `${contact}`;
    }

    return (
        <>
            {listOpen.edit ? (
                <>
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
                    <div className="submit-button text-end">
                        <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-light sidebar-close">
                            {t("ACTION.CANCEL")}
                        </Link>
                        <Link to="#" className="btn btn-primary" onClick={handleSubmit}>
                            {t("ACTION.UPDATE")}
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="row">
                        <div className='col-ms-12 label-detail' onClick={() => setListOpenSub({ ...listOpenSub, taskInformation: !listOpenSub.taskInformation })}>
                            <span>
                                <i className={!listOpenSub.taskInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                {t("LOG_CALL.TASK_INFORMATION")}
                            </span>
                        </div>
                        {listOpenSub.taskInformation &&
                            <>
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.SUBJECT")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span>{logCall?.eventSubject?.eventSubjectContent}</span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.TASK_SUB_TYPE")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span>{t("LOG_CALL.CALL")}</span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.ASSIGNED_TO")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span>{getUserName(logCall?.createdBy)}</span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                {/* // Name = leadsResponse or ContactResponse */}
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.NAME")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span dangerouslySetInnerHTML={{ __html: getName() }}></span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                {/* // Related to = accountResponse or opportunityResponse */}
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.RELATED_TO")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span>
                                                {logCall?.accountEventResponse?.accountName}
                                            </span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row detail-row">
                                        <label className="col-md-4">{t("EVENT.CONTENT")}</label>
                                        <div className="col-md-8 text-black input-detail">
                                            <span>{logCall?.logCallComment}</span>
                                            <i
                                                className="fa fa-pencil edit-btn-permission ml-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={handleEditClick}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className='col-ms-12 label-detail' onClick={() => setListOpenSub({ ...listOpenSub, additionalInformation: !listOpenSub.additionalInformation })}>
                            <span>
                                <i className={!listOpenSub.additionalInformation ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                {t("LOG_CALL.ADDITIONAL_INFORMATION")}
                            </span>
                        </div>
                        {listOpenSub.additionalInformation && <>
                            <div className="col-md-6">
                                <div className="row detail-row">
                                    <label className="col-md-4">{t("EVENT.PRIORITY")}</label>
                                    <div className="col-md-8 text-black input-detail">
                                        <span>{logCall?.eventPriority?.eventPriorityContent}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row detail-row">
                                    <label className="col-md-4">{t("LABEL.LEADS.STATUS")}</label>
                                    <div className="col-md-8 text-black input-detail">
                                        <span>{logCall?.eventStatus?.eventStatusContent}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>
                </>
            )
            }
        </>
    );
}