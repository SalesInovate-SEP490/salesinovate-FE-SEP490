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
    total?: number;
}> = ({ handleUpdate, isOpen, closeModal, total }) => {
    const [memberStatusOptions, setMemberStatusOptions] = useState<any[]>([]);
    const [memberStatus, setMemberStatus] = useState<any>(null);
    const { t } = useTranslation();

    useEffect(() => {
        getListMemberStatus();
    }, []);

    const getListMemberStatus = () => {
        getListCampainMemberStatus()
            .then(response => {
                if (response.code === 1) {
                    setMemberStatusOptions(response.data.map((item: any) => ({
                        value: item.campaignMemberStatusId,
                        label: item.campaignMemberStatusName
                    })));
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Update Status Modal"
        >
            <div className="modal-header border-0 m-0 justify-content-end">

            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <p className="del-info">
                        {/* if total existed display, orthwise hide */}
                        {total ? `${total} ${t("CAMPAIGN.RECORDS_SELECTED")}` : ''}
                    </p>
                    <div className="row">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label>{t("CAMPAIGN.MEMBER_STATUS")}</label>
                            </div>
                            <Select
                                className="select"
                                options={memberStatusOptions}
                                styles={customStyles}
                                name="campaign"
                                value={memberStatusOptions.find(item => item.value === memberStatus?.value)}
                                onChange={(e) => setMemberStatus(e)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-12 text-center modal-btn">
                        <button className="btn btn-light" onClick={closeModal}>
                            {t("ACTION.CANCEL")}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleUpdate?.(memberStatus)}>
                            {t("ACTION.UPDATE")}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default UpdateStatusModal;
