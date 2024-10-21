import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function OrderGuideline() {
    const { t } = useTranslation();
    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.ORDER.ORDER")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.ORDER.ORDER_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.ORDER.CREATE_ORDER")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.ORDER.CREATE_NEW")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.ORDER.CLICK_NEW")}</p>
                            <p>{t("GUIDELINE.ORDER.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ORDER_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ACCOUNT_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ORDER_DATE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.CONTRACT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.PRICE_BOOK")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.STATUS")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.OWNER")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.ORDER.ADD_PRODUCT")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ADD_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ADD_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ADD_3")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.ADD_4")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.ORDER.SAVE")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.ORDER.SAVE_CONTENT")}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.ORDER.MANAGE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.ORDER.VIEW")}: </strong>
                            <p className='mt-1'>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.VIEW_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.VIEW_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.ORDER.TRACK")}: </strong>
                            <p className='mt-1'>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.TRACK_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.TRACK_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.ORDER.EDIT")}: </strong>
                            <p className='mt-1'>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.EDIT_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.EDIT_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.ORDER.EDIT_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                        {t("GUIDELINE.ORDER.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
