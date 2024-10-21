import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { StylesConfig } from "react-select";
import { getListCampainMemberStatus } from "../../../services/campaign_member";
import Modal from 'react-modal';

const customStyles: StylesConfig = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#E41F07" : "#fff",
        color: state.isFocused ? "#fff" : "#000",
        "&:hover": {
            backgroundColor: "#E41F07",
        },
    }),
};

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

const UpdateStatusModal: React.FC<{
    handleUpdate?: (status: any) => void;
    isOpen: boolean;
    closeModal: () => void;
    listCloseStage: any;
}> = ({ handleUpdate, isOpen, closeModal, listCloseStage }) => {
    const [opportunityStatus, setOpportunityStatus] = useState<any>(null);
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Update Status Modal"
        >
            <div className="modal-header border-0 m-0 justify-content-center">
                <h4>{t("OPPORTUNITY.CLOSE_THIS_OPPORTUNITY")}</h4>
            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label>{t("OPPORTUNITY.STAGE")}</label>
                            </div>
                            <Select
                                className="select"
                                options={listCloseStage}
                                styles={customStyles}
                                name="campaign"
                                value={listCloseStage.find((item: any) => item.value === opportunityStatus?.value)}
                                onChange={(e) => setOpportunityStatus(e)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-12 text-center modal-btn">
                        <button className="btn btn-light" onClick={closeModal}>
                            {t("ACTION.CANCEL")}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdate?.(opportunityStatus?.value)}>
                            {t("ACTION.UPDATE")}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateStatusModal;
