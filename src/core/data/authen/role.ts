import { all_routes } from "../../../feature-module/router/all_routes"

const menu = all_routes;
const VIEW = 'VIEW';
const EDIT = 'EDIT';
const DELETE = 'DELETE';
const ADD = 'ADD';
const CREATE = 'CREATE';
const EXPORT = 'EXPORT';
const IMPORT = 'IMPORT';
const ASSIGN = 'ASSIGN';
const ACTION = 'ACTION';
const ASSIGN_LEAD = 'ASSIGN_LEAD';
const ASSIGN_CONTACT = 'ASSIGN_CONTACT';
const CONVERT = 'CONVERT';
const CONTACT_ROLE = 'CONTACT_ROLE';
const PRODUCTS = 'PRODUCTS';
const PRICE_BOOK = 'PRICE_BOOK';
const CAMPAIGN = 'CAMPAIGN';

export const LIST_BUTTON: any = {
    ADD: '.add-btn-permission',
    EDIT: '.edit-btn-permission',
    DELETE: '.delete-btn-permission',
    EXPORT: '.export-btn-permission',
    IMPORT: '.import-btn-permission',
    SHARE: 'share-btn-permission',
    ACTION: '.action-btn-permission',
    ASSIGN: ".assign-btn-permission",
    ASSIGN_LEAD: ".assign-lead-btn-permission",
    ASSIGN_CONTACT: ".assign-contact-btn-permission",
    CONVERT: ".convert-btn-permission",
    CONTACT_ROLE: ".contact-role-btn-permission",
    PRODUCTS: ".products-btn-permission",
    PRICE_BOOK: ".price-book-btn-permission",
    CAMPAIGN: ".campaign-btn-permission"
};

export const LIST_ACTION = [
    VIEW,
    EDIT,
    DELETE,
    ADD,
    CREATE,
    EXPORT,
    IMPORT,
    ASSIGN,
    ACTION,
    ASSIGN_LEAD,
    ASSIGN_CONTACT,
    CONVERT,
    CONTACT_ROLE,
    PRODUCTS,
    PRICE_BOOK,
    CAMPAIGN
];

export const ListRole = {
    ADMIN: 'administrator',
    MARKETING: 'marketing',
    SALE_MANAGER: 'salesmanager',
    SALES: 'sales',
    DEFAULT: 'default-roles-master',
    SDR: 'sdr',
}

export const data: any = [
    {
        path: "/",
        [ListRole.ADMIN]: [VIEW],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.DEFAULT]: [VIEW],
        [ListRole.SDR]: [VIEW]
    },
    {
        path: menu.dealsDashboard,
        [ListRole.ADMIN]: [VIEW],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW],
        [ListRole.DEFAULT]: [VIEW],
        [ListRole.SDR]: [VIEW]
    },
    // campaign management
    {
        path: menu.campaign,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.campaignDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN_CONTACT, ASSIGN_LEAD],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN_LEAD],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, ADD, IMPORT, EXPORT, ASSIGN_CONTACT],
        [ListRole.SALES]: [VIEW, CREATE, ADD, IMPORT, EXPORT, ASSIGN_CONTACT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    // Accounts management
    {
        path: menu.accounts,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.accountsDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },
    // lead management
    {
        path: menu.leads,
        [ListRole.ADMIN]: [VIEW, ADD, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SALES]: [],
        [ListRole.SDR]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
    },
    {
        path: menu.leadsKanban,
        [ListRole.ADMIN]: [VIEW, ADD, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SALES]: [],
        [ListRole.SDR]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.leadsDetails,
        [ListRole.ADMIN]: [VIEW, ADD, EDIT, DELETE, ADD, IMPORT, EXPORT, CONVERT, ASSIGN, CAMPAIGN],
        [ListRole.MARKETING]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, CONVERT, ASSIGN, CAMPAIGN],
        [ListRole.SALE_MANAGER]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SDR]: [VIEW, ADD, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, CONVERT, ASSIGN, CAMPAIGN],
    },

    // opportunity management
    {
        path: menu.opportunities,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, ADD, EXPORT, ASSIGN],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.opportunitiesDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, CONTACT_ROLE, ASSIGN],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, ADD, EXPORT, CONTACT_ROLE, ASSIGN],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, ADD, IMPORT, EXPORT, CONTACT_ROLE, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.opportunityKanban,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, ADD, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW],
    },

    // contacts management
    {
        path: menu.contacts,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.contactsDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ASSIGN],
        [ListRole.SDR]: [VIEW],
    },

    // product management
    {
        path: menu.product,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.productDetail,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRICE_BOOK],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRICE_BOOK],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.PriceBookByProduct,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRICE_BOOK],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRICE_BOOK],
        [ListRole.SDR]: [VIEW],
    },

    //price book management
    {
        path: menu.priceBook,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.priceBookDetail,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRODUCTS],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, PRODUCTS],
        [ListRole.SDR]: [VIEW],
    },

    // contract management
    {
        path: menu.contracts,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.contractDetail,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.contractOrders,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // email template management
    {
        path: menu.emailTemplate,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.emailTemplateDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    // files management
    {
        path: menu.files,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // recyclebin management
    {
        path: menu.recycleBin,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // manage user
    {
        path: menu.manageusers,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [],
    },
    {
        path: menu.myProfile,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],

    },

    // email template management
    {
        path: menu.listProductInOpportunity,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ACTION],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // chatter management
    {
        path: menu.chatter,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ACTION],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // files management
    {
        path: menu.files,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT, ACTION],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },

    // calendar management
    {
        path: menu.calendar,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.reports,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, ADD, IMPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.reportDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, ADD, IMPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.leadMemberCampaign,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW],
        [ListRole.SALE_MANAGER]: [VIEW],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.contactMemberCampaign,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.influencedOpportunities,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW],
    },
    {
        path: menu.memberStatus,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, ADD, IMPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.listCampaignInfluenced,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.listContactRole,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.orders,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, ADD, IMPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.calendarDetail,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.ordersDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.orderProducts,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.quotes,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.quotesDetails,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.quoteProducts,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.listQuoteOpportunity,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.logCall,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.config,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [],
    },
    {
        path: menu.productsPriceBook,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [],
    },
    {
        path: menu.profile,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.forgotPassword,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALES]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SALE_MANAGER]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.SDR]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
    },
    {
        path: menu.userdetail,
        [ListRole.ADMIN]: [VIEW, CREATE, EDIT, DELETE, ADD, IMPORT, EXPORT],
        [ListRole.MARKETING]: [],
        [ListRole.SALES]: [],
        [ListRole.SALE_MANAGER]: [],
        [ListRole.SDR]: [],
    }
]