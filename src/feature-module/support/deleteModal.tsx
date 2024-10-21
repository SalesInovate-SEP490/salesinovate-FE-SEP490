import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const DeleteModal: React.FC<{ handleDelete?: any; deleteId?: any; closeBtn?: any }> = ({ handleDelete, deleteId, closeBtn }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="modal custom-modal fade" id={deleteId} role="dialog">
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
                                <div className="success-popup-icon">
                                    <i className="ti ti-trash-x" />
                                </div>
                                <p className="del-info">
                                    {t("MESSAGE.CONFIRM.DELETE")}
                                </p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                        Cancel
                                    </Link>
                                    <Link to="#" onClick={handleDelete} className="btn btn-danger">
                                        Yes, Delete it
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

export default DeleteModal;