import React from 'react';
import './guideline.css';
import { useTranslation } from "react-i18next";

export default function CampaignGuideline() {

    const { t } = useTranslation();

  return (
    <div className="guideline-container">
    <div className="guideline-header">
        <i className="fas fa-book-open guideline-icon"></i>
        <h4 className="guideline-title">{t("GUIDELINE.CAMPAIGN_GUIDELINE.CAMPAIGN")}</h4>
    </div>
    <div className="guideline-content">
        <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.CAMPAIGN_CONTENT")}</p>
        <div>
            <strong>1. {t("GUIDELINE.CAMPAIGN_GUIDELINE.CREATE_CAMPAIGN")}</strong><br />
            <ul className="guideline-list mt-1">
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.CLICK_NEW")}</p>
                </li>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.ENTER_CAMPAIGN")}:</p>
                    <p>
                        <ul style={{ paddingLeft: '12px' }}>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.CAMPAIGN_NAME")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.TYPE")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.STATUS")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.DATE")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.REVENUE")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.COST")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.PARENT_CAMPAIGN")}
                            </li>
                        </ul>
                    </p>
                </li>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.CLICK_SAVE")}</p>
                </li>
            </ul>
        </div>
        <div>
            <strong>2. {t("GUIDELINE.CAMPAIGN_GUIDELINE.CAMPAIGN_MEMBER")}</strong><br />
            <ul className="guideline-list mt-1">
            <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.CAMPAIGN_MEMBER_CONTENT")}: </p>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.ADD_CAMPAIGN_MEMBER")}:</p>
                    <p>
                        <ul style={{ paddingLeft: '12px' }}>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.ADDITION")}
                            </li>
                            <li style={{ listStyleType: "circle" }}>
                                {t("GUIDELINE.CAMPAIGN_GUIDELINE.IMPORT_LEAD")}
                            </li>
                        </ul>
                    </p>
                </li>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.UPDATE_MEMBER")}</p>
                </li>
            </ul>
        </div>
        <div>
            <strong>3. {t("GUIDELINE.CAMPAIGN_GUIDELINE.TRACKING_CAMPAIGN")}</strong><br />
            <ul className="guideline-list mt-1">
            <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.TRACKING_CAMPAIGN_CONTENT")}: </p>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.ROI")}:</p>
                </li>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.INFLUENCE")}</p>
                </li>
                <li>
                    <p>{t("GUIDELINE.CAMPAIGN_GUIDELINE.REPORT")}</p>
                </li>
            </ul>
        </div>
        <div className='mt-5'></div>
    </div>
</div>
  )
}
