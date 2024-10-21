import React, { useEffect, useState } from 'react';
import { sendEmail } from '../../../services/emailTemplate';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { importAccount } from '../../../services/account';

const ImportAccount = () => {
    const [file, setFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<any>(null);
    const { t } = useTranslation();

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select a file first!');
            return;
        }

        // Check file extension
        const allowedExtensions = /(\.xlsx)$/i;
        if (!allowedExtensions.exec(file.name)) {
            setError(t("MESSAGE.ERROR.EXCEL_ONLY"));
            return;
        }
        // Check file size
        if (file.size > 10485760) {
            setError(t("MESSAGE.ERROR.FILE_TOO_LARGE"));
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append("userId", "1");

        setUploading(true);
        setError(null);

        importAccount(formData)
            .then(response => {
                setUploading(false);
                if (response.code === 1) {
                    toast.success("Import account successfully!");
                    document.getElementById("btn-close-import-account")?.click();
                    document.getElementById("refresh-btn")?.click();
                    //clear file in tsx and html
                    setFile(null);
                    const fileInput: any = document.querySelector('input[type="file"]');
                    if (fileInput) {
                        fileInput.value = '';
                    }
                } else {
                    toast.error("Import account failed!");
                }
            })
            .catch(error => {
                setUploading(false);
                console.log("Error: ", error);
            })
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/assets/template/account_template.xlsx';
        link.download = 'account_template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearFile = () => {
        setFile(null);
        const fileInput: any = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
        setError(null);
    }

    return (
        <div>
            <div
                className="modal custom-modal fade"
                id="import_accounts"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                id="btn-close-import-account"
                                data-bs-dismiss="modal"
                                onClick={clearFile}
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-message">
                                <h3 className='text-center'>{t("LABEL.ACCOUNTS.IMPORT_ACCOUNT")}</h3>
                                {error && <h5 style={{ color: 'red', textAlign: 'center' }}>{error}</h5>}
                                <div className='col-md-12'>
                                    <div className="row">
                                        <label className="col-form-label col-md-3">{t("LABEL.LEADS.FILE_TEMPLATE")}</label>
                                        <div className='col-md-5'>
                                            <button className='btn custom-btn-blue-black' onClick={handleDownload}>
                                                {t("LABEL.LEADS.DOWNLOAD_TEMPLATE")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3 row">
                                        <label className="col-form-label col-md-3">{t("LABEL.LEADS.FILE_IMPORT")}</label>
                                        <div className="col-md-9">
                                            <input className="form-control" type="file" onChange={handleFileChange} />
                                            <span className='row'>{t("MESSAGE.COMMON.TYPE_ACCEPT_EXCEL")}</span>
                                            <span className='row'>{t("MESSAGE.COMMON.10MB_MAX")}</span>
                                        </div>
                                    </div>
                                    <button className='btn submit-btn-custom' onClick={handleFileUpload} disabled={uploading}>
                                        {uploading ? 'Importing...' : 'Upload and Import Leads'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Import Lead Modal */}
        </div>
    );
};

export default ImportAccount;