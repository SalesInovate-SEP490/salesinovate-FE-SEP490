import React, { useEffect, useState } from "react"
import { filterUser, getAllUserByRole, getUsers } from "../../services/user";
import Select, { StylesConfig } from "react-select";
import Modal from 'react-modal';
import { useTranslation } from "react-i18next";
import { addUsersToLeads, addUserToLead, getLeads, getListUserInLead } from "../../services/lead";
import { toast } from "react-toastify";
import { addUserToOpportunity, getListUserInOpportunity } from "../../services/opportunities";
import { addUserToAccounts, getListUserInAccounts, filterAccounts, filterAccountForManager, assignUserToAccount } from "../../services/account";
import { addUserToContact, getListUserInContact } from "../../services/Contact";
import { assignFilter, getListFilter } from "../../services/filter";
import { loadFromTextLeadFilter, loadFromTextAccountFilter } from "../../utils/commonUtil";
import Swal from "sweetalert2";

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
        width: '50%',
        maxWidth: '800px', // Set a maximum width
        height: '40%', // Adjust the height as needed
    },
};

const ShareData: React.FC<{
    isOpen: any;
    closeModal: () => void;
    type?: any;
    id?: any;
    listLeads?: any;
    accountType?: any;
}> = ({ isOpen, closeModal, type, id, listLeads, accountType }) => {
    const [selectBoxs, setSelectBoxs] = useState<any>({
        users: [],
    });
    const [listUsers, setListUsers] = useState<any>([]);
    const [listFilter, setListFilter] = useState<any>([]);
    const [listFilterOptions, setListFilterOptions] = useState<any>([]);
    const [filter, setFilter] = useState<any>(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (isOpen) {
            getListUser();
            getListUserInType();
        }
    }, [isOpen])

    useEffect(() => {
        const typeNumber = type === 'lead' ? 1 : type === 'account' ? 2 : type === 'contact' ? 3 : type === 'opportunity' ? 4 : 0;
        if (type === 'lead' || type === 'account') {
            getListFilter(typeNumber)
                .then((res) => {
                    if (res.code === 1) {
                        setListFilter(res?.data);
                        setListFilterOptions(res?.data?.map((item: any) => {
                            return {
                                value: item.filterStoreId,
                                label: item.filterName
                            }
                        }));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {

        }
    }, [type])

    const getListUser = () => {
        let search = "";
        if (type === 'lead') {
            search = "search=role_role_name@administrator";
        }
        const params = {
            page: 0,
            size: 10000,
        }
        filterUser(search, params)
            .then((res) => {
                if (res.code === 1) {
                    setSelectBoxs((prev: any) => {
                        return {
                            ...prev,
                            users: res?.data?.items?.map((item: any) => {
                                return {
                                    value: item?.userId,
                                    label: item?.userName
                                }
                            })
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getListUserInType = () => {
        // type = lead, opportunity, account, contact, get list user selected
        if (type === 'lead') {
            getListUserInLead(id)
                .then((res) => {
                    if (res.code === 1) {
                        const listUser = res?.data?.map((item: any) => item?.userId);
                        setListUsers(listUser);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (type === 'opportunity') {
            getListUserInOpportunity(id)
                .then((res) => {
                    if (res.code === 1) {
                        const listUser = res?.data?.map((item: any) => item?.userId);
                        setListUsers(listUser);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (type === 'account') {
            getListUserInAccounts(id)
                .then((res) => {
                    if (res.code === 1) {
                        const listUser = res?.data?.map((item: any) => item?.userId);
                        setListUsers(listUser);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else if (type === 'contact') {
            getListUserInContact(id)
                .then((res) => {
                    if (res.code === 1) {
                        const listUser = res?.data?.map((item: any) => item?.userId);
                        setListUsers(listUser);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    const handleChangeArray = (e: any, name?: any) => {
        setListUsers(
            e?.map((item: any) => item?.value)
        );
    }

    const handleSubmit = () => {
        const body = listUsers.map((item: any) => {
            return {
                userId: item
            }
        });
        const bodyArrayOnly = listUsers.map((item: any) => item);
        Swal.showLoading();
        if (type === 'lead') {
            if (listLeads?.length === 0 && !filter) {
                toast.error("Please select lead or lead filter");
                return;
            }
            if (filter) {
                const search = listFilter?.find((item: any) => item?.filterStoreId === filter)?.filterSearch;
                const query = loadFromTextLeadFilter(search);
                getLeads(0, 10000, query)
                    .then((res) => {
                        if (res.code === 1) {
                            const listLead = res?.data?.items?.map((item: any) => item?.leadId);
                            listLeads = listLead;
                            const trueBody = {
                                leadIds: listLead,
                                leadsUserDTOS: body
                            }
                            const listUser = listUsers.map((item: any) => item);
                            assignFilterLead(listUser, filter);
                            addUsersToLeads(trueBody)
                                .then((res) => {
                                    Swal.close();
                                    if (res.code === 1) {
                                        toast.success("Assign user success");
                                        closeModal();
                                    } else {
                                        toast.error(res.message);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        Swal.close();
                        console.log(err);
                    });
            } else {
                const trueBody = {
                    leadIds: listLeads,
                    leadsUserDTOS: body
                }
                // call api assign user to lead
                addUsersToLeads(trueBody)
                    .then((res) => {
                        Swal.close();
                        if (res.code === 1) {
                            toast.success("Assign user success");
                            closeModal();
                        } else {
                            toast.error(res.message);
                        }
                    })
                    .catch((err) => {
                        Swal.close();
                        console.log(err);
                    });
            }

        } else if (type === 'opportunity') {
            // call api assign user to opportunity
            addUserToOpportunity(body, id)
                .then((res) => {
                    Swal.close();
                    if (res.code === 1) {
                        toast.success("Assign user success");
                        closeModal();
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((err) => {
                    Swal.close();
                    console.log(err);
                });
        } else if (type === 'account') {
            // if (listLeads?.length === 0 && !filter) {
            //     toast.error("Please select account or account filter");
            //     return;
            // }
            // if (filter) {
            //     const search = listFilter?.find((item: any) => item?.filterStoreId === filter)?.filterSearch;
            //     const query = loadFromTextAccountFilter(search);
            //     if (accountType === 'Unassigned Account') {
            //         const param = {
            //             page: 0,
            //             size: 10000
            //         }
            //         console.log("param", param);
            //         filterAccountForManager(param, query)
            //             .then((res) => {
            //                 Swal.close();
            //                 if (res.code === 1) {
            //                     const listAccount = res?.data?.items?.map((item: any) => item?.accountId);
            //                     listLeads = listAccount;
            //                     const trueBody = {
            //                         listAccount: listAccount,
            //                         listUser: bodyArrayOnly
            //                     }
            //                     const listUser = listUsers.map((item: any) => item);
            //                     assignFilterLead(listUser, filter);
            //                     assignUserToAccount(trueBody)
            //                         .then((res) => {
            //                             if (res.code === 1) {
            //                                 toast.success("Assign user success");
            //                                 closeModal();
            //                             } else {
            //                                 toast.error(res.message);
            //                             }
            //                         })
            //                         .catch((err) => {
            //                             console.log(err);
            //                         });
            //                 }
            //             })
            //             .catch((err) => {
            //                 Swal.close();
            //                 console.log(err);
            //             });
            //     } else {
            //         const params = {
            //             page: 0,
            //             size: 10000
            //         }
            //         filterAccounts(params, query)
            //             .then((res) => {
            //                 Swal.close();
            //                 if (res.code === 1) {
            //                     const listAccount = res?.data?.items?.map((item: any) => item?.accountId);
            //                     listLeads = listAccount;
            //                     const trueBody = {
            //                         listAccount: listAccount,
            //                         listUser: bodyArrayOnly
            //                     }
            //                     const listUser = listUsers.map((item: any) => item);
            //                     assignFilterLead(listUser, filter);
            //                     assignUserToAccount(trueBody)
            //                         .then((res) => {
            //                             if (res.code === 1) {
            //                                 toast.success("Assign user success");
            //                                 closeModal();
            //                             } else {
            //                                 toast.error(res.message);
            //                             }
            //                         })
            //                         .catch((err) => {
            //                             console.log(err);
            //                         });
            //                 }
            //             })
            //             .catch((err) => {
            //                 Swal.close();
            //                 console.log(err);
            //             });
            //     }
            // } else {
            //     const trueBody = {
            //         listAccount: listLeads,
            //         listUser: bodyArrayOnly
            //     }
            //     // call api assign user to account
            //     assignUserToAccount(trueBody)
            //         .then((res) => {
            //             Swal.close();
            //             if (res.code === 1) {
            //                 toast.success("Assign user success");
            //                 closeModal();
            //             } else {
            //                 toast.error(res.message);
            //             }
            //         })
            //         .catch((err) => {
            //             Swal.close();
            //             console.log(err);
            //         });
            // }
            const trueBody = {
                listAccount: id? [id]: listLeads,
                listUser: bodyArrayOnly
            }
            assignUserToAccount(trueBody)
                .then((res) => {
                    Swal.close();
                    if (res.code === 1) {
                        toast.success("Assign user success");
                        closeModal();
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((err) => {
                    Swal.close();
                    console.log(err);
                });
        } else if (type === 'contact') {
            // call api assign user to contact
            addUserToContact(body, id)
                .then((res) => {
                    Swal.close();
                    if (res.code === 1) {
                        toast.success("Assign user success");
                        closeModal();
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((err) => {
                    Swal.close();
                    console.log(err);
                });
        }
    }

    const changeFilter = (e: any) => {
        setFilter(e?.value);
    }

    const assignFilterLead = (data: any, id: any) => {
        assignFilter(data, id)
            .then((res) => {

            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
        >
            <div className="modal-header border-0 m-0 justify-content-center text-center mb-1">
                <h4>
                    {t("COMMON.ASSIGN_TO") + " " + type ?? ""}
                </h4>
            </div>
            <div>
                {listLeads?.length > 0 ? `${listLeads.length} ${type} selected` : ""}
            </div>
            <div className="modal-body">
                <div className="row mb-1">
                    <div className="col-md-12">
                        {(type === 'lead') && (
                            <div className="col-md-12 mb-2  ">
                                <div style={{ textAlign: 'left' }}>
                                    <label className="label-text">
                                        {type === 'lead' ? t("COMMON.FILTER_SELECT_LEADS") : t("COMMON.FILTER_SELECT_ACCOUNTS")}
                                    </label>
                                </div>
                                <Select
                                    className="select"
                                    options={listFilterOptions}
                                    styles={customStyles}
                                    name="filter"
                                    isClearable={true}
                                    onChange={(e) => changeFilter(e)}
                                    value={listFilterOptions?.filter((item: any) => item?.value === filter)}
                                />
                            </div>
                        )}
                        <div className="col-md-12 mb-2  ">
                            <div style={{ textAlign: 'left' }}>
                                <label className="label-text">
                                    {t("COMMON.ASSIGN_TO")} <span className="text-danger">*</span>
                                </label>
                            </div>
                            <Select
                                className="select"
                                options={selectBoxs?.users}
                                styles={customStyles}
                                name="type"
                                isMulti={true}
                                onChange={(e) => handleChangeArray(e, 'users')}
                                isClearable={true}
                                value={listUsers?.length > 0 ? selectBoxs?.users.filter((item: any) => listUsers?.includes(item?.value)) : []}
                            />
                        </div>
                        <div className="col-lg-12 text-center modal-btn">
                            <button className="btn btn-light" onClick={closeModal}>
                                {t("ACTION.CANCEL")}
                            </button>
                            <button className="btn btn-danger" onClick={handleSubmit}>
                                {t("ACTION.SUBMIT")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ShareData;