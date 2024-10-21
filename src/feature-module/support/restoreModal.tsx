import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const RestoreModal: React.FC<{ action?: any; modalId?: any; closeBtn?: any }> = ({ action, modalId, closeBtn }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="modal custom-modal fade" id={modalId} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                id={closeBtn ? closeBtn : "btn-close"}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <p className="del-info">
                                    {t("MESSAGE.CONFIRM.RESTORE")}
                                </p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                        Cancel
                                    </Link>
                                    <Link to="#" onClick={action} className="btn btn-danger">
                                        OK
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RestoreModal;