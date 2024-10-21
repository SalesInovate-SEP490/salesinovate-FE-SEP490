import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function ProductGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.PRODUCT_GUIDELINE.PRODUCT")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.PRODUCT_GUIDELINE.PRODUCT_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.PRODUCT_GUIDELINE.CREATE_PRODUCT")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.PRODUCT_GUIDELINE.CREATE_NEW")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.PRODUCT_GUIDELINE.CLICK_NEW")}</p>
                            <p>{t("GUIDELINE.PRODUCT_GUIDELINE.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.PRODUCT_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.PRODUCT_CODE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.PRODUCT_FAMILY")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.ACTIVE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.DESCRIPTION")}
                                    </li>
                                </ul>
                            </p>
                            <p>{t("GUIDELINE.PRODUCT_GUIDELINE.CLICK_SAVE")}</p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRODUCT_GUIDELINE.SETTING_PRICE_BOOK")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.CONTENT_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.CONTENT_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.CONTENT_3")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.CONTENT_4")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.CONTENT_5")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRODUCT_GUIDELINE.USE_PRODUCT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.USE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.USE_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRODUCT_GUIDELINE.USE_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                        {t("GUIDELINE.PRODUCT_GUIDELINE.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
