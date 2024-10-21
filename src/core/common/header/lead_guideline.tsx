import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function LeadGuideline() {

    const { t } = useTranslation();

    return (
        <div className="guideline-container">
            <div className="guideline-header">
                <i className="fas fa-book-open guideline-icon"></i>
                <h4 className="guideline-title">{t("GUIDELINE.LEADS")}</h4>
            </div>
            <div className="guideline-content">
                <p>{t("GUIDELINE.LEADS_CONTENT_1")}</p>
                <p>{t("GUIDELINE.LEADS_CONTENT_2")}</p>
                <div>
                    <strong>1. {t("GUIDELINE.LEAD_CONTENT_GUI.ACCESSING_LEAD_OVERVIEW")}</strong><br />
                    <ul className="guideline-list mt-1">
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.NAVIGATE_TO_LEADS")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.NAVIGATE_TO_LEADS_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_OVERVIEW")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_OVERVIEW_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div >
                    <strong>2. {t("GUIDELINE.LEAD_CONTENT_GUI.KEY_FEATURES")}</strong><br />
                    <ul className="guideline-list mt-2">
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.FILTER")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.FILTER_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_DETAILS")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_DETAILS_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_STATUS")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.LEAD_STATUS_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.ACTION")}:</strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.ACTION_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>3. {t("GUIDELINE.LEAD_CONTENT_GUI.MANAGING_LEADS")}</strong><br />
                    <ul className="guideline-list mt-2">
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.CREATE_NEW_LEAD")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.CREATE_NEW_LEAD_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.UPDATE_LEAD")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.UPDATE_LEAD_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.CONVERT_LEAD")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.CONVERT_LEAD_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <strong>4. {t("GUIDELINE.LEAD_CONTENT_GUI.STEPS_TO_CONVERT_QUALIFIED_LEADS")}</strong><br />
                    <ul className="guideline-list mt-2">
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.SELECT_THE_LEAD_TO_CONVERT")}: </strong>
                                <ul style={{paddingLeft:'12px'}}>
                                    <li style={{listStyleType:"circle"}}>
                                    {t("GUIDELINE.LEAD_CONTENT_GUI.SELECT_THE_LEAD_TO_CONVERT_CONTENT_1")}
                                    </li>
                                    <li style={{listStyleType:"circle"}}>
                                    {t("GUIDELINE.LEAD_CONTENT_GUI.SELECT_THE_LEAD_TO_CONVERT_CONTENT_2")}
                                    </li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.REVIEW_LEAD_DETAILS")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.REVIEW_LEAD_DETAILS_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.CLICK_ON_THE_CONVERT_BUTTON")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.CLICK_ON_THE_CONVERT_BUTTON_CONTENT")}
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.COMPLETE_THE_CONVERSION_FORM")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.COMPLETE_THE_CONVERSION_FORM_CONTENT")}:
                                <ul style={{paddingLeft:'12px', paddingTop:'6px'}}>
                                    <li style={{listStyleType:"circle"}}>{t("GUIDELINE.LEAD_CONTENT_GUI.COMPLETE_THE_CONVERSION_FORM_CONTENT_ACC")}</li>
                                    <li style={{listStyleType:"circle"}}>{t("GUIDELINE.LEAD_CONTENT_GUI.COMPLETE_THE_CONVERSION_FORM_CONTENT_CONTACT")}</li>
                                    <li style={{listStyleType:"circle"}}>{t("GUIDELINE.LEAD_CONTENT_GUI.COMPLETE_THE_CONVERSION_FORM_CONTENT_OPP")}</li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.REVIEW_AND_CONFIRM")}: </strong>
                                <ul style={{paddingLeft:'12px'}}>
                                    <li style={{listStyleType:"circle"}}>{t("GUIDELINE.LEAD_CONTENT_GUI.REVIEW_AND_CONFIRM_CONTENT_1")}</li>
                                    <li style={{listStyleType:"circle"}}>{t("GUIDELINE.LEAD_CONTENT_GUI.REVIEW_AND_CONFIRM_CONTENT_2")}</li>
                                </ul>
                            </p>
                        </li>
                        <li>
                            <p>
                                <strong>{t("GUIDELINE.LEAD_CONTENT_GUI.UPDATE_LEAD_STATUS")}: </strong>
                                {t("GUIDELINE.LEAD_CONTENT_GUI.UPDATE_LEAD_STATUS_CONTENT")}
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className='mt-3'>
                    {t("GUIDELINE.LEAD_CONTENT_GUI.FINAL")}
                    </p>
                </div>
                <div className='mt-5'></div>
            </div>
        </div>
    )
}
