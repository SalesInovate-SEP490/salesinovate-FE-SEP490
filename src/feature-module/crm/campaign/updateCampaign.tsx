import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { getCampaignById, updateCampaign } from "../../../services/campaign";
import { useTranslation } from "react-i18next";
import { Campaign } from "./type";
import { initCampaign } from "./data";
import "./campaign.scss"
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export const UpdateCampaign = (prop: any) => {
    const [campaign, setCampaign] = useState<Campaign>(prop.data || initCampaign);
    const [errors, setErrors] = useState<{ campaignName?:string; isActive?: string; status?: string }>({});
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        getCampaignDetail();
    }, []);

    useEffect(() => {
        if (campaign.description) {
            const blocksFromHTML = htmlToDraft(campaign.description);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [campaign.description]);

    const getCampaignDetail = () => {
        getCampaignById(prop.id)
            .then(response => {
                console.log("Response: detail ", response);
            // if (response.code === 1) {
                setCampaign(response);
            // }
            })
            .catch(err => { });
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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setCampaign({
                ...campaign,
                [name]: value
            });
        } else {
            if (nameChild) {
                setCampaign({
                    ...campaign,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setCampaign({
                    ...campaign,
                    [name]: e.value
                });
            }
        }

    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const validate = () => {
        let tempErrors: { campaignName?:string; isActive?: string; status?: string } = {};
       // Check required fields
       if (!campaign.campaignName?.trim()) tempErrors.campaignName = t("MESSAGE.ERROR.REQUIRED");
        if (campaign.isActive === null) tempErrors.isActive = t("MESSAGE.ERROR.REQUIRED");
        if (!campaign.status?.trim()) tempErrors.status = t("MESSAGE.ERROR.REQUIRED");

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdate = () => {
        // if (validate()) {
            campaign.roleId = campaign?.role?.roleId || 1;
            updateCampaign(campaign)
                .then(response => {
                    // if (response.code === 1) {
                        toast.success("Update campaign successfully!");
                        prop.getCampaignDetail();
                        prop.setShowPopup(false);
                        prop.getLeads(1,10);

                    // }
                })
                .catch(err => { 
                    // toast.error("Failed to update contact.");
                });
        // }
    }

    const statusOptions = [
        { label: t("CAMPAIGN.IN_PROGRESS"), value: "In Progress" },
        { label: t("CAMPAIGN.COMPLETED"), value: "Completed" },
        { label: t("CAMPAIGN.ABORTED"), value: "Aborted" },
        { label: t("CAMPAIGN.PLANNED"), value: "Planned" },
    ];

    const activeOptions = [
        { label: t("CAMPAIGN.ACTIVE"), value: true },
        { label: t("CAMPAIGN.INACTIVE"), value: false },
    ];

    const handleEditorChange = (editorState: EditorState) => {
        setEditorState(editorState);
        const contentState = editorState.getCurrentContent();
        const htmlContent = draftToHtml(convertToRaw(contentState));
        setCampaign({
            ...campaign,
            description: htmlContent,
        });
    };

    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.CAMPAIGN.UPDATE_CAMPAIGN")}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => togglePopup()}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("CAMPAIGN.CAMPAIGN_NAME")} 
                                            </label>
                                            <input type="text" className="form-control" name="campaignName"
                                                onChange={(e) => handleChange(e)} value={campaign?.campaignName} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.ACTIVE")}
                                                </label>
                                            </div>
                                            <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={activeOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "isActive")
                                                }
                                                value={activeOptions.find(
                                                    (option) => option.value === campaign.isActive
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.STATUS")}
                                                </label>
                                            </div>
                                           <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={statusOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "status")
                                                }
                                                value={statusOptions.find(
                                                    (option) => option.value === campaign.status
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.START_DATE")}
                                                </label>
                                            </div>
                                            <input type="date" className="form-control" name="startDate"
                                                onChange={(e) => handleChange(e)} value={campaign?.startDate} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.END_DATE")}
                                                </label>
                                            </div>
                                            <input type="date" className="form-control" name="endDate"
                                                onChange={(e) => handleChange(e)} value={campaign?.endDate} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("CAMPAIGN.DESCRIPTION")}
                                                </label>
                                            </div>
                                            {/* <textarea
                                                className="form-control"
                                                name="description"
                                                rows={3}
                                                onChange={(e) => handleChange(e)}
                                                value={campaign?.description}

                                            />   */}
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbar-class"
                                                wrapperClassName="wrapper-class"
                                                editorClassName="editor-class"
                                                onEditorStateChange={handleEditorChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => prop.setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Update
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}