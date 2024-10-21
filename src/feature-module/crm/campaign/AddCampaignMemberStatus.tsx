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

const AddCampaignMemberStatus: React.FC<{
    handleCreate?: (status: any) => void;
    handleUpdate?: (status: any) => void;
    isOpen: boolean;
    closeModal: () => void;
    isEdit?: boolean;
    data?: any;
}> = ({ handleCreate, isOpen, closeModal, isEdit, data, handleUpdate }) => {
    const [memberStatus, setMemberStatus] = useState<any>({
        status: ""
    });
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();
    const handleCreateMemberStatus = (status: any) => {
        console.log("status", status);
        if (!status.status) {
            setErrors({ status: t("MESSAGE.ERROR.REQUIRED") });
            return;
        }
        if (isEdit) {
            handleUpdate?.(status);
        } else {
            handleCreate?.(status);
        }
    }

    useEffect(() => {
        setMemberStatus(data);
    }, [data])
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel={t("CAMPAIGN.UPDATE_MEMBER_STATUS")}
        >
            <div className="modal-header border-0 m-0 justify-content-center">
                <h3>{isEdit ? t("CAMPAIGN.UPDATE_MEMBER_STATUS") : t("CAMPAIGN.ADD_MEMBER_STATUS")}</h3>
            </div>
            <div className="modal-body">
                <div className="success-message text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <div style={{ textAlign: 'left' }}>
                                <label>{t("CAMPAIGN.MEMBER_STATUS")}</label>
                            </div>
                            {/* Click enter => Submit */}
                            <input type="text"
                                className="form-control"
                                placeholder={t("CAMPAIGN.MEMBER_STATUS")}
                                value={memberStatus?.status}
                                onChange={(e) => setMemberStatus({ ...memberStatus, status: e.target.value })}

                            />
                            <div className="text-danger">{errors.status}</div>
                        </div>
                    </div>
                    <div className="col-lg-12 text-center modal-btn">
                        <button className="btn btn-light" onClick={closeModal}>
                            {t("ACTION.CANCEL")}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleCreateMemberStatus(memberStatus)}>
                            {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddCampaignMemberStatus;
