import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function PriceBookGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.PRICE_BOOK_GUIDELINE.PRICE_BOOK")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.PRICE_BOOK_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.PRICE_BOOK_GUIDELINE.CREATE_PRICE_BOOK")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <strong>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.CREATE_NEW")}: </strong>
                            <p className='mt-1'>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.CLICK_NEW")}</p>
                            <p>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.FILL")}: </p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.PRICE_BOOK_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.DESCRIPTION")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ACTIVE")}
                                    </li>
                                </ul>
                            </p>
                            <p>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.CLICK_SAVE")}</p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.ADD_PRODUCT")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ADD_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ADD_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ADD_3")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ADD_4")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.CUSTOM_PRICE_BOOK")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.CUSTOM_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.CUSTOM_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.CUSTOM_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.USING_PRICE_BOOK")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.USE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.USE_2")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.USE_3")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <strong>{t("GUIDELINE.PRICE_BOOK_GUIDELINE.ACTIVE_PRICE_BOOK")}: </strong>
                            <p>
                                <ul className='mt-1' style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ACTIVE_1")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.ACTIVE_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                        {t("GUIDELINE.PRICE_BOOK_GUIDELINE.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
