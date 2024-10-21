import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import EventModal from "./EventModal";
import CallModal from "./CallModal";
import MailModal from "./MailModal";
import {
    deleteLogCall,
    filterLogCallInAccount,
    filterLogCallInContact,
    filterLogCallInLead,
    filterLogCallInOpportunity
} from "../../../services/logCall";
import {
    deleteLogEmail,
    filterLogEmailInAccount,
    filterLogEmailInContact,
    filterLogEmailInLead,
    filterLogEmailInOpportunity
} from "../../../services/logEmail";
import {
    deleteEventById,
    getEventInLead,
    getEventInAccount,
    getEventInContact
} from "../../../services/event";
import DeleteModal from "../../support/deleteModal";
import { toast } from "react-toastify";

const CommonActivity: React.FC<{ id?: any; type?: any; }> = ({ id, type }) => {
    const [showModals, setShowModals] = useState<any>({
        eventModal: false,
        emailModal: false,
        callModal: false,
        editCallModal: false,
        editEmailModal: false,
        deleteCallModal: false,
    });

    const [currentId, setCurrentId] = useState<any>(null);
    const [activityLog, setActivityLog] = useState<any>({});
    const [itemChoose, setItemChoose] = useState<any>(null);
    const { t } = useTranslation();
    const nav = useNavigate();

    useEffect(() => {
        if (id) {
            setCurrentId(id);
        }
    }, [id]);

    useEffect(() => {
        if (type) {
            getActivityLog();
        }
    }, [type]);

    const getActivityLog = () => {
        Swal.showLoading();
        Promise.allSettled([getListLogCall(), getListLogEmail(), getListLogEvent()])
            .then((results) => {
                Swal.close();

                const [calls, emails, events] = results.map(result =>
                    result.status === 'fulfilled' ? result.value : []
                );

                const combinedLogs = combineLogsByDate(calls, emails, events);
                setActivityLog(combinedLogs);
            })
            .catch((error) => {
                Swal.close();
                console.error("Unexpected error in activity log", error);
            });
    };

    const getListLogCall = () => {
        switch (type) {
            case 'leads':
                return filterLogCallInLead(id).then(response => handleResponse(response, 'call'));
            case 'contacts':
                return filterLogCallInContact(id).then(response => handleResponse(response, 'call'));
            case 'accounts':
                return filterLogCallInAccount(id).then(response => handleResponse(response, 'call'));
            case 'opportunities':
                return filterLogCallInOpportunity(id).then(response => handleResponse(response, 'call'));
            default:
                return Promise.resolve([]);
        }
    };

    const getListLogEmail = () => {
        switch (type) {
            case 'leads':
                return filterLogEmailInLead(id).then(response => handleResponse(response, 'email'));
            case 'contacts':
                return filterLogEmailInContact(id).then(response => handleResponse(response, 'email'));
            case 'accounts':
                return filterLogEmailInAccount(id).then(response => handleResponse(response, 'email'));
            case 'opportunities':
                return filterLogEmailInOpportunity(id).then(response => handleResponse(response, 'email'));
            default:
                return Promise.resolve([]);
        }
    };

    const getListLogEvent = () => {
        switch (type) {
            case 'leads':
                return getEventInLead(id).then(response => handleResponse(response, 'event'));
            case 'contacts':
                return getEventInContact(id).then(response => handleResponse(response, 'event'));
            case 'accounts':
                return getEventInAccount(id).then(response => handleResponse(response, 'event'));
            default:
                return Promise.resolve([]);
        }
    }

    const handleResponse = (response: any, logType: string) => {
        if (response.code === 1) {
            return response.data.map((item: any) => ({
                date: new Date(item?.createdDate || item?.messageDate || item?.startTime).toISOString().split('T')[0],
                type: logType,
                ...item
            }));
        } else {
            return [];
        }
    };

    const goDetail = (item: any) => {
        const type = item.type;
        switch (type) {
            case 'call':
                nav(`/log-call/${item?.logCallId}`);
                break;
            case 'email':
                nav(`/log-email/${item?.logEmailId}`);
                break;
            case 'event':
                nav(`/event-details/${item?.eventId}`);
                break;
            default:
                break;
        }
    }

    const combineLogsByDate = (calls: any[], emails: any[], events: any[]) => {
        const temp: { [key: string]: any[] } = {};
        [...calls, ...emails, ...events].forEach((item) => {
            if (temp[item.date]) {
                temp[item.date].push(item);
            } else {
                temp[item.date] = [item];
            }
        });

        return temp;
    };

    const setModalValue = (modalName: string, value: boolean) => {
        setShowModals((prevState: any) => ({
            ...prevState,
            [modalName]: value
        }));
    };

    const removeCall = () => {
        Swal.showLoading();
        deleteLogCall(itemChoose.logCallId)
            .then((res) => {
                Swal.close();
                if (res.code === 1) {
                    document.getElementById('close-btn-dc')?.click();
                    getActivityLog();
                }
                else
                    toast.error(res.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const removeEvent = () => {
        Swal.showLoading();
        deleteEventById(itemChoose.eventId)
            .then((res) => {
                Swal.close();
                if (res.code === 1) {
                    document.getElementById('close-btn-de')?.click();
                    getActivityLog();
                }
                else
                    toast.error(res.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const removeEmail = () => {
        Swal.showLoading();
        deleteLogEmail(itemChoose.logEmailId)
            .then((res) => {
                Swal.close();
                if (res.code === 1) {
                    document.getElementById('close-btn-de')?.click();
                    getActivityLog();
                }
                else
                    toast.error(res.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const openEditModal = (item: any) => {
        if (item.type === 'call') {
            setModalValue('editCallModal', true);
        } else if (item.type === 'email') {
            setModalValue('editEmailModal', true);
        } else {
            setModalValue('editEventModal', true);
        }
        setItemChoose(item);
    }
    return (
        <>
            <div className="tab-pane active show" id="activities">
                <div className="view-header">
                    <h4>Activities</h4>
                    <ul>
                        <li>
                            <Link
                                to="#"
                                className="btn custom-btn-blue-black"
                                data-tooltip-id="phoneTooltip"
                                data-tooltip-content={t("LABEL.ACTIVITY.LOG_A_CALL")}
                                onClick={() => setModalValue('callModal', true)}
                            >
                                <i className="fa fa-phone" />
                                <Tooltip id="phoneTooltip" place="top" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#"
                                className="btn custom-btn-blue-black"
                                data-tooltip-id="emailTooltip"
                                data-tooltip-content={t("LABEL.ACTIVITY.SEND_EMAIL")}
                                onClick={() => setModalValue('emailModal', true)}
                            >
                                <i className="fa fa-envelope" />
                                <Tooltip id="emailTooltip" place="top" />
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#"
                                className="btn custom-btn-blue-black"
                                data-tooltip-id="calendarTooltip"
                                data-tooltip-content={t("LABEL.ACTIVITY.LOG_EVENT")}
                                onClick={() => setModalValue('eventModal', true)}
                            >
                                <i className="ti ti-calendar" />
                                <Tooltip id="calendarTooltip" place="top" />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="contact-activity">
                    {Object.keys(activityLog).map((date, index) => (
                        <div key={index}>
                            <div className="badge-day">
                                <i className="ti ti-calendar-check" />
                                {date}
                            </div>
                            <ul>
                                {activityLog[date].map((item: any, subIndex: number) => {
                                    const iconClass = item.type === 'call' ? (item.type === 'event' ? "ti ti-calendar-check" : "ti ti-phone") : (item.type === 'event' ? "ti ti-calendar-check" : "ti ti-mail-code");
                                    const bgClass = item.type === 'call' ? (item.type === 'event' ? "bg-secondary-success" : "bg-pending") : (item.type === 'event' ? "bg-secondary-success" : "bg-pending");

                                    return (
                                        <li key={subIndex} className="activity-wrap space-between">
                                            <div className="row d-flex flex-wrap-no">
                                                <span className={`activity-icon ${bgClass}`}>
                                                    <i className={iconClass} />
                                                </span>
                                                <div
                                                    className="activity-info click-div"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => goDetail(item)}>
                                                    {
                                                        item.type === 'call' &&
                                                        <h6>{item.logCallName}</h6>
                                                    }
                                                    {
                                                        item.type === 'email' &&
                                                        <h6>{item.mailSubject}</h6>
                                                    }
                                                    {
                                                        item.type === 'event' &&
                                                        <h6>{t("EVENT.EVENT")}</h6>
                                                    }
                                                    {
                                                        item.type === 'call' &&
                                                        <p>{item.logCallComment}</p>
                                                    }
                                                    {
                                                        item.type === 'email' &&
                                                        <div dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                                                    }
                                                    {
                                                        item.type === 'event' &&
                                                        <p>{item?.content}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="action-right">
                                                <div className="dropdown table-action">
                                                    <Link
                                                        to="#"
                                                        className="action-icon"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa fa-ellipsis-v" />
                                                    </Link>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        {item.type === 'call' &&
                                                            <Link className="dropdown-item edit-btn-permission" to="#"
                                                                onClick={() => openEditModal(item)}
                                                            >
                                                                <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
                                                            </Link>
                                                        }


                                                        <Link
                                                            className="dropdown-item delete-btn-permission"
                                                            to="#"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#${item.type === 'call' ? 'delete-call' : 'delete-email'}`}
                                                            onClick={() => setItemChoose(item)}
                                                        >
                                                            <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <EventModal
                closeModal={() => setModalValue('eventModal', false)}
                isOpen={showModals.eventModal}
                isEdit={false}
                initType={type}
                currentId={currentId}
                getList={getActivityLog}
            />
            <CallModal
                closeModal={() => setModalValue('callModal', false)}
                isOpen={showModals.callModal}
                isEdit={false}
                currentId={currentId}
                initType={type}
                getList={getActivityLog}
            />
            <MailModal
                closeModal={() => setModalValue('emailModal', false)}
                isOpen={showModals.emailModal}
                isEdit={false}
                id={currentId}
                initType={type}
                getList={getActivityLog}
            />
            <CallModal
                closeModal={() => setModalValue('editCallModal', false)}
                isOpen={showModals.editCallModal}
                isEdit={true}
                currentId={currentId}
                initType={type}
                getList={getActivityLog}
                id={itemChoose?.logCallId}
            />
            <DeleteModal deleteId="delete-event" closeBtn="close-btn-de" handleDelete={removeEvent} />
            <DeleteModal deleteId="delete-call" closeBtn="close-btn-dc" handleDelete={removeCall} />
            <DeleteModal deleteId="delete-email" closeBtn="close-btn-de" handleDelete={removeEmail} />
        </>
    );
};

export default CommonActivity;
