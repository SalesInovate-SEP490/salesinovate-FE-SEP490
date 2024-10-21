import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { getListLeads } from "../../../services/lead";
import { addLeadToCampaign, getListCampainMemberStatus } from "../../../services/campaign_member";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { filterCampaign, getCampaign } from "../../../services/campaign";
import _ from "lodash";

const AddCampaignLead: React.FC<{
    campaignId?: any, getList?: any, data?: any, memberStatusUpdate?: any;
    leadId?: any
}> = ({ campaignId, getList, data, memberStatusUpdate, leadId }) => {
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
    const handleSearchAccount = (e: any) => {
        // call api to search account
        if (e && e !== '')
            debounceFetchResults(e);
    }

    const debounceFetchResults = useCallback(
        _.debounce(async (campaignName) => {
            if (campaignName) {
                const param = {
                    search: `campaignName@${campaignName}`,
                    page: 0,
                    size: 500
                }
                filterCampaign(param)
                    .then(response => {
                        if (response.code === 1) {
                            setCampainOptions(response?.data?.items?.map((item: any) => {
                                return {
                                    id: item?.campaignId,
                                    label: item?.campaignName
                                }
                            }));
                        }
                    })
                    .catch(error => {
                        console.log("Error: ", error);
                    })
            }
        }, 300),
        []
    );

    const handleSave = () => {
        Swal.showLoading();
        const newCampaignMember = {
            leadsId: leadId,
            campaignId: leadCampaign?.campaignId,
            memberStatus: leadCampaign?.campaignMemberStatusId
        }
        addLeadToCampaign([newCampaignMember])
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    toast.success("Add lead to campaign successfully");
                    if (getList)
                        getList();
                    document.getElementById("close-btn-add-lead-campaign")?.click();
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
        <div className="modal custom-modal fade" id="add_lead_campaign" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
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
                                <div className="row" style={{ textAlign: 'left', fontWeight: 'bold' }}>
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
                                            onInputChange={handleSearchAccount}
                                            onChange={(e: any) => setLeadCampaign({ ...leadCampaign, campaignId: e?.id })}
                                            value={leadCampaign?.campaignId ? campainOptions.find(item => item.id === leadCampaign?.campaignId) : null}
                                            isClearable={true}
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
                                            isClearable={true}
                                        />
                                    </div>
                                </div>
                                <div className="space-between">
                                    <Link id="close-btn-add-lead-campaign" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
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

export default AddCampaignLead;
