import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { getListLeads } from "../../../services/lead";
import { addLeadToCampaign, getListCampainMemberStatus } from "../../../services/campaign_member";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UpdateCampaignLead: React.FC<{
    campaignId?: any, getList?: any, data?: any, memberStatusUpdate?: any
}> = ({ campaignId, getList, data, memberStatusUpdate }) => {
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
    const [campainOptions, setCampainOptions] = useState<any[]>([]);
    const [memberStatus, setMemberStatus] = useState<any[]>([]);
    const [leadCampaign, setLeadCampaign] = useState<any>({
        campaignMemberStatusId: null,
        updateExistingCampaignMember: 1
    });
    const { t } = useTranslation();

    useEffect(() => {
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

    return (
        <div className="modal custom-modal fade" id="update_lead_campaign" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <>
                            <div className="col-md-12">
                                <h4 className="modal-title">{t("CAMPAIGN.NEW_CAMPAIGN_MEMBER")}</h4>
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
                                </div>
                                <div className="space-between">
                                    <Link id="close-btn-add-lead-campaigns" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
                                        {t("ACTION.CANCEL")}
                                    </Link>
                                    <button onClick={handleSave} className="btn btn-success">
                                        {t("ACTION.SAVE")}
                                    </button>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCampaignLead;
