import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function ContractGuideline() {
    const { t } = useTranslation();
    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.CONTRACT.CONTRACT")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.CONTRACT.CONTRACT_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.CONTRACT.CREATE_CONTRACT")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.CONTRACT.CREATE_NEW")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.CONTRACT.CLICK_NEW")}</p>
                            <p>{t("GUIDELINE.CONTRACT.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.CONTRACT_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ACCOUNT_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.START_DATE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.TERM")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.END_DATE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.STATUS")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.PRICE_BOOK")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.OWNER")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTRACT.SAVE")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.CONTRACT.SAVE_CONTENT")}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.CONTRACT.MANAGEMENT_CONTRACT")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.CONTRACT.EDIT")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.EDIT_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.EDIT_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTRACT.ADD")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ADD_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ADD_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ADD_3")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ADD_4")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ADD_5")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.CONTRACT.ATTACH")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ATTACH_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.CONTRACT.ATTACH_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                    {t("GUIDELINE.CONTRACT.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
