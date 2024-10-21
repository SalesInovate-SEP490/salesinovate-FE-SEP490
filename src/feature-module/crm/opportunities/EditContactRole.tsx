import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { addContactRole, getListContactRole, getListRoles, patchListContact, updatePrimaryContact } from "../../../services/opportunities";
import Swal from "sweetalert2";
import { getAllContactByOpportunity, searchContactRole } from "../../../services/Contact";
import { toast } from "react-toastify";
import { label } from "yet-another-react-lightbox/*";

const initRoles = [
    { label: "--None--", value: 1 },
];

const EditContactRole: React.FC<{
    id?: any, getList?: any, isOpen?: boolean, setIsOpen?: any
}> = ({ id, getList, isOpen, setIsOpen }) => {
    const [editableContact, setEditableContact] = useState<any[]>([]);
    const [roles, setRoles] = useState(initRoles);
    const [primaryContact, setPrimaryContact] = useState<any>(null);
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            getListRole();
            getListContact();
        }
    }, [isOpen]);

    const getListContact = () => {
        Swal.showLoading();
        const params = {
            opportunityId: id,
            pageNo: 0,
            pageSize: 1000
        }
        getListContactRole(params)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    setEditableContact(response?.data?.items?.map((item: any) => {
                        if (item?.coOppRelation?.primary) {
                            setPrimaryContact(item?.contactId);
                        }
                        return {
                            contactId: item?.contactId,
                            role: item?.coOppRelation?.contactRole?.opportunityContactRoleId,
                            contactName: item?.contactName,
                            value: item?.contactId,
                            label: item?.contactName
                        }
                    }));
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            })
    }

    const getListRole = () => {
        getListRoles()
            .then(response => {
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
                console.log("error: ", error);
            })
    }

    const editableColumns = [
        {
            title: t("CONTACT.CONTACT"),
            dataIndex: "contact",
            key: "contact",
            render: (value: any, record: Partial<any>) => (
                record?.contactId ? (<>
                    <Select
                        options={editableContact.map((item: any) => ({ value: item.contactId, label: item.contactName })) || []}
                        value={editableContact?.find((item: any) => item.value === record?.contactId)}
                        onChange={(e) => handleChangeEdited(record.contactId, 'contactId', e.value)}
                    />
                </>) : (
                    <div className="empty-cell"></div>
                )
            )
        },
        {
            title: t("CONTACT.ROLE"),
            dataIndex: "role",
            key: "role",
            render: (value: any, record: Partial<any>) => (
                record?.contactId !== null ? (
                    <>
                        <Select
                            options={roles}
                            value={roles.find((role: any) => role.value === record?.role)}
                            onChange={(e: any) => handleChangeEdited(record.contactId, 'role', e.value)}
                        />
                    </>
                ) : (
                    <div className="empty-cell" />
                )
            )
        },
    ];


    const handleChangeEdited = (contactId: any, label: string, listPrice: string) => {
        setEditableContact(prevState => prevState.map(contact =>
            contact?.contactId === contactId ? { ...contact, [label]: listPrice } : contact
        ));
    };

    const validateEditedProducts = () => {
        let tempErrors: any = {};
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0 ? null : tempErrors;
    }

    const handleSave = () => {
        if (validateEditedProducts()) return;
        const listContacts = editableContact.map(contact => {
            return {
                opportunityId: id,
                contactId: contact.contactId,
                contactRole: contact.role,
            }
        });
        if (primaryContact) {
            const primaryContactUpdate = {
                opportunityId: id,
                contactId: primaryContact,
                contactRole: editableContact.find((item: any) => item.contactId === primaryContact)?.role
            }
            updatePrimaryContact(primaryContactUpdate)
                .then(response => {
                    if (response.code === 1) {
                        console.log("Primary contact updated successfully");
                    } else {
                        toast.error(response.message);
                    }
                })
                .catch(error => {
                    console.log("error: ", error);
                })
        }
        Swal.showLoading();
        patchListContact(listContacts)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    toast.success("Edit contact role successfully");
                    if (getList) getList();
                    document.getElementById("close-btn-edit-contact-roles")?.click();
                } else {
                    toast.error(response.message);
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            })
    };

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

    return (
        <div className="modal custom-modal fade" id="edit_contact_roles" role="dialog">
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
                            <div className="mb-1 mt-1">
                                <label>{t("LABEL.OPPORTUNITIES.PRIMARY_CONTACT_OPTIONAL")}</label>
                                <Select
                                    styles={customStyles}
                                    options={editableContact.map((item: any) => ({ value: item.contactId, label: item.contactName })) || []}
                                    value={editableContact?.find((item: any) => item.value === primaryContact)}
                                    onChange={(e) => setPrimaryContact(e.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive custom-table col-md-12">
                                    <Table
                                        dataSource={editableContact}
                                        columns={editableColumns}
                                        pagination={false}
                                        rowSelection={undefined} // Remove rowSelection to remove checkboxes
                                    />
                                    <div className="text-center" style={{ minHeight: '300px' }}></div>
                                </div>
                                <div className="space-between">
                                    <div>
                                        <Link onClick={() => setIsOpen(false)} id="close-btn-edit-contact-roles"
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

export default EditContactRole;
