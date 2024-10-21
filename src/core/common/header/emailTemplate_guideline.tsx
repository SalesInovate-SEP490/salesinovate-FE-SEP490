import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function EmailTemplateGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.EMAIL_TEMPLATE.EMAIL_TEMPLATE")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.EMAIL_TEMPLATE.EMAIL_TEMPLATE_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.EMAIL_TEMPLATE.CREATE_EMAIL_TEMPLATE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.CREATE_NEW")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.EMAIL_TEMPLATE.CLICK_NEW")}</p>
                            <p>{t("GUIDELINE.EMAIL_TEMPLATE.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.TEMPLATE_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.FOLDER")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.SUBJECT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.RELATED")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.COMPOSE")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.COMPOSE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.COMPOSE_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.SET")}: </strong>
                            <p>
                                {t("GUIDELINE.EMAIL_TEMPLATE.SET_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.EMAIL_TEMPLATE.UPDATE_TEMPLATE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.ACCESS")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.CLICK_EDIT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.ACCESS_CONTENT")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.SAVE_CHANGES")}: </strong>
                            <p>
                                {t("GUIDELINE.EMAIL_TEMPLATE.SAVE_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>3. {t("GUIDELINE.EMAIL_TEMPLATE.MANAGEMENT_TEMPLATE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.ORGANIZATION")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.ORGANIZATION_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.ORGANIZATION_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.SHARE")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.SHARE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.SHARE_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>4. {t("GUIDELINE.EMAIL_TEMPLATE.USING")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.SELECT")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.SELECT_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.EMAIL_TEMPLATE.SELECT_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.EMAIL_TEMPLATE.SEND")}: </strong>
                            <p>
                                {t("GUIDELINE.EMAIL_TEMPLATE.SEND_1")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
