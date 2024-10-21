import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function OpportunityGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.OPPORTUNITY_GUIDELINE.OPPORTUNITY")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.OPPORTUNITY_CONTENT")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.OPPORTUNITY_GUIDELINE.CREATE_OPP")}</strong><br />
                    <ul className="guideline-list mt-1 ml-2">
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.CLICK_OPP")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.OPP_DETAIL")}:</p>
                            <p>
                                <ul style={{ paddingLeft: '12px' }}>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.OPPORTUNITY_GUIDELINE.OPP_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.OPPORTUNITY_GUIDELINE.ACCOUNT_NAME")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.OPPORTUNITY_GUIDELINE.STAGE")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.OPPORTUNITY_GUIDELINE.AMOUNT")}
                                    </li>
                                    <li style={{ listStyleType: "circle" }}>
                                        {t("GUIDELINE.OPPORTUNITY_GUIDELINE.OWNER")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.CLICK_SAVE")}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>2. {t("GUIDELINE.OPPORTUNITY_GUIDELINE.MANAGE_OPP_STAGE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.PROSPECTING")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.QUALIFICATION")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.NEED_ANALYSIS")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.PROPOSAL")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.NEGOTIATION")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.CLOSE_WON")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.CLOSE_LOSE")}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>3. {t("GUIDELINE.OPPORTUNITY_GUIDELINE.UPDATE_OPP")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.UPDATE_OPP_CONTENT")}: </p>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.UPDATE_STAGE")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.ADD_PRODUCT")}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>4. {t("GUIDELINE.OPPORTUNITY_GUIDELINE.REVENUE")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.REVENUE_CONTENT")}: </p>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.AMOUNT_ENTRY")}</p>
                        </li>
                        <li>
                            <p>{t("GUIDELINE.OPPORTUNITY_GUIDELINE.CORRECT_CLOSE")}</p>
                        </li>
                    </ul>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
