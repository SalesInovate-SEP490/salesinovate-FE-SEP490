import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function AccountGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.ACCOUNT_GUIDELINE.ACCOUNT")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.ACCOUNT_GUIDELINE.ACCOUNT_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.ACCOUNT_GUIDELINE.MAIN_FUTURES")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.VIEW_ACCOUNT_LIST")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.ACCESS")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.DETAILS")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.CREATE_NEW_ACCOUNT")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.CLICK_ON")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.ENTER_INFOR")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.SAVE")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.EDIT_ACCOUNT")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.SELECT_ACCOUNT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.CLICK_EDIT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.UPDATE_INFOR")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.SAVE_UPDATE")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.VIEW_ACCOUNT_DETAIL")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.SELECT_ACCOUNT_DETAIL")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.VIEW_INFOR")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.DELETE_ACCOUNT")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.SELECT_DELETE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.CLICK_DELETE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.CONFIRM")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.SEARCH_AND_FILTER")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.FILTER")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.ACCOUNT_GUIDELINE.ACCOUNT_MANAGEMENT")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.ACCOUNT_GUIDELINE.VIEW_ACCOUNT_LIST")}: </strong>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.TRACK_ACTIVITIES")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ACCOUNT_GUIDELINE.ASSIGN")}
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
