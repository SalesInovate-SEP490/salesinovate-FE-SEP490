export interface CommonState {
  darkMode: boolean;
}
export interface RootState {
  headerCollapse: boolean; // Assuming headerCollapse is a boolean value
}
export interface TableData {
  questions: string;
  category: string;
  answers: string;
  created_at: string;
  name: string;
  type: string;
  progress: string;
  members: string;
  startDate: string;
  endDate: string;
  lead_name: string;
  lead_title: string;
  company_address: string;
  pages: string;
  page_slug: string;
  phone: string;
  company_name: string;
  location: string;
  Action: string;
  rating: string;
  owner: string;
  created: string;
  leadName: string;
  leadTitle: string;
  companyName: string;
  source: string;
  leadOwner: string;
  createdDate: string;
  leadStatus: string;
  email: string;
  Stage: string;
  Deal_Value: string;
  close_date: string;
  Probability: string;
  Status: string;
  created_date: string;
  Deal_Name: string;
  industry: string;
  company: string;
  wonDeals: string;
  lostDeals: string;
  dateCreated: string;
  budgetValue: string;
  currentlySpend: string;
  pipelineStage: string;
  client: string;
  priority: string;
  dueDate: string;
  taskName: string;
  assignedTo: string;
  status: string;
  createdAt: string;
  title: string;
  roleName: string;
  amount: string;
  date: string;
  paymentType: string;
  createdat: string;
  no_deal: string;
  deal_value: string;
  stage: string;
  dealValue: string;
  start_date: string;
  end_date: string;
  piority: string;
  customer_no: string;
  customer_name: string;
  content: string;
  userName: string;
  firstName: string;
  lastName: string;
  lastModifiedBy: string;
  opportunityName: string;
  accountId: number;
  closeDate: string;
  opportunityOwner: string;
  opportunityId: number;
  accountName: string;
  emailTemplateId: number;
  mailSubject: string;
  // Contact
  id: string;
  contactId: number;
  userId: number;
  department:string;
  mobile:string;
  fax:string;
  createdBy: string;
  createDate: Date;
  editDate: Date;
  editBy: string;
  isDeleted: boolean;
  addressInformationId: number;
  contactSalutionId: number;
  middleName:string;
  reportTo: number;
  suffix:string;
  role:any;
  roleId:number;
  
  reportName: string;
  reportType: string;
  description: string;

}

export interface Campaign{
    id: string;
    campaignId: number;
    campaignName: string;
    status: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    role:any;
    roleId:number;
}

export interface Product{
  id: string;
  productId: number;
  userId: number;
  productName: string;
  productCode: string;
  productDescription: string;
  isActive: boolean;
  productFamily: string;
  role: any;
  roleId:number;
}

export interface status {
  text: string;
  status: string;
}

export interface DatatableProps {
  columns: any[]; // You can replace `any[]` with the specific type of columns you expect
  dataSource: any[]; // You can replace `any[]` with the specific type of dataSource you expect
  pagination: boolean | undefined;
}

export interface CountriesData {
  name: string;
  countryName: string;
  countryId: string;
  startDate: string;
  endDate: string;
  countryCode: string;
}
export interface DealsInterface {
  dealName: string;
  stage: string;
  dealValue: string;
  tag1: string;
  closeDate: string;
  crearedDate: string;
  owner: string;
  status: string;
  probability: string;
}
export interface DeleteRequestInterface {
  id: number;
  si_no: string;
  select: string;
  customer_name: string;
  customer_image: string;
  customer_no: string;
  created: string;
  delete_request: string;
  Action: string;
}
export interface AppState {
  mouseOverSidebar: string;
}

export interface Lead {
  leadId: number;
  customerId: number;
  accountId: number;
  industry: any;
  status: any;
  source: any;
  firstName: string;
  lastName: string;
  gender: number;
  title: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  address: string;
  createdBy: string;
  createDate: string;
  editBy: string;
  editDate: string;
  lastModifiedBy: string;
  rating: string;
  leadSourceId: any;
  industryId: any;
  statusId: any;
  leadStatusID?: any;
}