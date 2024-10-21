export const all_routes = {
  // dashboard routes
  dealsDashboard: "/",
  leadsDashboard: "/dashboard/leads-dashboard",
  projectDashboard: "/dashboard/project-dashboard",

  //crm routes
  // activity
  activityCalls: "/crm/activity-calls",
  activityMail: "/crm/activity-mail",
  activityTask: "/crm/activity-task",
  activityMeeting: "/crm/activity-meeting",
  activities: "/crm/activities",

  // task
  tasks: "/crm/tasks",
  tasksImportant: "/crm/tasks-important",
  tasksCompleted: "/crm/tasks-completed",



  // campaign: "/crm/campaign",
  // campaignComplete: "/crm/campaign-complete",
  // campaignArchieve: "/crm/campaign-archieve",
  addCampaign: "/crm/addCampaign",
  analytics: "/crm/analytics",
  contactDetails: "/crm/contact-details",
  deals: "/crm/deals",
  dealsDetails: "/crm/deals-details",
  dealsKanban: "/crm/deals-kanban",
  contactList: "/crm/contact-list",
  leadsKanban: "/leads-kanban",
  pipeline: "/crm/pipeline",
  projects: "/crm/projects",
  companyDetails: "/crm/company-details",
  projectDetails: "/crm/project-details",
  contactGrid: "/crm/contact-grid",
  companiesGrid: "/crm/companies-grid",
  compaignComplete: "/crm/compaign-complete",
  companies: "/companies",
  leadsDetails: "/leads-details/:id",
  leads: "/leads",
  projectsGrid: "/projects-grid",

  //log call
  logCall: "/log-call/:id",

  //opporunities
  opportunities: "/opportunities",
  opportunitiesDetails: "/opportunities-details/:id",
  opportunityKanban: "/opportunity-kanban",
  listProductInOpportunity: "/opportunities-details/:id/list-products",
  listCampaignInfluenced: "/opportunities-details/:id/list-campaign-influenced",
  listContactRole: "/opportunities-details/:id/list-contact-role",
  listQuoteOpportunity: "/opportunities-details/:id/list-quotes",

  //account
  accounts: "/accounts",
  accountsDetails: "/accounts-details/:id",

  //contact
  contacts: "/contacts",
  contactsDetails: "/contacts-details/:id",

  //Product
  product: "/products",
  productDetail: "/product-details/:id",
  PriceBookByProduct: "/product-details/:id/price-book",

  // Price Book
  priceBook: "/priceBooks",
  priceBookDetail: "/price-book-details/:id",
  productsPriceBook: "/price-book-details/:id/products",

  //campaign
  campaign: "/campaigns",
  campaignDetails: "/campaign-details/:id",
  campaignComplete: "/campaign-complete",
  campaignArchieve: "/campaign-archieve",
  leadMemberCampaign: "/campaign-details/:id/lead-member",
  contactMemberCampaign: "/campaign-details/:id/contact-member",
  influencedOpportunities: "/campaign-details/:id/influenced-opportunities",
  memberStatus: "/campaign-details/:id/member-status",

  //email template
  emailTemplate: "/email-template",
  emailTemplateDetails: "/email-template-details/:id",

  //chatter
  chatter: "/chatter",

  //files
  files: "/files",

  //contract
  contracts: "/contract",
  contractDetail: "/contract-details/:id",
  contractHistory: "/contract-details/:id/contract-history",
  contractOrders: "/contract-details/:id/:contractNumber/orders",

  //orders
  orders: "/orders",
  ordersDetails: "/orders-details/:id",
  orderProducts: "/orders-details/:id/products",

  //quotes
  quotes: "/quotes",
  quotesDetails: "/quotes-details/:id",
  quoteProducts: "/quotes-details/:id/products",

  //recycle-bin
  recycleBin: "/recycle-bin",

  bankAccounts: "/bank-accounts",
  blankPage: "/blank-page",
  // calendar
  calendar: "/event",
  calendarDetail: "/event-details/:id",
  dataTables: "/data-tables",
  tablesBasic: "/tables-basic",
  notes: "/notes",
  comingSoon: "/coming-soon",

  // auth routes routes
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  twoStepVerification: "/two-step-verification",
  success: "/success",
  emailVerification: "/email-verification",
  lockScreen: "/lock-screen",
  resetPassword: "/reset-password",

  //ui routes
  alert: "/ui-alert",
  accordion: "/ui-accordion",
  avatar: "/ui-avatar",
  border: "/ui-border",
  breadcrums: "/ui-breadcrums",
  button: "/ui-buttons",
  buttonGroup: "/ui-button-group",
  cards: "/ui-cards",
  carousel: "/ui-carousel",
  colors: "/ui-colors",
  dropdowns: "/ui-dropdowns",
  grid: "/ui-grid",
  images: "/ui-images",
  lightbox: "/ui-lightbox",
  media: "/ui-media",
  modals: "/ui-modals",
  navTabs: "/ui-navtabs",
  offcanvas: "/ui-offcanvas",
  pagination: "/ui-pagination",
  placeholder: "/ui-placeholder",
  popover: "/ui-popover",
  progress: "/ui-progress",
  rangeSlider: "/ui-rangeslider",
  spinner: "/ui-spinner",
  sweetalert: "/ui-sweetalert",
  toasts: "/ui-toasts",
  tooltip: "/ui-tooltip",
  typography: "/ui-typography",
  video: "/ui-video",
  clipboard: "/ui-clipboard",
  counter: "/ui-counter",
  dragandDrop: "/ui-drag-drop",
  rating: "/ui-rating",
  ribbon: "/ui-ribbon",
  stickyNotes: "/ui-sticky-notes",
  textEditor: "/ui-text-editor",
  timeLine: "/ui-timeline",
  scrollBar: "/ui-apexchart",
  apexChat: "/ui-apexchat",
  chart: "/ui-chartjs",
  featherIcons: "/ui-feather-icon",
  falgIcons: "/ui-flag-icon",
  fantawesome: "/ui-fantawesome",
  materialIcon: "/ui-material-icon",
  pe7icon: "/ui-icon-pe7",
  simpleLineIcon: "/ui-simpleline",
  themifyIcon: "/ui-themify",
  typicon: "/ui-typicon",
  weatherIcon: "/ui-weather-icon",
  basicInput: "/forms-basic-input",
  checkboxandRadion: "/form-checkbox-radios",
  inputGroup: "/form-input-groups",
  gridandGutters: "/form-grid-gutters",
  formSelect: "/form-select",
  formMask: "/form-mask",
  fileUpload: "/form-fileupload",
  horizontalForm: "/form-horizontal",
  verticalForm: "/form-vertical",
  floatingLable: "/form-floating-labels",
  formValidation: "/form-validation",
  formSelect2: "/form-select2",
  formWizard: "/form-wizard",
  dataTable: "/tables-basic",
  tableBasic: "/data-tables",
  iconicIcon: "/icon-ionic",

  //base-ui
  uiAlerts: "/ui-alerts",
  uiAccordion: "/ui-accordion",
  uiAvatar: "/ui-avatar",
  uiBadges: "/ui-badges",
  uiBorders: "/ui-borders",
  uiButtons: "/ui-buttons",
  uiButtonsGroup: "/ui-buttons-group",
  uiBreadcrumb: "/ui-breadcrumb",
  uiCards: "/ui-cards",
  uiCarousel: "/ui-carousel",
  uiColor: "/ui-color",
  uiDropdowns: "ui-dropdowns",

  // pages routes
  error403: "/error-403",
  error404: "/error-404",
  error500: "/error-500",
  underMaintenance: "/under-maintenance",

  // settings routes
  customFields: "/app-settings/custom-fields",
  invoiceSettings: "/app-settings/invoice-settings",
  printers: "/app-settings/printers",

  bankAccount: "/financial-settings/bank-ccount",
  currencies: "/financial-settings/currencies",
  paymentGateways: "/financial-settings/payment-gateways",
  taxRates: "/financial-settings/tax-rates",

  connectedApps: "/general-settings/connected-apps",
  notification: "/general-settings/notification",
  profile: "/general-settings/profile",
  security: "/general-settings/security",

  banIpAddrress: "/other-settings/ban-ip-address",
  storage: "/other-settings/storage",

  emailSettings: "/system-settings/storage",
  gdprCookies: "/system-settings/gdpr-cookies",
  smsGateways: "/system-settings/sms-gateways",

  appearance: "/website-settings/appearance",
  companySettings: "/website-settings/company-settings",
  language: "/website-settings/language",
  localization: "/website-settings/localization",
  preference: "/website-settings/preference",
  prefixes: "/website-settings/prefixes",
  languageWeb: "/website-settings/language-web",

  // reports routes
  companyReports: "/reports/company-reports",
  contactReports: "/reports/contact-reports",
  dealReports: "/reports/deal-reports",
  leadReports: "/reports/lead-reports",
  projectReports: "/reports/project-reports",
  taskReports: "/reports/task-reports",
  reports: "/reports",
  reportDetails: "/report-details/:id",

  // application routes
  todo: "/application/todo",
  email: "/application/email",
  videoCall: "/application/video-call",
  chat: "/application/chat",
  audioCall: "/application/audio-call",
  callHistory: "/application/call-history",
  fileManager: "/application/file-manager",

  // crmsetting routes
  sources: "/crm-setting/sources",
  contactStage: "/crm-setting/contact-stage",
  industry: "/crm-setting/industry",
  calls: "/crm-setting/calls",
  lostReason: "/crm-setting/lost-reason",

  //content routes
  pages: "/content/pages",
  cities: "/content/cities",
  states: "/content/states",
  testimonials: "/content/testimonials",
  countries: "/content/countries",
  faq: "/content/faq",

  //userManagement routes
  deleteRequest: "/user-management/delete-request",
  rolesPermissions: "/user-management/roles-permissions",
  manageusers: "/user-management/manage-users",
  permissions: "/user-management/permissions",
  config: "/system/config",
  myProfile: "/my-profile",
  userdetail: "/user-detail/:id",

  //support routes
  contactMessages: "/support/contact-messages",
  tickets: "/support/tickets",

  // membership routes
  membershipplan: "/membership-plans",
  membershipAddon: "/membership-addons",
  membershipTransaction: "/membership-transactions",
};
