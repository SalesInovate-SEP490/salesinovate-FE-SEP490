import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers } from "../../../services/user";
import { getContacts } from "../../../services/Contact";
import { getAccounts } from "../../../services/account";
import { getListLeads } from "../../../services/lead";
import { patchEvent } from "../../../services/event";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import DatePicker from 'react-datepicker';

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

export const DetailEvent: React.FC<{ data: any; getDetail?: any }> = ({ data, getDetail }) => {
    const [event, setEvent] = useState<any>(data);
    const [type, setType] = useState<any>('contacts');
    const [listOpen, setListOpen] = useState<any>({
        users: [],
        types: [],
        reminders: [],
        contacts: [],
        accounts: [],
        leads: [],
        priority: [{ value: 2, label: 'Medium' }, { value: 1, label: 'High' }, { value: 3, label: 'Low' }],
    })
    const [listOpenSub, setListOpenSub] = useState<any>({
        edit: false,
        calendarDetail: true,
        relatedTo: true,
        otherInfo: true,
    });
    const [checkBoxReminder, setCheckBoxReminder] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setEvent((prev: any) => {
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
    }, [])

    useEffect(() => {
        if (data) {
            setType(data?.leadEventResponse ? 'leads' : 'contacts');
            console.log("Data: ", data);
            setEvent(data);
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
                            users: res?.data?.items?.map((item: any) => {
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
    }

    const getListReminder = () => {
        const reminders = [
            { eventReminderTimeId: 1, eventReminderTimeContent: '0 minutes' },
            { eventReminderTimeId: 2, eventReminderTimeContent: '5 minutes' },
            { eventReminderTimeId: 3, eventReminderTimeContent: '10 minutes' },
            { eventReminderTimeId: 4, eventReminderTimeContent: '15 minutes' },
            { eventReminderTimeId: 5, eventReminderTimeContent: '30 minutes' },
            { eventReminderTimeId: 6, eventReminderTimeContent: '1 hour' },
            { eventReminderTimeId: 7, eventReminderTimeContent: '2 hours' },
            { eventReminderTimeId: 8, eventReminderTimeContent: '3 hours' },
            { eventReminderTimeId: 9, eventReminderTimeContent: '4 hours' },
            { eventReminderTimeId: 10, eventReminderTimeContent: '5 hours' },
            { eventReminderTimeId: 11, eventReminderTimeContent: '6 hours' },
            { eventReminderTimeId: 12, eventReminderTimeContent: '7 hours' },
            { eventReminderTimeId: 13, eventReminderTimeContent: '8 hours' },
            { eventReminderTimeId: 14, eventReminderTimeContent: '9 hours' },
            { eventReminderTimeId: 15, eventReminderTimeContent: '10 hours' },
            { eventReminderTimeId: 16, eventReminderTimeContent: '11 hours' },
            { eventReminderTimeId: 17, eventReminderTimeContent: '12 hours' },
            { eventReminderTimeId: 18, eventReminderTimeContent: '1 day' },
            { eventReminderTimeId: 19, eventReminderTimeContent: '2 days' },
            { eventReminderTimeId: 20, eventReminderTimeContent: '3 days' },
        ]

        setListOpen((prev: any) => {
            return {
                ...prev,
                reminders: reminders.map((item: any) => {
                    return {
                        value: item?.eventReminderTimeId,
                        label: item?.eventReminderTimeContent
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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value } = e.target;
            setEvent({
                ...event,
                [name]: value
            });
        } else {
            if (nameChild) {
                setEvent({
                    ...event,
                    [name]: {
                        [nameChild]: e?.value,
                        name: e?.label
                    },
                    [nameChild]: e?.value
                });
            }
            else {
                setEvent({
                    ...event,
                    [name]: e?.value
                });
            }
        }
    };

    const handleChangeArray = (e: any, name?: any) => {
        setEvent({
            ...event,
            [name]: e?.map((item: any) => item?.value)
        });
        console.log("Event: ", event);
    }

    const validate = () => {
        const errors: any = {};
        if (event?.account?.accountId && type === 'leads') {
            errors.account = t("EVENT.LEAD_ACCOUNT_ERROR");
        }
        // * is required t("MESSAGE.ERROR.REQUIRED")
        if (!event?.type) {
            errors.type = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!event?.start) {
            errors.start = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!event?.end) {
            errors.end = t("MESSAGE.ERROR.REQUIRED");
        }
        if (!event?.relatedTo) {
            errors.relatedTo = t("MESSAGE.ERROR.REQUIRED");
        }
        // startDate must be less than endDate
        if (event?.start && event?.end && new Date(event?.start) > new Date(event?.end)) {
            errors.end = t("EVENT.START_END_ERROR");
        }
        console.log("Event: ", event);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = () => {
        const newEvent: any = {
            content: event?.content,
            startTime: event?.start ? event?.start.toISOString().replace("Z", "") : undefined,
            endTime: event?.end ? event?.end.toISOString().replace("Z", "") : undefined,
            eventSubject: event?.type,
            eventPriority: event?.priority,
            eventAssigneeDTOS: event?.relatedTo?.map((item: any) => {
                return {
                    userId: item
                }
            }),
            eventRemindTime: event?.reminder
        }

        if (type === 'leads') {
            newEvent['leadEventDTO'] = {
                leadId: event?.lead?.leadId
            }
        } else {
            newEvent['contactEventDTOS'] = event?.contact?.map((item: any) => {
                return {
                    contactId: item
                }
            });
            newEvent['accountEventDTO'] = {
                accountId: event?.account?.accountId
            };
        }
        if (!validate()) return;
        patchEvent(data?.eventId, newEvent)
            .then(response => {
                if (response.code === 1) {
                    toast.success("Update event successfully!");
                    if (getDetail) {
                        getDetail();
                    }
                    setListOpen({ ...listOpen, edit: false });
                } else {
                    toast.error(response.message);
                }
            })
            .catch(error => {
                toast.error("Update event failed!");
            })
    }
    const handleEditClick = () => {
        setListOpen({ ...listOpen, edit: !listOpen.edit });
        setType(data?.leadEventResponse ? 'leads' : 'contacts');
        if (listOpen.edit)
            setEvent({
                ...data?.data,
                start: new Date(data?.startTime),
                end: new Date(data?.endTime),
                relatedTo: data?.eventAssigneeDTOS?.map((item: any) => item?.userId),
                type: data?.eventSubject?.eventSubjectId,
                account: data?.accountEventResponse?.length > 0 ? data?.accountEventResponse : undefined,
                contact: data?.contactEventResponses?.map((item: any) => item?.contactId),
                lead: data?.leadEventResponse,
                reminder: data?.eventRemindTime?.eventRemindTimeId,
                priority: data?.eventPriority?.eventPriorityId

            });
    };

    const getUserName = (userId: any) => {
        const user = listOpen?.users?.find((item: any) => item.value === userId);
        return user?.label;
    }

    const getName = () => {
        const contact = event?.contactEventResponses
            ? `<span class="link">${event?.contactEventResponses[0]?.contactName} </span> ${event?.contactEventResponses?.length > 1 ? '+' + (event?.contactEventResponses.length - 1) : ''}`
            : '';
        const lead = event?.leadEventResponse ? event?.leadEventResponse.leadName : '';
        return type === 'leads' ? `<span class="link">${lead}</div>` : `${contact}`;
    }

    return (
        <>
            {listOpen.edit ? (
                <>
                    <div className="row mb-1">
                        <div className='col-ms-12 label-detail'>
                            <span>
                                {t("EVENT.EVENT_DETAILS")}
                            </span>
                        </div>
                        <div className="col-md-6">
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
                                    value={listOpen?.types?.find((item: any) => item.value === event?.type)}
                                    onChange={(e) => handleChange(e, "type")}
                                />
                                {errors.type && <p className="text-danger">{errors.type}</p>}
                            </div>
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.START")}<span className="text-danger">*</span></label>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <DatePicker
                                            className="form-control datetimepicker deals-details w-100"
                                            dateFormat="dd-MM-yyyy"
                                            selected={event?.start ? new Date(event?.start) : new Date()}
                                            onChange={(date: any) => handleChange({ target: { name: "start", value: date } })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <DatePicker
                                            className="form-control datetimepicker deals-details w-100"
                                            selected={event?.start ? new Date(event?.start) : new Date()}
                                            onChange={(date: any) => handleChange({ target: { name: "start", value: date } })}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                        />
                                    </div>
                                </div>
                                {errors.start && <p className="text-danger">{errors.start}</p>}
                            </div>
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.END")}<span className="text-danger">*</span></label>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <DatePicker
                                            className="form-control datetimepicker deals-details w-100"
                                            dateFormat="dd-MM-yyyy"
                                            selected={event?.end ? new Date(event?.end) : new Date()}
                                            onChange={(date: any) => handleChange({ target: { name: "end", value: date } })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <DatePicker
                                            className="form-control datetimepicker deals-details w-100"
                                            selected={event?.end ? new Date(event?.end) : new Date()}
                                            onChange={(date: any) => handleChange({ target: { name: "end", value: date } })}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"
                                        />
                                    </div>
                                </div>
                                {errors.end && <p className="text-danger">{errors.end}</p>}
                            </div>
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.PRIORITY")}</label>
                                </div>
                                <Select
                                    className="select"
                                    options={listOpen?.priority}
                                    styles={customStyles}
                                    name="priority"
                                    value={listOpen?.priority.find((item: any) => item.value === event?.priority)}
                                    onChange={(e) => handleChange(e, "priority")}
                                />
                            </div>
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.CONTENT")}</label>
                                </div>
                                <input
                                    className="form-control"
                                    name="content"
                                    value={event?.content}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">{t("EVENT.ASSIGNED_TO")}<span className="text-danger">*</span></label>
                                </div>
                                <Select
                                    className="select"
                                    options={listOpen?.users}
                                    styles={customStyles}
                                    name="relatedTo"
                                    isMulti={true}
                                    value={listOpen?.users?.filter((item: any) => event?.relatedTo?.includes(item.value))}
                                    onChange={(e) => handleChangeArray(e, "relatedTo")}
                                />
                                {errors.relatedTo && <p className="text-danger">{errors.relatedTo}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-1">
                        <div className='col-ms-12 label-detail'>
                            <span>
                                {t("EVENT.EVENT_DETAILS")}
                            </span>
                        </div>
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
                                            onChange={(e: any) => setType(e?.value)}
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
                                                    value={listOpen?.leads?.find((item: any) => item.value === event?.lead?.leadId)}
                                                    onChange={(e) => handleChange(e, "lead", "leadId")}
                                                />
                                                :
                                                <Select
                                                    className="select"
                                                    options={listOpen?.contacts}
                                                    styles={customStyles}
                                                    name="contact"
                                                    isMulti={true}
                                                    value={listOpen?.contacts.filter((item: any) => event?.contact?.includes(item.value))}
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
                                <Select
                                    className="select"
                                    options={listOpen?.accounts}
                                    styles={customStyles}
                                    name="lead"
                                    value={event?.account ? listOpen?.accounts?.find((item: any) => item.value === event?.account?.accountId) : undefined}
                                    onChange={(e) => handleChange(e, "account", "accountId")}
                                    isClearable={true}
                                />
                                {errors.account && <p className="text-danger">{errors.account}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row mb-1">
                        <div className='col-ms-12 label-detail'>
                            <span>
                                {t("EVENT.OTHER_INFORMATION")}
                            </span>
                        </div>
                        <div className="col-md-6">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="label-text">{t("EVENT.REMINDER_SET")}</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input
                                            className=""
                                            type="checkbox"
                                            checked={checkBoxReminder}
                                            onChange={() => setCheckBoxReminder(!checkBoxReminder)}
                                        />
                                    </div>
                                </div>

                                {checkBoxReminder && <Select
                                    className="select"
                                    options={listOpen?.reminders}
                                    styles={customStyles}
                                    name="reminder"
                                    value={listOpen?.reminders.find((item: any) => item.value === event?.reminder)}
                                    onChange={(e) => handleChange(e, "reminder")}
                                />}
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
                        <div className='col-ms-12 label-detail' onClick={() => setListOpenSub({ ...listOpenSub, calendarDetail: !listOpenSub.calendarDetail })}>
                            <span>
                                <i className={!listOpenSub.calendarDetail ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                {t("EVENT.EVENT_DETAILS")}
                            </span>
                        </div>
                        {listOpenSub.calendarDetail &&
                            <>
                                <div className="col-md-6">
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.SUBJECT")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{event?.content}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.START")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{convertDateToString(event?.startTime)}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.END")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{convertDateToString(event?.endTime)}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.PRIORITY")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{event?.eventPriority?.eventPriorityContent}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.CONTENT")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{event?.content}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="col-md-12">
                                        <div className="row detail-row">
                                            <label className="col-md-4">{t("EVENT.ASSIGNED_TO")}</label>
                                            <div className="col-md-8 text-black input-detail">
                                                <span>{getUserName(event?.createdBy)}</span>
                                                <i
                                                    className="fa fa-pencil edit-btn-permission ml-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={handleEditClick}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className='col-ms-12 label-detail' onClick={() => setListOpenSub({ ...listOpenSub, relatedTo: !listOpenSub.relatedTo })}>
                            <span>
                                <i className={!listOpenSub.relatedTo ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                {t("EVENT.RELATED_TO")}
                            </span>
                        </div>
                        {listOpenSub.relatedTo && <>
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
                            <div className="col-md-6">
                                <div className="row detail-row">
                                    <label className="col-md-4">{t("EVENT.RELATED_TO")}</label>
                                    <div className="col-md-8 text-black input-detail">
                                        <span>
                                            {event?.accountEventResponse?.accountName}
                                        </span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </>}
                        <div className='col-ms-12 label-detail' onClick={() => setListOpenSub({ ...listOpenSub, otherInfo: !listOpenSub.otherInfo })}>
                            <span>
                                <i className={!listOpenSub.otherInfo ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                {t("EVENT.OTHER_INFORMATION")}
                            </span>
                        </div>
                        {listOpenSub.otherInfo && <>
                            <div className="col-md-6">
                                <div className="row detail-row">
                                    <label className="col-md-4">{t("EVENT.REMINDER_SET")}</label>
                                    <div className="col-md-8 text-black input-detail">
                                        <span>{event?.eventRemindTime?.eventRemindTimeContent}</span>
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
            )}
        </>
    );
}