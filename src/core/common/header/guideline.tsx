import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { all_routes } from "../../../feature-module/router/all_routes";
import LeadGuideline from "./lead_guideline";
import AccountGuideline from "./account_guideline";
import ContactGuideline from "./contact_guideline";
import OpportunityGuideline from "./opportunity_guideline";
import CampaignGuideline from "./campaign_guideline";
import ProductGuideline from "./product_guideline";
import PriceBookGuideline from "./priceBook_guideline";
import EmailTemplateGuideline from "./emailTemplate_guideline";
import ContractGuideline from "./contract_guideline";
import OrderGuideline from "./order_guideline";
import QuoteGuideline from "./quote_guideline";
import './guideline.css';

const GuideLine: React.FC<any> = () => {
    const [content, setContent] = useState<React.ReactNode>("");    
    const location = useLocation();

    useEffect(() => {
        const updateContent = () => {
            if (all_routes?.leads?.includes(location.pathname)) {
                setContent(<LeadGuideline />);
            } else if (all_routes?.contacts?.includes(location.pathname)) {
                setContent(<ContactGuideline />);
            } else if (all_routes?.accounts?.includes(location.pathname)) {
                setContent(<AccountGuideline />);
            } else if (all_routes?.opportunities?.includes(location.pathname)) {
                setContent(<OpportunityGuideline />);
            } else if (all_routes?.campaign?.includes(location.pathname)) {
                setContent(<CampaignGuideline />);
            } else if (all_routes?.product?.includes(location.pathname)) {
                setContent(<ProductGuideline />);
            } else if (all_routes?.priceBook?.includes(location.pathname)) {
                setContent(<PriceBookGuideline />);
            } else if (all_routes?.emailTemplate?.includes(location.pathname)) {
                setContent(<EmailTemplateGuideline />);
            } else if (all_routes?.contracts?.includes(location.pathname)) {
                setContent(<ContractGuideline />);
            } else if (all_routes?.orders?.includes(location.pathname)) {
                setContent(<OrderGuideline />);
            } else if (all_routes?.quotes?.includes(location.pathname)) {
                setContent(<QuoteGuideline />);
            } else {
                setContent("No guideline is available here !");
            }
        };

        updateContent();

        // Optional: Cleanup to avoid memory leaks
        return () => setContent("");
    }, [location.pathname]); // Dependency array includes location.pathname to re-run the effect on URL change

    return (
        <div>{content}</div>
    );
}

export default GuideLine;
