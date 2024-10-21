import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { addContactRole, getListRoles, updatePrimaryContact } from "../../../services/opportunities";
import Swal from "sweetalert2";
import { getAllContactByOpportunity, searchContactRole } from "../../../services/Contact";
import { toast } from "react-toastify";

const initRoles = [
    { label: "--None--", value: 1 },
];

const AddProductModal: React.FC<{
    id?: any, getList?: any, isOpen?: boolean, setIsOpen?: any
}> = ({ id, getList, isOpen, setIsOpen }) => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [contactRoles, setContactRoles] = useState<any[]>([]);
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
    const [items, setItems] = useState<any>({
        initItems: [],
        items: []
    });
    const [roles, setRoles] = useState(initRoles);
    const [errors, setErrors] = useState<any>({});
    const [primaryContact, setPrimaryContact] = useState<any>(null);
    const [step, setStep] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        console.log("Is open: ", isOpen)
        if (isOpen) {
            getContacts();
            searchContact();
            getListRole();
        }
    }, [isOpen]);

    const getContacts = () => {
        Swal.showLoading();
        const params = {
            pageNo: 0,
            pageSize: 100,
            opportunityId: id
        }
        getAllContactByOpportunity(params)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    setContacts(response?.data?.items?.map((item: any) => {
                        return {
                            ...item,
                            key: item?.contactId
                        }
                    }));
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            })

    }

    const searchContact = () => {
        const param = {
            opportunityId: id,
            search: ''
        }
        searchContactRole(param)
            .then(response => {
                if (response.code === 1) {
                    setContactRoles(response.data);
                    setItems({
                        initItems: response.data.map((item: any) => { return { label: item?.firstName + " " + item?.lastName, value: item.contactId } }),
                        items: response.data.map((item: any) => { return { label: item?.firstName + " " + item?.lastName, value: item.contactId } })
                    });
                }
            })
            .catch(error => {
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


    const columns = [
        {
            title: t("CONTACT.CONTACT_NAME"),
            dataIndex: 'contactName',
            key: "contactName",
            render: (value: undefined, record: Partial<any>) => {
                return <Link to={"/contact-details/" + record?.contactId}>{record?.firstName + " " + record?.lastName}</Link>
            }
        },
        {
            title: t("LABEL.CONTACTS.PHONE"),
            dataIndex: "phone",
            key: "phone",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.phone}
                </span>
        },
        {
            title: t("LABEL.CONTACTS.EMAIL"),
            dataIndex: "email",
            key: "email",
            render: (value: any, record: Partial<any>) => (
                <div>{record?.email}</div>
            )
        },
    ];


    const editableColumns = [
        {
            title: t("CONTACT.CONTACT"),
            dataIndex: "contact",
            key: "contact",
            render: (value: any, record: Partial<any>) => (
                record?.contactId ? (<>
                    <Select
                        options={items?.initItems}
                        value={items?.initItems.find((item: any) => item.value === record?.contactId)}
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
        setEditableProduct(prevState => prevState.map(product =>
            product?.contactId === contactId ? { ...product, [label]: listPrice } : product
        ));
    };

    const rowSelection = {
        selectedRowKeys: selectedProductKeys,
        onChange: (selectedRowKeys: any[]) => {
            // add one only, if user choose already, disabled checkbox
            if (selectedRowKeys.length > 1) {
                const unSelectedItems = items?.initItems?.filter((item: any) => !selectedRowKeys.includes(item.value));
                setItems({ ...items, items: unSelectedItems });
                return;
            }
            setSelectedProductKeys(selectedRowKeys);
            const unSelectedItems = items?.initItems?.filter((item: any) => !selectedRowKeys.includes(item.value));
            setItems({ ...items, items: unSelectedItems });
        }
    };

    const handleNext = () => {
        if (selectedProductKeys?.length > 0) {
            setStep(2);
            let selectedProducts = contacts?.filter(contact => selectedProductKeys.includes(contact.contactId));
            console.log("selectedProducts: ", selectedProducts);
            if (!selectedProducts || selectedProducts?.length <= 0) {
                selectedProducts = contactRoles?.filter(contact => selectedProductKeys.includes(contact.contactId));
                console.log("selectedProducts: ", selectedProducts, contactRoles, selectedProductKeys);
            }
            setEditableProduct(selectedProducts);
        }
    };

    const validateEditedProducts = () => {
        let tempErrors: any = {};
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0 ? null : tempErrors;
    }

    const handleSave = () => {
        if (validateEditedProducts()) return;
        const listProducts = editableProduct.map(product => {
            return {
                opportunityId: id,
                contactId: product.contactId,
                contactRole: product.role,
            }
        });
        Swal.showLoading();
        if (primaryContact) {
            const primaryContactUpdate = {
                opportunityId: id,
                contactId: primaryContact,
                contactRole: editableProduct.find((item: any) => item.contactId === primaryContact)?.role
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
        addContactRole(listProducts[0])
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    toast.success("Add contact role successfully");
                    if (getList) getList();
                    searchContact();
                    setStep(1);
                    setSelectedProductKeys([]);
                    document.getElementById("close-btn-add-contact-roles")?.click();
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

    const selectSearch = (e: any) => {
        if (selectedProductKeys?.length >= 1) {
            return;
        }
        const isChecked = selectedProductKeys.includes(e.value);
        if (isChecked) return;
        setSelectedProductKeys(prev => { return [...prev, e.value] });
        setItems({ ...items, items: items.items.filter((item: any) => item.value !== e.value) });
    }

    return (
        <div className="modal custom-modal fade" id="add_contact_roles" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            onClick={() => setIsOpen(false)}
                        >
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {
                            step === 1 &&
                            <>
                                <h4 className="modal-title">{t("LABEL.OPPORTUNITIES.ADD_CONTACT_ROLES")}</h4>
                                <div className="col-md-12">
                                    <Select
                                        className="select"
                                        options={items?.items}
                                        styles={customStyles}
                                        name="status"
                                        onChange={selectSearch}
                                        value={null}
                                    />
                                </div>
                                <div style={{ float: 'left' }}>
                                    {selectedProductKeys.length > 0 && <span>{selectedProductKeys.length} {t("CAMPAIGN.RECORDS_SELECTED")}</span>}
                                </div>
                                <div className="success-message text-center">
                                    <div className="col-lg-12 text-center modal-btn">
                                        <div className="table-responsive custom-table col-md-12">
                                            <Table
                                                dataSource={contacts}
                                                columns={columns}
                                                rowSelection={rowSelection}
                                            />
                                        </div>
                                        <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {t("ACTION.CANCEL")}
                                        </Link>
                                        <button onClick={handleNext} className="btn btn-danger" disabled={selectedProductKeys.length <= 0}>
                                            {t("ACTION.NEXT")}
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            step === 2 &&
                            <>
                                <h4 className="modal-title">{t("LABEL.OPPORTUNITIES.EDIT_SELECTED_CONTACT_ROLE")}</h4>
                                <div>
                                    <label>{t("LABEL.OPPORTUNITIES.PRIMARY_CONTACT_OPTIONAL")}</label>
                                    <Select
                                        options={editableProduct?.map((item: any) => ({ value: item.contactId, label: (item?.firstName + " " + item?.lastName) })) || []}
                                        value={editableProduct?.find((item: any) => item.value === primaryContact)}
                                        onChange={(e) => setPrimaryContact(e.value)}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <div className="table-responsive custom-table col-md-12">
                                        <Table
                                            dataSource={editableProduct}
                                            columns={editableColumns}
                                            pagination={false}
                                            rowSelection={undefined} // Remove rowSelection to remove checkboxes
                                        />
                                        <div className="text-center" style={{ minHeight: '300px' }}></div>
                                    </div>
                                    <div className="space-between">
                                        <div>
                                            <Link to="#" className="btn btn-light" onClick={() => setStep(1)}>
                                                {t("ACTION.BACK")}
                                            </Link>
                                        </div>
                                        <div>
                                            <Link id="close-btn-add-contact-roles" to="#"
                                                onClick={() => setIsOpen(false)}
                                                className="btn btn-light mr-1" data-bs-dismiss="modal">
                                                {t("ACTION.CANCEL")}
                                            </Link>
                                            <button onClick={handleSave} className="btn btn-success">
                                                {t("ACTION.SAVE")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
