import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from 'react-modal';

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
    },
};

Modal.setAppElement('#root'); // Set the root element for accessibility

const UpdateCampaignInfluenced: React.FC<{
    handleUpdate?: (status: any) => void;
    isOpen: boolean;
    closeModal: () => void;
    data?: any;
}> = ({ handleUpdate, isOpen, closeModal, data }) => {
    const [campaignInfluenced, setCampaignInfluenced] = useState<any>(data);
    const { t } = useTranslation();

    useEffect(() => {
        setCampaignInfluenced(data);
    }, [data]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Update Status Modal"
        >
            <div className="modal-header border-0 m-0 justify-content-center">
                <h4>{t("OPPORTUNITY.UPDATE_CAMPAIGN_INFLUENCED")}</h4>
            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <div className="row mt-1">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4" style={{ textAlign: 'left' }}>
                                    <label className="col-form-label">{t("CAMPAIGN.CAMPAIGN_NAME")}</label>
                                </div>
                                <div className="col-md-8" style={{ textAlign: 'left' }}>
                                    <span>{campaignInfluenced?.campaign?.campaignName}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4" style={{ textAlign: 'left' }}>
                                    <label className="col-form-label">{t("CAMPAIGN.CONTACT_NAME")}</label>
                                </div>
                                <div className="col-md-8" style={{ textAlign: 'left' }}>
                                    <span>{campaignInfluenced?.contactName}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4" style={{ textAlign: 'left' }}>
                                    <label className="col-form-label">{t("CAMPAIGN.INFLUENCE")}</label>
                                </div>
                                <div className="col-md-8" style={{ textAlign: 'left' }}>
                                    <span>{campaignInfluenced?.influence}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4" style={{ textAlign: 'left' }}>
                                    <label className="col-form-label">{t("LABEL.OPPORTUNITIES.CONTACT_ROLE")}</label>
                                </div>
                                <div className="col-md-8" style={{ textAlign: 'left' }}>
                                    <span>{campaignInfluenced?.coOppRelation?.contactRole?.roleName}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4" style={{ textAlign: 'left' }}>
                                    <label className="col-form-label">{t("CAMPAIGN.REVENUE_SHARE")}</label>
                                </div>
                                <div className="col-md-8" style={{ textAlign: 'left' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={campaignInfluenced?.revenueShare}
                                        onChange={(e) => setCampaignInfluenced({ ...campaignInfluenced, revenueShare: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 text-center modal-btn">
                        <button className="btn btn-light" onClick={closeModal}>
                            {t("ACTION.CANCEL")}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdate?.(campaignInfluenced.revenueShare)}>
                            {t("ACTION.UPDATE")}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateCampaignInfluenced;
