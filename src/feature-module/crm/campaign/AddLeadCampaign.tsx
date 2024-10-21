import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { addProducts, searchProductsToAdd } from "../../../services/priceBook";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { getListLeads } from "../../../services/lead";
import { addLeadToCampaign, getListCampainMemberStatus } from "../../../services/campaign_member";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AddLeadCampaign: React.FC<{
    campaignId?: any, getList?: any, data?: any, memberStatusUpdate?: any
}> = ({ campaignId, getList, data, memberStatusUpdate }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
    const [items, setItems] = useState<any>({
        initItems: [],
        items: []
    });
    const [campainOptions, setCampainOptions] = useState<any[]>([]);
    const [memberStatus, setMemberStatus] = useState<any[]>([]);
    const [leadCampaign, setLeadCampaign] = useState<any>({
        campaignMemberStatusId: null,
        updateExistingCampaignMember: 1
    });
    const [step, setStep] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        searchLeadToAdd();
        getListMemberStatus();
    }, []);

    useEffect(() => {
        if (memberStatusUpdate && memberStatusUpdate.length > 0) {
            setMemberStatus(memberStatusUpdate.map((item: any) => {
                return {
                    id: item?.campaignMemberStatusId,
                    label: item?.campaignMemberStatusName
                }
            }));
        }
    }, [memberStatusUpdate]);

    useEffect(() => {
        if (data) {
            setCampainOptions([{
                id: data?.campaignId,
                label: data?.campaignName
            }])
        }
    }, [data]);

    const searchLeadToAdd = () => {
        const param = {
            pageNo: 0,
            pageSize: 100,
        }
        getListLeads(param)
            .then(response => {
                if (response.code === 1) {
                    const leads = response.data.items;
                    setProducts(leads?.map((item: any) => {
                        return {
                            ...item,
                            key: item.leadId
                        }
                    }));
                    setItems({
                        initItems: leads?.map((item: any) => { return { label: item?.firstName + " " + item?.lastName, value: item.leadId } }),
                        items: leads?.map((item: any) => { return { label: item?.firstName + " " + item?.lastName, value: item.leadId } })
                    });
                }
            })
            .catch(error => {
                console.log("error: ", error);
            })
    }

    const getListMemberStatus = () => {
        // get list member status
        getListCampainMemberStatus()
            .then(response => {
                if (response.code === 1) {
                    setMemberStatus(response?.data?.map((item: any) => {
                        return {
                            id: item?.campaignMemberStatusId,
                            label: item?.campaignMemberStatusName
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
            title: t("TITLE.LEADS.NAME"),
            dataIndex: 'name',
            key: "name",
            render: (value: undefined, record: Partial<any>) => {
                return <Link to={"/leads-details/" + record?.leadId}>{record?.firstName + " " + record?.lastName}</Link>
            }
        },
        {
            title: t("LABEL.LEADS.TITLE"),
            dataIndex: "title",
            key: "title",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.title ?? ""}
                </span>
        },
        {
            title: t("TITLE.LEADS.COMPANY"),
            dataIndex: "company",
            key: "company",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.company ?? ""}
                </span>
        },
        {
            title: t("TITLE.LEADS.PHONE"),
            dataIndex: "phone",
            key: "phone",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.phone ?? ""}
                </span>
        },
        {
            title: t("TITLE.LEADS.EMAIL"),
            dataIndex: "email",
            key: "email",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.email ?? ""}
                </span>
        },
        {
            title: t("TITLE.LEADS.STATUS"),
            dataIndex: "status",
            key: "status",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.status?.leadStatusName ?? ""}
                </span>
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedProductKeys,
        onChange: (selectedRowKeys: any[]) => {
            setSelectedProductKeys(selectedRowKeys);
            const unSelectedItems = items?.initItems.filter((item: any) => !selectedRowKeys.includes(item.value));
            setItems({ ...items, items: unSelectedItems });
        }
    };

    const handleNext = () => {
        if (selectedProductKeys.length > 0) {
            setStep(2);
            const selectedProducts = products.filter(product => selectedProductKeys.includes(product.key));
            setEditableProduct(selectedProducts);
        }
    };

    const handleSave = () => {
        Swal.showLoading();
        const listProducts = editableProduct.map(lead => {
            return {
                leadsId: lead?.leadId,
                campaignId,
                memberStatus: leadCampaign?.campaignMemberStatusId,
            }
        });
        addLeadToCampaign(listProducts)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    toast.success("Add lead to campaign successfully");
                    if (getList)
                        getList();
                    searchLeadToAdd();
                    setStep(1);
                    setSelectedProductKeys([]);
                    document.getElementById("close-btn-add-lead-campaigns")?.click();
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
        const isChecked = selectedProductKeys.includes(e.value);
        if (isChecked) return;
        setSelectedProductKeys(prev => { return [...prev, e.value] });
        setItems({ ...items, items: items.items.filter((item: any) => item.value !== e.value) });
    }

    return (
        <div className="modal custom-modal fade" id="add_leads_campaign" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {
                            step === 1 &&
                            <>
                                <h4 className="modal-title">{t("CAMPAIGN.ADD_LEAD_TO_CAMPAIGN")}</h4>
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
                                <div className="success-message text-center">
                                    <div className="col-lg-12 text-center modal-btn">
                                        <div className="table-responsive custom-table col-md-12">
                                            <Table
                                                dataSource={products}
                                                columns={columns}
                                                rowSelection={rowSelection}
                                            />
                                        </div>
                                        <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
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
                                <div className="col-md-12">
                                    <h4 className="modal-title">{t("CAMPAIGN.ADD_LEAD_TO_CAMPAIGN")}</h4>
                                    <div className="row" style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                        <span>{editableProduct.length} leads selected</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div style={{ textAlign: 'left' }}>
                                                <label>{t("CAMPAIGN.CAMPAIGN")}</label>
                                            </div>
                                            <Select
                                                className="select"
                                                options={campainOptions}
                                                styles={customStyles}
                                                name="campaign"
                                                value={campainOptions[0]}
                                                isDisabled={true}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <div style={{ textAlign: 'left' }}>
                                                <label>{t("CAMPAIGN.MEMBER_STATUS")}</label>
                                            </div>
                                            <Select
                                                className="select"
                                                options={memberStatus}
                                                styles={customStyles}
                                                name="campaign"
                                                value={memberStatus.find(item => item.id === leadCampaign?.campaignMemberStatusId)}
                                                onChange={(e) => setLeadCampaign({ ...leadCampaign, campaignMemberStatusId: e?.id })}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <div style={{ textAlign: 'left' }}>
                                                <label>{t("CAMPAIGN.UPDATE_EXISTING_CAMPAIGN_MEMBER")}</label>
                                            </div>
                                            <div className="col-md-12 form-check form-check-inline" style={{ textAlign: 'left' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="updateExistingCampaignMember"
                                                    id="inlineRadio1"
                                                    value={1}
                                                    checked={leadCampaign?.updateExistingCampaignMember === 1}
                                                    onClick={() => setLeadCampaign({ ...leadCampaign, updateExistingCampaignMember: 1 })}
                                                />
                                                <label className="form-check-label" htmlFor="inlineRadio1">{t("CAMPAIGN.KEEP_MEMBER_STATUS")}</label>
                                            </div>
                                            <div className="col-md-12 form-check form-check-inline" style={{ textAlign: 'left' }}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="updateExistingCampaignMember"
                                                    id="inlineRadio2"
                                                    value={2}
                                                    checked={leadCampaign?.updateExistingCampaignMember === 2}
                                                    onClick={() => setLeadCampaign({ ...leadCampaign, updateExistingCampaignMember: 2 })}
                                                />
                                                <label className="form-check-label" htmlFor="inlineRadio2">{t("CAMPAIGN.OVERWRITE_MEMBER_STATUS")}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-between">
                                        <div>
                                            <Link to="#" className="btn btn-light" onClick={() => setStep(1)}>
                                                {t("ACTION.BACK")}
                                            </Link>
                                        </div>
                                        <div>
                                            <Link id="close-btn-add-lead-campaigns" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
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

export default AddLeadCampaign;
