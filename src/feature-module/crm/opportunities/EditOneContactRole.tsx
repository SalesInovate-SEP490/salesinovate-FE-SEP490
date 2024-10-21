import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { addContactRole, getListContactRole, getListRoles, patchListContact, updatePrimaryContact } from "../../../services/opportunities";
import Swal from "sweetalert2";
import { getAllContactByOpportunity, searchContactRole } from "../../../services/Contact";
import { toast } from "react-toastify";

const initRoles = [
    { label: "--None--", value: 1 },
];

const EditOneContactRole: React.FC<{
    id?: any, getList?: any, isOpen?: boolean, setIsOpen?: any, contact?: any, opportunity?: any
}> = ({ id, getList, isOpen, setIsOpen, contact, opportunity }) => {
    const [roles, setRoles] = useState(initRoles);
    const [role, setRole] = useState<any>({
        role: 1,
        isPrimary: false
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            getListRole();
            if (contact?.coOppRelation) {
                setRole({ role: contact?.coOppRelation?.contactRole?.opportunityContactRoleId, isPrimary: contact?.coOppRelation?.primary });
            }
        }
    }, [isOpen]);

    const getListRole = () => {
        Swal.showLoading();
        getListRoles()
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    setRoles(response.data.map((item: any) => {
                        return {
                            value: item?.opportunityContactRoleId,
                            label: item?.roleName
                        }
                    }));
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            })
    }


    const handleSave = () => {
        if (role?.primary) {
            const body = {
                contactId: contact?.contactId,
                opportunityId: opportunity?.opportunityId
            }
            updatePrimaryContact(body)
                .then(response => {
                    if (response.code === 1) {
                        console.log("Primary contact updated successfully");
                    }
                })
                .catch(error => {
                })
        }
        Swal.showLoading();
        const body = {
            contactId: contact?.contactId,
            opportunityId: opportunity?.opportunityId,
            contactRole: role?.role,
        }
        patchListContact([body])
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    getList();
                    setIsOpen(false);
                    toast.success("Contact role updated successfully");
                    document.getElementById("close-btn-edit-one-contact-roles")?.click();
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            });
    };

    return (
        <div className="modal custom-modal fade" id="edit_one_contact_roles" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(false)}>
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <>
                            <h4 className="modal-title">{t("LABEL.OPPORTUNITIES.EDIT_CONTACT_ROLE")}</h4>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-12 text-left">
                                        <div className="row mb-1">
                                            <div className="col-md-3">
                                                <label>{t("LABEL.OPPORTUNITIES.OPPORTUNITY")}</label>
                                            </div>
                                            <div className="col-md-9">
                                                <span className="text-black">{opportunity?.opportunityName}</span>
                                            </div>
                                        </div>
                                        <div className="row  mb-1">
                                            <div className="col-md-3">
                                                <label>{t("LABEL.CONTACTS.CONTACT")}</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    isDisabled={true}
                                                    options={[{ value: contact?.contactId, label: contact?.contactName }]}
                                                    value={{ value: contact?.contactId, label: contact?.contactName }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row  mb-1">
                                            <div className="col-md-3">
                                                <label>{t("LABEL.OPPORTUNITIES.ROLE")}</label>
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    options={roles}
                                                    value={roles.find((item: any) => item.value === role?.role)}
                                                    onChange={(e: any) => setRole({ ...role, role: e.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                            <div className="col-md-3">
                                                <label>{t("LABEL.OPPORTUNITIES.PRIMARY_CONTACT")}</label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="checkbox" checked={role?.isPrimary} onChange={(e) => setRole({ ...role, isPrimary: e.target.checked })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-between">
                                    <div>
                                        <Link onClick={() => setIsOpen(false)} id="close-btn-edit-one-contact-roles"
                                            to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
                                            {t("ACTION.CANCEL")}
                                        </Link>
                                    </div>
                                    <div>
                                        <button onClick={handleSave} className="btn btn-success">
                                            {t("ACTION.SAVE")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditOneContactRole;
