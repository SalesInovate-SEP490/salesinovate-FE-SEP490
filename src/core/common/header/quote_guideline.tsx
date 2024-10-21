import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function QuoteGuideline() {
    const { t } = useTranslation();
  return (
    <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.QUOTE.QUOTE")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.QUOTE.QUOTE_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.QUOTE.CREATE_QUOTE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.QUOTE.CREATE_NEW")}: </strong>
                            <p>{t("GUIDELINE.QUOTE.CREATE_1")}</p>
                            <p>{t("GUIDELINE.QUOTE.CREATE_2")}</p>
                            <p>{t("GUIDELINE.QUOTE.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.QUOTE_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.OPP")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.QUOTE_DATE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.EX_DATE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.STATUS")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.TAX")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.QUOTE.ADD_PRODUCT")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.ADD_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.ADD_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.ADD_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.QUOTE.MANAGE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.QUOTE.VIEW")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.VIEW_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.VIEW_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.QUOTE.UPDATE")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.UPDATE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.UPDATE_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.UPDATE_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>3. {t("GUIDELINE.QUOTE.SEND_QUOTE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.QUOTE.PDF")}: </strong>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.PDF_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.QUOTE.PDF_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                        {t("GUIDELINE.QUOTE.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
  )
}
