import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function ContactGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.CONTACT.CONTACT")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.CONTACT.CONTACT_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.CONTACT.MAIN_FUTURES")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.VIEW_CONTACT_LIST")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.ACCESS")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.DETAILS")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.CREATE_NEW_CONTACT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.CLICK_NEW")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.ENTER_INFOR")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.SAVE_NEW")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.EDIT_CONTACT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.SELECT_CONTACT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.CLICK_EDIT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.UPDATE_INFOR")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.SAVE_UPDATE")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.VIEW_CONTACT_DETAIL")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.SELECT_DETAIL")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.VIEW_INFOR")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.DELETE_CONTACT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.SELECT_DELETE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.CLICK_DELETE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.CONFIRM_DELETE")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTACT.FILTER_CONTACT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.FILTER")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.CONTACT.CONTACT_MANAGEMENT")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.TRACK")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTACT.ASSIGN")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
